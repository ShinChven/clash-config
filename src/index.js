const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const {PROXIES_DIR, RULES_DIR, BASE_CONFIG_PATH, SUBSCRIPTIONS_DIR} = require('./paths');

/**
 * Load proxies from the proxies' directory.
 * @returns {Promise<*[]>}
 */
const loadProxies = async () => {
  const proxies = [];

  const files = await fs.readdir(PROXIES_DIR);
  for (const file of files) {
    if (path.extname(file) === '.yaml') {
      const str = await fs.readFile(path.resolve(PROXIES_DIR, file), 'utf8');
      const proxy = yaml.load(str);
      proxies.push(proxy);
    }
  }
  return proxies;
}

const loadSubscriptionsProxies = async () => {
  const proxies = [];
  const files = await fs.readdir(SUBSCRIPTIONS_DIR);
  for (const file of files) {
    if (path.extname(file) === '.yaml') {
      const subscription_filepath = path.resolve(SUBSCRIPTIONS_DIR, file);
      const str = await fs.readFile(subscription_filepath, 'utf8');
      const subscription = yaml.load(str);
      if (Array.isArray(subscription.proxies)) {
        for (const proxy of subscription.proxies) {
          proxy.subscription_url = subscription.subscription_url;
          proxy.name = [proxy.name, subscription.subscription_name].join(' - ')
          proxies.push(proxy);
        }
      }
    }
  }
  return proxies;
}

/**
 * Generate the base proxy groups.
 * @param _proxies
 * @returns {Promise<({name: string, proxies: (string|string)[], type: string}|{name: string, interval: number, proxies: *, type: string, url: string, tolerance: number}|{name: string, interval: number, proxies: *, type: string, url: string}|{name: string, interval: number, proxies: *, type: string, strategy: string, url: string}|{name: string, proxies: *, type: string})[]>}
 */
const generateBaseProxyGroups = async (_proxies) => {
  const url = 'http://www.gstatic.com/generate_204';
  const proxies = _proxies.map((proxy) => proxy.name);

  const lowLatency = {
    name: 'Low Latency',
    type: 'url-test',
    url,
    interval: 300,
    tolerance: 50,
    proxies,
  }

  const fallback = {
    name: 'Fallback',
    type: 'fallback',
    url,
    interval: 300,
    proxies,
  }

  const manual = {
    name: 'Manual',
    type: 'select',
    proxies,
  }

  const loadBalance = {
    name: 'Load Balance',
    type: 'load-balance',
    strategy: 'consistent-hashing',
    url,
    interval: 300,
    proxies,
  }


  const main = {
    name: 'Main',
    type: 'select',
    proxies: [
      lowLatency.name,
      fallback.name,
      loadBalance.name,
      manual.name,
      'DIRECT',
    ]
  }

  return [main, lowLatency, fallback, loadBalance, manual];

}

/**
 * Load rule groups from the rules' directory.
 * @returns {Promise<*[]>}
 */
const loadRuleGroups = async () => {
  const ruleGroupsDirExists = await fs.pathExists(RULES_DIR);
  if (!ruleGroupsDirExists) {
    console.log('Rules directory does not exist. Copying default.');
    await fs.copy(path.resolve(__dirname, '../rules'), RULES_DIR);
  }
  const rules = [];
  const files = await fs.readdir(RULES_DIR);
  for (const file of files) {
    if (path.extname(file) === '.yaml') {
      let ruleGroupFilePath = path.resolve(RULES_DIR, file);
      const str = await fs.readFile(ruleGroupFilePath, 'utf8');
      const rule = yaml.load(str);
      rule.filepath = ruleGroupFilePath;
      rules.push(rule);
    }
  }
  return rules;
}

/**
 * Generate the proxy groups.
 * @param baseProxyGroups The base proxy groups.
 * @param ruleGroups The rule groups saved in files.
 * @returns {*[]}
 */
const generateProxyGroups = (baseProxyGroups, ruleGroups) => {
  const proxyGroups = [...baseProxyGroups];
  const proxies = baseProxyGroups.map((proxyGroup) => proxyGroup.name);
  proxies.push('DIRECT');
  proxies.push('REJECT');

  for (const ruleGroup of ruleGroups) {
    if (['purge', 'ad block', 'direct', 'reject'].indexOf(ruleGroup.name.toLowerCase()) === -1) {
      proxyGroups.push({
        name: ruleGroup.name,
        type: 'select',
        proxies,
      });
    }
  }

  proxyGroups.push({
    name: 'Everything Else',
    type: 'select',
    proxies,
  });

  proxyGroups.push({
    name: 'Ad Block',
    type: 'select',
    proxies: [
      'REJECT',
      'DIRECT',
    ]
  });

  proxyGroups.push({
    name: 'Purge',
    type: 'select',
    proxies: [
      'REJECT',
      'DIRECT',
    ]
  })

  return proxyGroups;

}

/**
 * Generate the rules array.
 * @param ruleGroups
 * @returns {string[]}
 */
const generateRules = (ruleGroups) => {
  const rules = [];
  for (const ruleGroup of ruleGroups) {
    for (const rule of ruleGroup.rules) {
      const ruleComponents = rule.split(',');
      ruleComponents.splice(2, 0, ruleGroup.name);
      rules.push(ruleComponents.join(','));
    }
  }
  rules.push('MATCH,Everything Else');
  return rules;
}

/**
 * Load base config from file.
 * @returns {Promise<*>}
 */
const loadBaseConfig = async () => {
  const baseConfigExists = await fs.pathExists(BASE_CONFIG_PATH);
  if (!baseConfigExists) {
    await fs.copy(path.resolve(__dirname, '../base.yaml'), BASE_CONFIG_PATH);
  }
  const input = await fs.readFile(BASE_CONFIG_PATH, 'utf8');
  return yaml.load(input);
}

/**
 * Generate the config object that can be parsed to yaml.
 * @returns {Promise<{proxies: any[], rules: string[],'proxy-groups':any[]}>}
 */
const generateConfig = async () => {

  const proxies = await loadProxies() || [];
  const subscriptionsProxies = await loadSubscriptionsProxies();
  proxies.push(...subscriptionsProxies);
  const baseProxyGroups = await generateBaseProxyGroups(proxies);
  const ruleGroups = await loadRuleGroups();
  const proxyGroups = generateProxyGroups(baseProxyGroups, ruleGroups);
  const rules = generateRules(ruleGroups);
  const baseConfig = await loadBaseConfig();

  const config = {
    proxies,
    'proxy-groups': proxyGroups,
    rules,
    ...baseConfig,
  };

  return JSON.parse(JSON.stringify(config));
}

module.exports = {
  loadBaseConfig,
  generateConfig,
  loadRuleGroups,
}
