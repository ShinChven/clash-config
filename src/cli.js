#!/usr/bin/env node

const {generateConfig} = require('../src');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');


(async () => {
  console.log('Generating config...');
  const home = os.homedir();
  const config = await generateConfig();
  const configName = config['config-name'] || 'config-gen';
  const outputPath = path.resolve(home, '.config', 'clash', `${configName}.yaml`);
  await fs.outputFile(outputPath, yaml.dump(config));
  console.log('Clash config file generated at', outputPath);
})().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

