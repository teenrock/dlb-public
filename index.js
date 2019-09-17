//////////////////////////////////////////////////////////////////////////////////////////
// DLB-DEV
/////////////////////////////////////////////////////////////////////////////////////////

const Discord = require("./node_modules/discord.js");
const client = new Discord.Client({autoReconnect: true, max_message_cache: 0/*, disableEveryone: true*/});
const config = require("./config.json");
const fs = require("fs-extra");
const decache = require("decache");
const path = require("path");
var prefix = config.prefix;

/////////////////////////////////////////////////////////////////////////////////////////
// LINK CODE
/////////////////////////////////////////////////////////////////////////////////////////

client.on("err", err => {
  console.log(err)
});

client.on("ready", (message, channel) => {
  const onReady = require("./events/onReady.js")
  onReady(Discord, client, message, channel, path, fs, decache)
});

client.on("guildCreate", (guild, message, channel) => {
  const guildCreate = require("./events/guildCreate.js")
  guildCreate(Discord, client, guild, fs, decache)
});

client.on("guildDelete", guild => {
  const guildDelete = require("./events/guildDelete.js")
  guildDelete(Discord, client, guild, fs, decache)
});

client.on("message", (message) => {

  if ((message.channel.type == "dm") || (!message.content.startsWith(prefix))) return console.log("...")

  // COMMANDE DE LINK
  if (message.content == "!link") {
    const linkCmd = require("./modules/linkCmd.js")
    linkCmd(Discord, client, message, fs, decache, path)

  // COMMANDE DE DELINK
  } else if (message.content == "!unlink") {
    const unlinkCmd = require("./modules/unlinkCmd.js")
    unlinkCmd(Discord, client, message, fs, decache, path)

  } else if (message.content == "!purge webhooks") {
    console.log(message.channel.guild)
    
  }

  var channelID = message.channel.id;
  var channel = client.channel.get(channelID);

  

});

client.login(config.token);
