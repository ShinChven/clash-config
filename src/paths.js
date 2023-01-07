const path = require('path');
const os = require('os');

const BASE_PATH = path.resolve(os.homedir(), '.config', 'clash');
const PROXIES_DIR = path.resolve(BASE_PATH, 'proxies');
const SUBSCRIPTIONS_DIR = path.resolve(BASE_PATH, 'subscriptions');
const RULES_DIR = path.resolve(BASE_PATH, 'rules');
const BASE_CONFIG_PATH = path.resolve(BASE_PATH, 'base.yaml');

module.exports = {
  BASE_PATH,
  PROXIES_DIR,
  SUBSCRIPTIONS_DIR,
  RULES_DIR,
  BASE_CONFIG_PATH,
}
