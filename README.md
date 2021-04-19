🎙 myDiscordBot
========================

An exploration into Discord Bot creation by Axel.
Originally forked off of [Max Isom's code](https://github.com/codetheweb/dialogflow-to-discord)

## Usage
You'll need to set 3 environment variables:
- `PROJECT_ID` should be set to your project ID in Google Cloud
- `DISCORD_TOKEN` should be set to your bot's token
- `DISCORD_PREFIX` should be set to the prefix you want your bot to activate with (bot will also work with DMs and @ mentions)

Then, just run `node index.js` when you want to start the bot.

Since this is intended for Heroku, 'npm start' is intended for just starting the bot's worker, while `npm run webserver` is for running a simple HTML page intended for use with Kaffine.

This bot has a dynamic command library as mentioned [here](https://discordjs.guide/command-handling/dynamic-commands.html)
