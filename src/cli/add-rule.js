const {loadRuleGroups} = require('../index');
const {RULES_DIR} = require('../paths');
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

/**
 * Add a rule.
 * @returns {Promise<void>}
 */
const addRule = async () => {
  const [, , , domain, ruleGroupName = 'My Rules', ruleType = 'DOMAIN-SUFFIX'] = process.argv;
  if (!domain) {
    console.log('No domain provided');
    return;
  }
  const ruleGroups = await loadRuleGroups();

  const ruleGroupIndex = ruleGroups.findIndex((ruleGroup) => ruleGroup.name === ruleGroupName);

  const ruleGroup = ruleGroups[ruleGroupIndex] || {
    name: ruleGroupName,
    filepath: path.resolve(RULES_DIR, `my-rules.yaml`),
    rules: [],
  };

  const rule = [ruleType, domain].join(',');
  ruleGroup.rules.push(rule);
  const file = ruleGroup.filepath;
  delete ruleGroup.filepath;
  await fs.outputFile(file, yaml.dump(ruleGroup));
  console.log('Rule: "' + rule + '" added to "' + ruleGroup.name + '" in ' + file);

}

module.exports = addRule;
