const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const os = require('os');

const BASE_PATH = path.resolve(os.homedir(), '.config', 'clash');
const PROXIES_DIR = path.resolve(BASE_PATH, 'proxies');
const RULES_DIR = path.resolve(BASE_PATH, 'rules');
const BASE_CONFIG_PATH = path.resolve(BASE_PATH, 'base.yaml');

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

const loadRuleGroups = async () => {
  const ruleGroupsDirExists = await fs.pathExists(RULES_DIR);
  if (!ruleGroupsDirExists) {
    console.log('Rules directory does not exist. Copying default.');
    await fs.copy(path.resolve(__dirname,'../rules'), RULES_DIR);
  }
  const rules = [];
  const files = await fs.readdir(RULES_DIR);
  for (const file of files) {
    if (path.extname(file) === '.yaml') {
      const str = await fs.readFile(path.resolve(RULES_DIR, file), 'utf8');
      const rule = yaml.load(str);
      rules.push(rule);
    }
  }
  return rules;
}

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

const loadBaseConfig = async () => {
  const baseConfigExists = await fs.pathExists(BASE_CONFIG_PATH);
  if (!baseConfigExists) {
    await fs.copy(path.resolve(__dirname, '../base.yaml'), BASE_CONFIG_PATH);
  }
  const input = await fs.readFile(BASE_CONFIG_PATH, 'utf8');
  return yaml.load(input);
}

const generateConfig = async () => {

  const proxies = await loadProxies();
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
}
