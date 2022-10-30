const {generateConfig} = require('../index');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

/**
 * Generate the config file.
 * @returns {Promise<void>}
 */
const generateConfigFile = async () => {
  console.log('Generating config...');
  const home = os.homedir();
  const config = await generateConfig();
  const configName = config['config-name'] || 'config-gen';
  const outputPath = path.resolve(home, '.config', 'clash', `${configName}.yaml`);
  await fs.outputFile(outputPath, yaml.dump(config));
  console.log('Clash config file generated at', outputPath);
}

module.exports = generateConfigFile;
