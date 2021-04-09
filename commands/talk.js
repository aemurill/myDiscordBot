const tools = require('../tools.js');
const consts = require('../consts.js');
const dfi = require('../dialogflowIntegration.js');

async function commandTalk(m, mArgs, discordClient){
    const sessionID = 'discordbot';
    var config = tools.readJsonFromFileAsString(consts.CONFIG_FILENAME);
    var result = 0;
    var value = 0;
    if(mArgs.length > 0){
      var string = "";
      for(var i = 0; i < mArgs.length; i++){
        string += mArgs[i] + " ";
      }
      var message = string;
      console.log("msg:"+message);
      //The current issue is that context is stored for the entire BOT rather than per user. Honestly this command is pretty badly thought out overall so keeping it in a /useless/ state is for the best.
      result = await dfi.detectTextIntent(process.env.PROJECT_ID, sessionID, [message], 
                                      config.languageCode, m, context);
      context = result.context;   
      value = result.value;
      var fulfillM = result.message;
      console.log("Value: "+value);
      console.log("TT:"+context);
      dfi.printFulfillmentMessages(fulfillM, tools.sendReply, tools.sendMsg, m)
    }else{
      return tools.sendMsg('You didn\'t say anything?', m);
    }
  
    switch(value){
      case 1:
        try {
          let command = discordClient.commands.get(mCommand)
          if (command.guildOnly && m.channel.type === 'dm') {
            return m.reply('I can\'t execute that command inside DMs!');
          }
    
          command.execute(m, mArgs);
          return;
        } catch (error) {
          console.error(error);
          m.reply('there was an error trying to execute that command!');
        }
        break;
      case 2:
        tools.printFileToDiscord(m, 0, TALKING_POINTS_TEXT_FILENAME);
        break;
      case -2:
        tools.sendMsg('Sorry, an error occured.', m);
        break;
      case 0:
        break;
    }
  }

module.exports = {
	name: 'talk',
	description: 'Talk to the Dialogflow bot?',
	execute(message, args, discordClient) {
        //commandTalk(message, args, discordClient); NO LONGER NECESSARY
        tools.sendReply("Sorry this is disabled.", message);
	},
};
      