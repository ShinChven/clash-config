#!/usr/bin/env node
const generateConfigFile = require('./generate-config');
const addRule = require('./add-rule');

const [, , action] = process.argv;

(async () => {
  if (!action) {
    return await generateConfigFile();
  }

  switch (action) {
    case 'add-proxy':
      break;
    case 'add-rule':
      await addRule();
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


