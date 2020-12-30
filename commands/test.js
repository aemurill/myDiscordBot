const tools = require('../tools.js');

module.exports = {
	name: 'test',
	description: 'Purely for testing',
	execute(message, args) {
        tools.sendMsg("THIS IS A TEST FUNCTION, WEIRD SHIT MIGHT HAPPEN", message);
        //pingOwner(message.guild, "Thanks for letting me join!");
	},
};