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
  // on ne prend pas en compte les DMs
  if (message.channel.type == "dm") return;

    // COMMANDE DE LINK
  if (message.content == "!link") {
    const linkCmd = require("./modules/linkCmd.js")
    linkCmd(Discord, client, message, fs, decache, path)

  // COMMANDE DE DELINK
  } else if (message.content == "!unlink") {
    const unlinkCmd = require("./modules/unlinkCmd.js")
    unlinkCmd(Discord, client, message, fs, decache, path)

  } else if (message.content == "!log A") {
	console.log(A00)
  } else if (message.content == "!log B") {
	console.log(B00)
  } else if (message.content == "!log C") {
	console.log(C00)
  } else if (message.content == "!log all") {
	networksList.forEach(net => {
		net.map(id => {
			console.log(id)
		})
	})
	
  } else if (message.content == "!purge webhooks") console.log(message.guild)

  else if (message.content == "!purge all") client.channels.forEach(chan => chan.delete())

  else if (message.content == "!networksList") {console.log(" Networks List :"), console.log(networksList)}

  else if (message.content == "!linkedHooksList") {console.log(" Linked Hooks List :"), console.log(linkedHooksList)}

  else if (message.content == "!linkedFilesList") {console.log(" Linked Files List :"), console.log(linkedFilesList)}

  else if (message.content == "!unlinkedHooksList") {console.log(" Unlinked Hooks List :"), console.log(unlinkedHooksList)}

  else if (message.content == "!unlinkedFilesList") {console.log(" Unlinkd Files List :"), console.log(unlinkedFilesList)}

  else if (message.content == "!unlinkedChanIDsList") {console.log(" Unlinked ChanIDs List :"), console.log(unlinkedChanIDsList)}

  else if (message.content == "!linkedChanIDsList") {console.log(" Linked ChanIDs List :"), console.log(linkedChanIDsList)}

  else if (message.content == "!oldList") {console.log(" Old Networks List :"), console.log(oldNetworksList)}

  else if (message.content == "!newNetList") {console.log(" New Network List :"), console.log(newNetworkList)}

  if ((message.author.bot) || message.content.startsWith(prefix)) return;

  var chanID = message.channel.id;
  var channel = client.channels.get(chanID); 
  var authorID = client.users.get(`${message.author.id}`);
  let avatarURL = 'http://teenanon.free.fr/teenrock/discordbot/pictures_res/default_avatar.png';

  if (authorID.avatarURL !== null) avatarURL = authorID.avatarURL.split('size=2048').join('size=64');

  let msg = message.content;

  if (message.attachments) message.attachments.forEach(att => {
    if (!message.content) msg = `${att.url}`;
    else if (message.content) msg = `${message.content}\n ${att.url}`;
  })


  // GLOBAL LINK

  // pour chaque liste de la liste des réseaux
  networksList.forEach(list => {
    // si l'ID du salon d'où provient le message n'appartient à aucune liste on arrête ici
  	if (!list.includes(chanID)) return
    // si l'ID du salon d'où provient le message appartient à une liste, alors ...
  	else {
  	  // on vérifie que chaque liste réseau contienne une liste
  	   if (Array.isArray(list)) list.forEach(element => {
      	// on exclu l'élément (chanID) d'où provient le message
        if (element != chanID) {
          // on lit chaque dossier contenu dans le dossier des réseaux puis...
          fs.readdirSync("./networks/").forEach(network => {
          	// on lit chaque dossier contenu dans le dossier du réseau concerné
            fs.readdirSync("./networks/" + network + "/").forEach(guildDir => {
              // on exclu le fichier ".keep" (utile pour github) puis on définit chaque fichier contenu dans le dossier de la Guild ()
           	  if (guildDir != ".keep") fs.readdirSync("./networks/" + network + "/" + guildDir).forEach(file => {
           	  	// on définit fileName comme étant le nom du fichier sans extension
          		var fileName = file.split(".js").join("")
          		// si le nom du fichier (chanID) est égal à un élément de cette liste
                if (fileName == element) {
                  // on définit l'emplacement du fichier du webhook
                  var wbFile = "./networks/" + network + "/" + guildDir + "/" + element + ".js";
                  // on require le fichier du webhook
          	      var wb = require(wbFile)
                  // on édite le fichier du webhook
                  wb.edit(`${message.author.username}`, `${avatarURL}`).catch(err => {
                    if (err) console.log(err)
                  // puis...
                  }).then(wb => {
                  	// si le webhook existe on l'envoie
                    if (wb != undefined) wb.send(msg)
                    // s'il n'existe pas on supprime le fichier
                    else fs.removeSync(wbFile) && console.log(" Le fichier " + wbFile + " a été supprimé car le webhook associé n'existe plus")
                  })

                }

              })

            })

          })
          // on retourne dans la console le nom d'utilisateur et le message
        } else console.log(" " + message.author.username + " : " + msg)
  	  })
    }
  })

// END OF LINK CODE  

});

client.login(config.token);