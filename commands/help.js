const tools = require('../tools.js');
const consts = require('../consts.js');
module.exports = {
	name: 'help',
	description: 'Some direction on how to use me.',
	execute(message, args) {
        const HELP_TEXT_FILENAME = "help.txt";
        config = tools.readJsonFromFileAsString(consts.CONFIG_FILENAME);
        //sendReply('Use \`'+ config.prefix + 
        //    'talk <Message>\` to send a message to me!', m);
        tools.sendReply("type \`"+config.prefix+"\` before using any of these commands",message);
        tools.printFileToDiscord(message, 0, HELP_TEXT_FILENAME);
	},
};
      