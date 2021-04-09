🎙 myDiscordBot
========================

Easily add Discord bot integration to your Dialogflow project.

## Usage
You'll need to set 5 environment variables:
- `PROJECT_ID` should be set to your project ID in Google Cloud
- `DISCORD_TOKEN` should be set to your bot's token
- `DISCORD_PREFIX` should be set to the prefix you want your bot to activate with (bot will also work with DMs and @ mentions)

Then, just run `node index.js` when you want to start the bot.

## Docker

Set environment variables and mount a directory containing the Google Cloud `keys.json` file to `/usr/data/` as a volume.
