const {generateConfig} = require('../index');

/**
 * Search a rule.
 * @returns {Promise<void>}
 */
const searchRule = async () => {
  const [, , , keyword] = process.argv;
  const config = await generateConfig();
  for (const rule of config.rules) {
    if (rule.includes(keyword)) {
      console.log(rule);
    }
  }
  console.log('* Above are the managed rules, those you edited manually will not be shown.');
};

module.exports = searchRule;
