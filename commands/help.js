const tools = require('../tools.js');
const consts = require('../consts.js');
module.exports = {
  name: 'help',
  description: 'Some direction on how to use me.',
    execute(message, args) {
      const HELP_TEXT_FILENAME = "help.txt";
      config = tools.readJsonFromFileAsString(consts.CONFIG_FILENAME);

      /*if (discordClient.commands.has(mCommand)){
        //if (!discordClient.commands.has(mCommand)) return;
        try {
          let command = discordClient.commands.get(mCommand)
          if (command.guildOnly && m.channel.type === 'dm') {
            return m.reply('I can\'t execute that command inside DMs!');
          }
                    
          if(mCommand == 'talk'){
            command.execute(m, mArgs, discordClient)
          }
          else command.execute(m, mArgs);
            return;
        } catch (error) {
          console.error(error);
            m.reply('there was an error trying to execute that command!');
        }
      }*/
        
      tools.sendReply("type \`"+config.prefix+"\` before using any of these commands",message);
      tools.printFileToDiscord(message, 0, HELP_TEXT_FILENAME);
	},
};
      