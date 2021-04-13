'use strict'

const { http, https } = require('follow-redirects');
var path = require('path')

const coffe = (req, res) => {
    console.log("Caffine Recieved")
    res.sendFile(path.join(__dirname + '/index.html'));
}



module.exports = {
  coffe: coffe,
};