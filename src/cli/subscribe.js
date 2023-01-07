const http = require('superagent');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const {SUBSCRIPTIONS_DIR} = require('../paths');
const path = require('path');

const subscribeToClash = async (url, name = new Date().getTime() + '') => {
  const resp = await http.get(url);
  const text = resp.text;
  const config = yaml.load(text);
  config.subscription_url = url;
  config.subscription_name = name;
  config.subscription_type = 'clash';
  await fs.ensureDir(SUBSCRIPTIONS_DIR);
  await fs.outputFile(path.resolve(SUBSCRIPTIONS_DIR, `${name}.yaml`), yaml.dump(config));
}

const subscribe = async () => {
  const [, , , type, url, name] = process.argv;
  switch (type) {
    case 'clash':
      await subscribeToClash(url, name);
      break;
    default:
      console.log('Unknown subscription type', type);
  }
}

module.exports = {subscribe, subscribeToClash};
