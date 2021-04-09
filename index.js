"use strict";
const fs = require('fs');
const tools = require('./tools.js');
const consts = require('./consts.js');
const util = require('util');
const dotenv = require('dotenv');
dotenv.config();

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const readline = require('readline');
const { create } = require('domain');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'CMD>'
});

//FILE CONSTS
//const CONFIG_FILENAME = "config.json";
const BANLIST_FILENAME = "banlist.json";
//const RULES_TEXT_FILENAME = "rules.txt";
const TALKING_POINTS_TEXT_FILENAME = "talkingpoints.txt";
//const HELP_TEXT_FILENAME = "help.txt";

var config = {};
var default_config = {
  prefix: process.env.DISCORD_PREFIX,
  languageCode: 'en-US',
  reqrole: "bot-tester"
};
var banlist = {};
var banmap = new Map();

if(Object.entries(config).length === 0)
  tools.writeStringAsJsonToFile(consts.CONFIG_FILENAME, default_config);
config = tools.readJsonFromFileAsString(consts.CONFIG_FILENAME);

if(Object.entries(banlist).length === 0)
  tools.writeStringAsJsonToFile(BANLIST_FILENAME, banlist);
banlist = tools.readJsonFromFileAsString(BANLIST_FILENAME);

function loadBanList(){
  banmap = new Map(Object.entries(banlist));
}

loadBanList();

function updateBanlist() {
  banmap.forEach(function(value, key){
      banlist[key] = value
  });

  tools.writeStringAsJsonToFile(BANLIST_FILENAME, banlist);
}

//Needs fix
async function pingOwner(guild, text){
  //var owner = guild.owner;
  //return discordClient.users.fetch(guild.ownerID).send(text);
  //return guild.owner.user.send(text);
  console.log("pingowner: ")
  console.log(guild.members.cache ? "exists" : "does not exist")
  console.log("ownerID: ")
  console.log(guild.ownerID ? "exists" : "does not exist")

  await guild.members.fetch(guild.ownerID).then(async () => {
    //console.log(guild.members.cache.get(guild.ownerID));
    await guild.owner.user.send(text);
    console.log("Sending: \n["+text+"] to " + guild.owner.user.username)
    
  }).catch(error => {
    console.error(error);
  })
  //guild.owner.send(text);
}

async function pingOwners(func, text){
  discordClient.guilds.cache.map(async (guild) => {
    console.log("pingownerS")
    //console.log(guild)
    await pingOwner(guild, text)
    if(func!= null){
      //const promise = pingOwner(guild, text);
      //promise.then(function(value){
        func();
      //});
    }
  })
}

//Commands Modularization
discordClient.commands = new Discord.Collection();
try{
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    discordClient.commands.set(command.name, command);
    console.log(command.name + ' found!');
  }
}
catch(err){
  if(err.code == 'ENOENT'){
    console.log(`No commands found`);
  }
  else console.log(err)
}

//DISCORD LOGIN
discordClient.login(process.env.DISCORD_TOKEN).then(()=>{
  discordClient.user.setActivity("Use \`"+config.prefix+"\` help for assistance!"); 
  console.log("Logging In")
});

discordClient.on('ready', () => {
  console.log('Ready!');
  pingOwners(null, tools.HORZ_LINE_JAGGED+"\nI'm back online!");
  console.info(`Logged in as ${discordClient.user.tag}!`);
  console.info(`Logged in as ${discordClient.user.username}!`);
});

function createRoles(guild){  
  guild.fetch().then(result=>{
    console.log(`guild fetched`);		
    guild.roles.fetch()
    .then(result => {
      console.log(`guild roles fetched`);		
      for(const element of consts.ID_ROLES){ //GO OVER ROLE LIST
        console.log(`Checking for `+element+`...`);		
        let myRole = tools.getRoleByValue(guild.roles.cache, element)		
        if(myRole == undefined){ //Missing Role
          console.log(`missing `+element+` role, creating...`);		
          //let myRole = message.guild.roles.cache.get(role);
          //tools.sendReply(`${myRole.name} is what you selected`,message);				
          guild.roles.create({
            data: {
              name: element
            },
            reason: 'Bot is creating roles'
          })
            .then(console.log)
            .catch(error =>{
              console.error(error);// error(message);
            })
        }
        else{
          console.log(`[`+element+`] exists!`);		
        }
      }
    })
    .catch(error =>{
      console.error(error);// error(message);
    });		
  }).catch(error =>{
    console.error(error);// error(message);
  })  
}

discordClient.on('guildCreate',guild=>{
  console.log("created")
  pingOwner(guild, "Thanks for letting me join!");
  createRoles(guild);
});

var mContent
var mContentSplit;
var mCommand;
var mArgs;

let context;

/*function commandRules(m, mode){
  tools.printFileToDiscord(m, mode, RULES_TEXT_FILENAME);
}*/

/*
 *  HELP
 */

/*function commandHelp(m){
  sendReply("type \`"+config.prefix+"\` before using any of these commands",m);
  printFileToDiscord(m, 0, HELP_TEXT_FILENAME);
}*/

/*
 *  Talk with my Dialogflow Agent
 */

/*async function commandTalk(m){
  const sessionID = 'discordbot';
  var result = 0;
  var value = 0;
  if(mArgs.length > 0){
    var message = argsAsString(0);
    console.log("msg:"+message);
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
      commandRules(m, 0);
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
}*/


/*
 *  Let Me Google That For You
 */

/*function commandLMGTFY(m){
  var index = 0;
  var target;
  if(mArgs.length > 0){
    if(isMention(mArgs[0])){ 
      index = 1;
      target = getUserFromMention(mArgs[0]);
    }        
    var string = tools.argsAsString(index);
    string = "https://lmgtfy.com/?q=" + string;
    string = encodeURI(string);

    if(target != undefined){
      return tools.sendPing('Let Me Google That For You: ' + string,m, target);  
    }
    return tools.sendReply('Let Me Google That For You: ' + string,m);
  }else{
    return tools.sendReply('Do \`lmgtfy <Query>\`, or \`lmgtfy @someone <Query>\`.'+
      '\nYou put in an empty query, dude.', m);
  }
}*/


/*
 *  MAIN CONFIG COMMAND CODE
 */
//TODO: implement better command handling  https://discordjs.guide/command-handling/

//m.member.roles.find is not a function
function commandAdmin(m){
  if(!tools.isFromRoleMember(m, config.reqrole) && !tools.isAuthorAdmin(m)){
    printInvalidAccess(m); 
    return;
  }
  //mContentSplit;
  //mCommand;
  //mArgs;
  var adminCommand = mArgs[0];
  var doPrintDone = true;
  switch(adminCommand){
    case 'set':
        var setCommand = mArgs[1];
        var doDefault2 = true;
        var value = mArgs[2];
        switch(setCommand){
          case 'prefix':            
            if(value == undefined) break;
            doDefault2 = false;
            config.prefix = value;
            tools.writeStringAsJsonToFile(consts.CONFIG_FILENAME, config);
            break;
          case 'reqrole':
            if(value == undefined) break;
            doDefault2 = false;
            config.reqrole = value;
            tools.writeStringAsJsonToFile(consts.CONFIG_FILENAME, config);
            break;
        }
        if(doDefault2){
          doPrintDone = false;
          tools.sendReply("Use as \`config set <option> <value>\`",m);
        }
        break;
    case 'botban':
        var value = mArgs[1];
        value = value.replace(/[\\<>@#&!]/g, "");
        var user = discordClient.users.get(value);
        if(user != undefined){
          banmap.set(user.id, user.username);
          updateBanlist();
        }
        break;
    case 'unbotban':
        var value = mArgs[1];
        value = value.replace(/[\\<>@#&!]/g, "");        
        discordClient.fetchUser(value);
        if(user != undefined){
          banmap.delete(user.id, user.username);
          updateBanlist();
        }
        break;
    case 'default':        
        tools.writeStringAsJsonToFile(consts.CONFIG_FILENAME, default_config);
        tools.readJsonFromFileAsString(consts.CONFIG_FILENAME, default_config);
        console.log(config);
        banmap = new Map();
        updateBanlist();
        console.log(banlist);
        break;
    default:
        tools.printFileToDiscord(m, 1, "config_help.txt");
        doPrintDone = false;
  }
  if(doPrintDone){
    tools.sendMsg('Done!', m);
  }
}

function printInvalidAccess(m){
  return tools.sendReply("Only admins can use \`config\`!", m);
}

/*function argsAsString(index){
  var string = "";
  for(var i = index; i < mArgs.length; i++){
    string += mArgs[i] + " ";
  }
  return string;
  //return mMini.substring(mMini.indexOf(mArgs[0]), mContent.length);
}

function isFromRoleMember(m, role){
  if(role == null) return true;
  return m.member.roles.find(r => r.name === role);
}*/

function isUserBanned(m){
  loadBanList();
  return banmap.has(m.author.id);
}

/*
 *  MAIN MESSAGE RESPONSE CODE
 */

discordClient.on('message', m => {
  if (isUserBanned(m)) return;
  if (isSameSender(m)) return;
  console.log("\n\n"+tools.HORZ_LINE_DOUBLE);
  console.log('Accepted Message:'+m.content);
  console.log(tools.HORZ_LINE_SINGLE);
  mContent = m.content;
  if (isInvokedViaPrefix(m)) {
    //check if invoked with a prefix
    mContent = mContent.slice(config.prefix.length); 
    mContent = mContent.trim();
  }else if(!isInvokedViaDM(m)){
    //if not invoked with a prefix in a non-DM, don't do anything.
    if(isPinged(m)){
      //print message because we want prefix, not pings.
      return tools.sendReply('Send me messages using \`'+ config.prefix +
        '\`. Just don\'t ping me!', m);
    }
    return;
  }
  //console.log(":"+mContent);
  mContentSplit = mContent.split(/ +/);
  mCommand = mContentSplit[0];
  mArgs = mContentSplit.slice(1);
  
  
  console.log("Command:"+mCommand);
  console.log("Args:"+mArgs);

  console.log(tools.HORZ_LINE_SINGLE);
  //check if modular command
  if (discordClient.commands.has(mCommand)){
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
  }
  //check if non-modular command
  switch(mCommand){
    /*case 'rules':
      commandRules(m, 1);
      break;
      */
    default: //DEFAULT FALLBACK
      return tools.sendReply('use \`'+config.prefix + ' help\` to get help!', m);
  }
});

function isInvokedViaPrefix(message) {
  var hasPrefix = message.content.startsWith(config.prefix);
  var state = hasPrefix;
  //console.log('prefix: ' + hasPrefix);
  return hasPrefix;
}

function isInvokedViaDM(message){
  var isDirectM = message.channel.type === 'dm';
  //console.log('dm: ' + isDirectM);
  return isDirectM;
}

function isSameSender(message){
  var sameSender = discordClient.user.id == message.author.id;
  //console.log('bot!=author: ' + sameSender);
  return sameSender;
}

function isPinged(message){
  var isMentioned = message.mentions.has(discordClient.user);
  //apparently isMemberMentioned will be depreciated soon
  return isMentioned;
}

/*function isMention(mention){
  var state = mention.startsWith('<@') && mention.endsWith('>');
  return state;
}*/

/*function getUserFromMention(m, mention) {
	if (!mention) return undefined;

	if (tools.isMention(mention)) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!') || mention.startsWith('&')) {
      mention = mention.slice(1);
      return m.mentions.users.get(mention);
		}
    console.log("failed" + mention);
	}
}*/

/* CMD PROMPT START */
function close(){  
  rl.close();
  console.log("goodbye!")
  process.exit(0);
}

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'help':
      console.log('hello, close, help');
      break;
    case 'hello':
      console.log('world!');
      break;
    case 'close':
      rl.close();
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
    pingOwners(close, tools.HORZ_LINE_JAGGED+"\nI'm shutting down for the time being, sorry for any inconvenience").catch(error => {
    console.error(error);
  });        
});

/*rl.question('quit', (answer)=>{
    process.exit(0);
})*/

/* END CMD PROMPT */