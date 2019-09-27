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

  if (message.channel.type == "dm") return;

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

// LINK CODE

  if ((message.author.bot) || message.content.startsWith(prefix)) return;

  var channelID = message.channel.id;
  var channel = client.channels.get(channelID); 
  var authorID = client.users.get(`${message.author.id}`);
  let avatarURL = 'http://teenanon.free.fr/teenrock/discordbot/pictures_res/default_avatar.png';

  if (authorID.avatarURL !== null) avatarURL = authorID.avatarURL.split('size=2048').join('size=64');

  let msg = message.content;

  if (message.attachments) message.attachments.forEach(att => {
    if (!message.content) msg = `${att.url}`;
    else if (message.content) msg = `${message.content}\n ${att.url}`;
  })

  linkedChanIDsList.forEach(id => { // global link

    if (id != channelID) return

    else fs.readdirSync("./networks/").forEach(network => {

      fs.readdirSync("./networks/" + network + "/").forEach(guildDir => {

        if (guildDir != ".keep") fs.readdirSync("./networks/" + network + "/" + guildDir).forEach(file => {

          var fileName = file.split(".js").join("")

          if (fileName != channelID) {

            var wb = require("./networks/" + network + "/" + guildDir + "/" + file)
            var wbFile = "./networks/" + network + "/" + guildDir + "/" + file;
            wb.edit(`${message.author.username}`, `${avatarURL}`).catch(err => {
              if (err) console.log(err)
            }).then(wb => {
              if (wb != undefined) wb.send(msg)
              else fs.removeSync(wbFile)
            })
          }      
        })
      })
    })
  })

  if (message.content == "test") {
  	id = message.channel.id;
  }

// END OF LINK CODE  

});

client.login(config.token);