'use strict'

const { http, https } = require('follow-redirects');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const coffe = (req, res) => {
    console.log("Caffine Recieved")
}



module.exports = {
  coffe: coffe,
};