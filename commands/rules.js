const tools = require('../tools.js');
const consts = require('../consts.js');
module.exports = {
	name: 'rules',
	description: 'Get the rules, in a shortened form.',
	execute(message, args) {
        const RULES_TEXT_FILENAME = "rules.txt";
        tools.printFileToDiscord(message, 1, RULES_TEXT_FILENAME);
	},
};
      