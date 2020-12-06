const dialogflow = require('dialogflow'); //can toggle comment
const util = require('util');

module.exports = {
    //dfTalkingPoints: dialogflowTalkingPoints,
    detectTextIntent: detectTextIntent,
    printFulfillmentMessages: printFulfillmentMessages
}


function printFulfillmentMessages(fulfillmentMessages, pingMsg, normMsg, m){
  //console.log("fm:"+util.inspect(fulfillmentMessages, {depth:null}));
  var ctr = 0;
  for(var i = 0; i < fulfillmentMessages.length; i++){
    var item = fulfillmentMessages[i];
    //console.log(item);
    if(item.hasOwnProperty('text')){
      var string = item.text.text[0];
      console.log("str:"+ string);
      if(ctr == 0){
        pingMsg(string, m);
        ctr++;
      }
      else normMsg(string, m);
    }
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

async function executeQueries(projectId, sessionId, sessionClient, 
                              queries, languageCode, message, oContext) {
    // Keeping the context across queries let's us simulate an ongoing 
    // conversation with the bot

    let context;
    let intentResponse;
    for (const query of queries) {
        try {
            console.log(`Sending Query: ${query}`);
            intentResponse = 
                await detectIntent(projectId, sessionId, sessionClient, 
                                query, oContext, languageCode);
            console.log('Detected intent');
            //printFulfillmentMessages(,
              //  message);
            //console.log(
            //  `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
            //);
            //message.channel.send(`${intentResponse.queryResult.fulfillmentText}`);
            var flag = intentResponse.queryResult.intent.displayName;
            console.log("queryResult: "+util.inspect(intentResponse.queryResult,
                {depth:null}));
            // Use the context from this response for next queries
            context = intentResponse.queryResult.outputContexts;
            switch(flag){
                case 'WhatAreTheRules':
                    //commandRules(message, 0);
                    return {'value':1, 'context':context, 'message':intentResponse.queryResult.fulfillmentMessages};
                case 'WhatElseCanIDo':
                    //dialogflowTalkingPoints(message);
                    return {'value':2, 'context':context, 'message':intentResponse.queryResult.fulfillmentMessages};
            }        
            console.log("output context: " + util.inspect(context, {depth:null}));
        } catch (error) {
            console.error(error);
            return {'value':-2, 'context':context, 'message':intentResponse.queryResult.fulfillmentMessages};
        }
    }
    return {'value':0, 'context':context, 'message':intentResponse.queryResult.fulfillmentMessages};
}

async function detectTextIntent(projectId, sessionId, queries, languageCode, message, context){
    // [START dialogflow_detect_intent_text]
    // projectId: ID of the GCP project where Dialogflow agent is deployed
    // sessionId: Random number or hashed user identifier
    // queries: A set of sequential queries to be send to Dialogflow agent for
    //    Intent Detection
    // languageCode: Indicates the language Dialogflow agent should use to 
    //    detect intents
  
    // Instantiates a session client
    const sessionClient = new dialogflow.SessionsClient();
    var out = 0;
    out = await executeQueries(projectId, sessionId, sessionClient, queries, languageCode,
       message, context);
    // [END dialogflow_detect_intent_text]
    return out;
}