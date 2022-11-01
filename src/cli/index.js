#!/usr/bin/env node
const generateConfigFile = require('./generate-config');
const addRule = require('./add-rule');
const addProxy = require('./add-proxy');
const searchRule = require('./search-rule');

const [, , action] = process.argv;

(async () => {
  // If no action is passed, generate the config file.
  if (!action) {
    return await generateConfigFile();
  }

  switch (action) {
    case 'add-proxy':
      await addProxy();
      break;
    case 'add-rule':
      await addRule();
      break;
    case 'search-rule':
      await searchRule();
      break;
    default:
      console.log('Unknown action', action);
  }

})().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});


