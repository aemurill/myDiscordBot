'use strict'

const { http, https } = require('follow-redirects');

const coffe = (req, res) => {
    console.log("Caffine Recieved")
}



module.exports = {
  coffe: coffe,
};