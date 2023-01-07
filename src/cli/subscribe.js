const http = require('superagent');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const {SUBSCRIPTIONS_DIR} = require('../paths');
const path = require('path');
const {decodeV2raySubscription} = require('../proxy/v2ray');

/**
 * Subscribe to a V2Ray subscription.
 * @param url {string} The subscription url.
 * @param name  {string} The subscription name and file name in subscriptions directory.
 * @returns {Promise<void>}
 */
const subscribeToV2ray = async (url, name = new Date().getTime() + '') => {
  try {
    const resp = await http.get(url);
    const text = resp.text;
    const proxies = decodeV2raySubscription(text);
    const config = {
      proxies,
      subscription_url: url,
      subscription_name: name,
      subscription_type: 'v2ray',
    };
    await fs.ensureDir(SUBSCRIPTIONS_DIR);
    await fs.outputFile(path.resolve(SUBSCRIPTIONS_DIR, `${name}.yaml`), yaml.dump(config));
    console.log('subscription loaded:', url, name, config.subscription_type);
  } catch (e) {
    console.error(e);
    console.error('Failed to subscribe to', url, name);
  }
}

/**
 * Subscribe to a Clash subscription.
 * The url should return a YAML file of clash configuration.
 * @param url {string} The subscription url.
 * @param name  {string} The subscription name and file name in subscriptions directory.
 * @returns {Promise<void>}
 */
const subscribeToClash = async (url, name = new Date().getTime() + '') => {
  try {
    const resp = await http.get(url);
    const text = resp.text;
    const config = yaml.load(text);
    config.subscription_url = url;
    config.subscription_name = name;
    config.subscription_type = 'clash';
    await fs.ensureDir(SUBSCRIPTIONS_DIR);
    await fs.outputFile(path.resolve(SUBSCRIPTIONS_DIR, `${name}.yaml`), yaml.dump(config));
    console.log('subscription loaded:', url, name, config.subscription_type);
  } catch (e) {
    console.error(e);
    console.error('Failed to subscribe to', url, name);
  }
}

/**
 * Update all subscriptions
 * @returns {Promise<void>}
 */
const updateSubscriptions = async () => {
  const files = await fs.readdir(SUBSCRIPTIONS_DIR);
  for (const file of files) {
    try {
      if (path.extname(file) === '.yaml') {
        const subscription_filepath = path.resolve(SUBSCRIPTIONS_DIR, file);
        const str = await fs.readFile(subscription_filepath, 'utf8');
        const subscription = yaml.load(str);
        if (subscription.subscription_type === 'clash') {
          await subscribeToClash(subscription.subscription_url, subscription.subscription_name);
        } else if (subscription.subscription_type === 'v2ray') {
          await subscribeToV2ray(subscription.subscription_url, subscription.subscription_name);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * CLI function to subscribe to a proxy subscription.
 * @returns {Promise<void>}
 */
const subscribe = async () => {
  const [, , , type, url, name] = process.argv;
  switch (type) {
    case 'clash':
      await subscribeToClash(url, name);
      break;
    case 'v2ray':
      await subscribeToV2ray(url, name);
      break;
    default:
      console.log('Unknown subscription type', type);
  }
}

module.exports = {subscribe, updateSubscriptions, subscribeToClash, subscribeToV2ray};
