const tools = require('../tools.js');

function commandLMGTFY(m, args){
    var index = 0;
    var target;
    if(args.length > 0){ 
      if(tools.isMention(args[0])){  //check if first arg is mention
        target = args[0]
        index++;
      }        
      var string = tools.argsAsString(index, args);
      string = "https://lmgtfy.com/?q=" + string;
      string = encodeURI(string);
  
      if(target != undefined && m.channel.type !== 'dm'){
        return tools.sendPing('Let Me Google That For You: ' + string,m, target);  
      }
      return tools.sendReply('Let Me Google That For You: ' + string,m);
    }else{
      return tools.sendReply('Do \`lmgtfy <Query>\`, or \`lmgtfy @someone <Query>\`.'+
        '\nYou put in an empty query, dude.', m);
    }
}

module.exports = {
	name: 'lmgtfy',
	description: 'Google that for yourself, or someone else!',
	execute(message, args) {
        commandLMGTFY(message, args);
	},
};