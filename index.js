"use strict";
const tools = require('./tools.js');


// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const util = require('util');
//const dialogflowClient = new dialogflow.SessionsClient();
// Define session path
const sessionID = 'discordbot';
//const sessionPath = dialogflowClient.sessionPath(process.env.PROJECT_ID, 'discordbot');

const Discord = require('discord.js');
const discordClient = new Discord.Client();

const CONFIG_FILENAME = "config.json";
const BANLIST_FILENAME = "banlist.json";
const RULES_TEXT_FILENAME = "rules.txt";
const TALKING_POINTS_TEXT_FILENAME = "talkingpoints.txt";
const HELP_TEXT_FILENAME = "help.txt";

var config = {};
var default_config = {
  prefix: process.env.DISCORD_PREFIX,
  languageCode: 'en-US',
  reqrole: "bot-tester"
};
var banlist = {};
var banmap = new Map();

if(Object.entries(config).length === 0)
  tools.writeStringAsJsonToFile(CONFIG_FILENAME, default_config);
config = tools.readJsonFromFileAsString(CONFIG_FILENAME);

if(Object.entries(banlist).length === 0)
  tools.writeStringAsJsonToFile(BANLIST_FILENAME, banlist);
banlist = tools.readJsonFromFileAsString(BANLIST_FILENAME);

loadBanList();

function updateBanlist() {
  banmap.forEach(function(value, key){
      banlist[key] = value
  });

  tools.writeStringAsJsonToFile(BANLIST_FILENAME, banlist);
}

function loadBanList(){
  banmap = new Map(Object.entries(banlist));
}


discordClient.on('ready', () => {
  console.log('Ready!');
  console.info(`Logged in as ${discordClient.user.tag}!`);
  console.info(`Logged in as ${discordClient.user.username}!`);
});

var mContent
var mContentSplit;
var mCommand;
var mArgs;

let context;

function sendReply(text, message){
  if(message.channel.type == "dm"){
    message.channel.send(text);
  }else{
    message.reply(text);
  }
}

function sendMsg(text, message){
  message.channel.send(text);
}

function sendPing(text, message, user){
  message.channel.send(user + ", " + text);
}

function printFileToDiscord(m, mode, filename){
  if(mode == 1) sendReply(tools.getFileAsString(filename), m);
  else sendMsg(tools.getFileAsString(filename), m);
}

function isAuthorAdmin(m){
  console.log("is admin?"+m.member.hasPermission('ADMINISTRATOR'));
  return m.member.hasPermission('ADMINISTRATOR');
}

function commandRules(m, mode){
  printFileToDiscord(m, mode, RULES_TEXT_FILENAME);
}

/*
 *  HELP
 */

function commandHelp(m, mode){
  printFileToDiscord(m, mode, HELP_TEXT_FILENAME);
}

/*
 *  Talk with my Dialogflow Agent
 */

function commandTalk(m){
  if(mArgs.length > 0){
    var message = argsAsString(0);
    console.log("msg:"+message);
    detectTextIntent(process.env.PROJECT_ID, sessionID, [message], 
      config.languageCode, m);
    console.log("TT:"+context);
  }else{
    return sendMsg('You didn\'t say anything?', m);
  }
}

/*
 *  Let Me Google That For You
 */

function commandLMGTFY(m){
  var index = 0;
  var target;
  if(mArgs.length > 0){
    if(isMention(mArgs[0])){ 
      index = 1;
      target = getUserFromMention(mArgs[0]);
    }        
    var string = argsAsString(index);
    string = "https://lmgtfy.com/?q=" + string;
    string = encodeURI(string);

    if(target != undefined){
      return sendPing('Let Me Google That For You: ' + string,m, target);  
    }
    return sendReply('Let Me Google That For You: ' + string,m);
  }else{
    return sendReply('Do \`lmgtfy <Query>\`, or \`lmgtfy @someone <Query>\`.'+
      '\nYou put in an empty query, dude.', m);
  }
}


/*
 *  MAIN CONFIG COMMAND CODE
 */

function commandAdmin(m){
  if(!isFromRoleMember(m, config.reqrole) && !isAuthorAdmin(m)){
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
            tools.writeStringAsJsonToFile(CONFIG_FILENAME, config);
            break;
          case 'reqrole':
            if(value == undefined) break;
            doDefault2 = false;
            config.reqrole = value;
            tools.writeStringAsJsonToFile(CONFIG_FILENAME, config);
            break;
        }
        if(doDefault2){
          doPrintDone = false;
          sendReply("Use as \`config set <option> <value>\`",m);
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
        tools.writeStringAsJsonToFile(CONFIG_FILENAME, default_config);
        tools.readJsonFromFileAsString(CONFIG_FILENAME, default_config);
        console.log(config);
        banmap = new Map();
        updateBanlist();
        console.log(banlist);
        break;
    default:
        printFileToDiscord(m, 1, "config_help.txt");
        doPrintDone = false;
  }
  if(doPrintDone){
    sendMsg('Done!', m);
  }
}

function printInvalidAccess(m){
  return sendReply("Only admins can use \`config\`!", m);
}

function argsAsString(index){
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
}

function isUserBanned(m){
  loadBanList();
  console.log(banmap.has(m.author.id));
  return banmap.has(m.author.id);
}

/*
 *  MAIN MESSAGE RESPONSE CODE
 */

discordClient.on('message', m => {
  if (isUserBanned(m)) return;
  if (isSameSender(m)) return;
  console.log("===================================");
  console.log('m:'+m.content);
  console.log("--------------------------------------------------------------");
  mContent = m.content;
  if (isInvokedViaPrefix(m)) {
    mContent = mContent.slice(config.prefix.length); 
    mContent = mContent.trim();
  }else if(!isInvokedViaDM(m)){
    if(isPinged(m)){
      return sendReply('Send me messages using \`'+ config.prefix +
        '\`. Just don\'t ping me!', m);
    }
    return;
  }
  console.log("tm:"+mContent);
  mContentSplit = mContent.split(/ +/);
  mCommand = mContentSplit[0];
  mArgs = mContentSplit.slice(1);
  
  
  console.log(mCommand);
  console.log(mArgs);

  switch(mCommand){
    case 'help':
      //return sendReply('Use \`'+config.prefix+
      //  'talk <Message>\` to send a message to me!', m);
      commandHelp(m, 1);
      break;
    case 'rules':
      commandRules(m, 1);
      break;
    case 'talk':
      commandTalk(m);
      break;
    case 'lmgtfy':
      commandLMGTFY(m);
      break;
    case 'admin':
      commandAdmin(m);
      break;
    default: //DEFAULT FALLBACK
      return sendReply('use \`'+config.prefix + ' help\` to get help!', m);
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
  var isMentioned = message.isMemberMentioned(discordClient.user);
  //apparently isMemberMentioned will be depreciated soon
  return isMentioned;
}

function isMention(mention){
  var state = mention.startsWith('<@') && mention.endsWith('>');
  return state;
}

function getUserFromMention(mention) {
	if (!mention) return undefined;

	if (isMention(mention)) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!') || mention.startsWith('&')) {
      mention = mention.slice(1);
      return discordClient.users.get(mention);
		}
    console.log("failed" + mention);
	}
}

async function detectIntent(projectId, sessionId, sessionClient, query, 
    contexts, languageCode) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  //console.log("asfs: "+util.inspect(request, {depth: null}));
  const responses = await sessionClient.detectIntent(request);
  //console.log("adf"+util.inspect(responses[0], {depth:null}));
  return responses[0];
}

function printFulfillmentMessages(fulfillmentMessages, m){
  //console.log("fm:"+util.inspect(fulfillmentMessages, {depth:null}));
  var ctr = 0;
  for(var i = 0; i < fulfillmentMessages.length; i++){
    var item = fulfillmentMessages[i];
    //console.log(item);
    if(item.hasOwnProperty('text')){
      var string = item.text.text[0];
      console.log("str:"+ string);
      if(ctr == 0){
        sendReply(string, m);
        ctr++;
      }
      else sendMsg(string, m);
    }
  }
}

function dialogflowTalkingPoints(m){
  printFileToDiscord(m, 0, TALKING_POINTS_TEXT_FILENAME);
}

async function executeQueries(projectId, sessionId, sessionClient, 
                              queries, languageCode, message) {
  // Keeping the context across queries let's us simulate an ongoing 
  // conversation with the bot

  //let context;
  let intentResponse;
  for (const query of queries) {
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = 
        await detectIntent(projectId, sessionId, sessionClient, 
                          query, context, languageCode);
      console.log('Detected intent');
      printFulfillmentMessages(intentResponse.queryResult.fulfillmentMessages,
         message);
      //console.log(
      //  `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
      //);
      //message.channel.send(`${intentResponse.queryResult.fulfillmentText}`);
      var flag = intentResponse.queryResult.intent.displayName;
      console.log("queryResult: "+util.inspect(intentResponse.queryResult,
        {depth:null}));
      switch(flag){
        case 'WhatAreTheRules':
            commandRules(message, 0);
            break
        case 'WhatElseCanIDo':
            dialogflowTalkingPoints(message);
            break
      }
      // Use the context from this response for next queries
      context = intentResponse.queryResult.outputContexts;
      console.log("output context: " + util.inspect(context, {depth:null}));
    } catch (error) {
      console.log(error);
    }
  }
}

function detectTextIntent(projectId, sessionId, queries, languageCode, message){
  // [START dialogflow_detect_intent_text]
  // projectId: ID of the GCP project where Dialogflow agent is deployed
  // sessionId: Random number or hashed user identifier
  // queries: A set of sequential queries to be send to Dialogflow agent for
  //    Intent Detection
  // languageCode: Indicates the language Dialogflow agent should use to 
  //    detect intents

  // Instantiates a session client
  const sessionClient = new dialogflow.SessionsClient();
  executeQueries(projectId, sessionId, sessionClient, queries, languageCode,
     message);
  // [END dialogflow_detect_intent_text]
}


function remove(username, text) {
  return text.replace('@' + username + ' ', '')
    .replace(process.env.DISCORD_PREFIX + ' ', '');
}

discordClient.login(process.env.DISCORD_TOKEN);
