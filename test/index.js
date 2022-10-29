const {generateConfig} = require('../src');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

(async () => {
  const config = await generateConfig();
  await fs.ensureDir(path.resolve('build'));
  await fs.outputFile(path.resolve('build/config.yaml'), yaml.dump(config));
  const home = os.homedir();
  const outputPath = path.resolve(home, '.config', 'clash', `config-gen.yaml`);
  await fs.outputFile(outputPath, yaml.dump(config));
})().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
