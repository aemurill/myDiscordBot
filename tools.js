const fs = require('fs');

const HORZ_LINE_SINGLE = 
  "--------------------------------------------------------------";
const HORZ_LINE_DOUBLE = 
  "==============================================================";
const HORZ_LINE_JAGGED = 
  "<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>";

function getFileAsString(filename){
    var text = "There are no rules!";
    try {
        text = fs.readFileSync(filename,'utf8');
    } catch (err){
        console.log(err);
        return err;
    }
    console.log(text);
    return text;
};

function writeStringAsJsonToFile(filename, string){
    /*if(!fs.existsSync(filename)){
        fs.openSync(filename)
    }*/
    var json = JSON.stringify(string);
    fs.writeFileSync(filename, json, 'utf8');
}

// returns json
function readJsonFromFileAsString(filename){
    var json = fs.readFileSync(filename, 'utf8');
    var string = JSON.parse(json);
    return string;
}

function sendReply(text, message){
    console.log(HORZ_LINE_JAGGED+"\nSending Reply:");
    console.log(text);
    if(message.channel.type == "dm"){
      message.channel.send(text);
    }else{
      message.reply(text);
    }
  }
  
  function sendMsg(text, message){
    console.log(HORZ_LINE_JAGGED+"\nSending Msg:");
    console.log(text);
    message.channel.send(text);
  }
  
  function sendPing(text, message, user){
    console.log(HORZ_LINE_JAGGED+"\nSending Ping:");
    console.log(text);
    message.channel.send(user + ", " + text);
  }
  
  //mode: 1 - as Reply, else - as Msg
  function printFileToDiscord(m, mode, filename){
    if(mode == 1) sendReply(getFileAsString(filename), m);
    else sendMsg(getFileAsString(filename), m);
  }
  
  //unused?
  function remove(username, text) {
    return text.replace('@' + username + ' ', '')
      .replace(process.env.DISCORD_PREFIX + ' ', '');
  }
  
  function isAuthorAdmin(m){
    return m.member.hasPermission('ADMINISTRATOR');
  }

  function argsAsString(index, args){
    var string = "";
    for(var i = index; i < args.length; i++){
      string += args[i] + " ";
    }
  return string;
  //return mMini.substring(mMini.indexOf(mArgs[0]), mContent.length);
  }

  function isFromRoleMember(m, role){
    if(role == null) return true;
    return m.member.roles.find(r => r.name === role);
  }

  function isMention(mention){
    var state = mention.startsWith('<@') && mention.endsWith('>');
    return state;
  }

  function getUserFromMention(m, mention) {
	if (!mention) return undefined;

	if (isMention(mention)) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!') || mention.startsWith('&')) {
            mention = mention.slice(1);
            return m.mentions.users.get(mention);
		}
    console.log("failed" + mention);
    }
  }

  //feed me roles
  function getRoleByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value.name === searchValue)
        return value;
    }
  }

  module.exports = {
    getFileAsString,
    writeStringAsJsonToFile,
    readJsonFromFileAsString,
    sendReply,
    sendMsg,
    sendPing,
    printFileToDiscord,
    remove,
    isAuthorAdmin,
    argsAsString,
    isFromRoleMember,
    isMention,
    getUserFromMention,
    getRoleByValue,
    HORZ_LINE_SINGLE,
    HORZ_LINE_DOUBLE,
    HORZ_LINE_JAGGED
}