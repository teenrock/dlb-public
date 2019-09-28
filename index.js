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


  // GLOBAL LINK

  networksList.forEach(list => {

  	if (!list.includes(channelID)) return

  	else {

      list.forEach(element => {

        if (element != channelID) {

          fs.readdirSync("./networks/").forEach(network => {

            fs.readdirSync("./networks/" + network + "/").forEach(guildDir => {

           	  if (guildDir != ".keep") fs.readdirSync("./networks/" + network + "/" + guildDir).forEach(file => {

          		var fileName = file.split(".js").join("")

                if (fileName == element) {

          	      var wb = require("./networks/" + network + "/" + guildDir + "/" + element + ".js")
                  var wbFile = "./networks/" + network + "/" + guildDir + "/" + element + ".js";

                  wb.edit(`${message.author.username}`, `${avatarURL}`).catch(err => {
                    if (err) console.log(err)

                  }).then(wb => {

                    if (wb != undefined) wb.send(msg)

                    else {
                      // remove file
                      fs.removeSync(wbFile)
                      // remove id from linkedChanIDsList
                      linkedChanIDsList.map(linkedID => {

              			if (channelID == linkedID) {

              			  var idToRemove = channelID;
                		  var filterdIDs = linkedChanIDsList.filter(item => !idToRemove.includes(item))
                		  console.log()

                		  newNetList = []

                		  filterdIDs.forEach(item => newNetList.push(item))

                		  linkedChanIDsList = []

                		  newNetList.forEach(id => linkedChanIDsList.push(id) && console.log(linkedChanIDsList))
                
              		    }

                      })
                      // ICI IL FAUT RETIRER L'ID DANS LA LISTE DU RESEAU OU IL SE TROUVAIT
                      networksList.forEach(list => {

  					    if (!list.includes(channelID)) return

  						else {

  						  var idToRemove = channelID;
                		  var filterdIDs = linkedChanIDsList.filter(item => !idToRemove.includes(item))
                		  console.log()

                		  newNetList = []

                		  filterdIDs.forEach(item => newNetList.push(item))

                		  list = []

                		  newNetList.forEach(id => list.push(id) && console.log(list))

  						}
  					})

                  	}

                  })

                }

              })

            })

          })
        }
  	  })
    }
  })

// END OF LINK CODE  
if (message.content == "log A") {
	console.log(A00)
} else if (message.content == "log B") {
	console.log(B00)
} else if (message.content == "log C") {
	console.log(C00)
} else if (message.content == "log all") {
	networksList.forEach(net => {
		net.map(id => {
			console.log(id)
		})
	})
}

});

client.login(config.token);