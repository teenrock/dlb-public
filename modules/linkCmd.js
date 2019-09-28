function linkCmd(Discord, client, message, fs, decache, path) {

  	var chanID = message.channel.id;
    var guildID = message.guild.id;
    var linkedGuildPath = linkedDir + guildID + "/";
    var linkedGuildFilePath = linkedDir + guildID + "/" + chanID + ".js";
    var unlinkedGuildPath = unlinkedDir + guildID + "/";
    var unlinkedGuilFilePath = unlinkedDir + guildID + "/" + chanID + ".js";

    if (fs.existsSync(linkedGuildFilePath)) return message.reply("ce salon est déjà relié a un réseau.\nUn même salon ne peut être relié à deux réseaux simultanément.\nSi vous souhaitez changer de réseau utilisez d'abord la commande **\`!unlink\`** ")

    if (!fs.existsSync(unlinkedGuildPath)) fs.mkdir(unlinkedGuildPath)
    if (!fs.existsSync(linkedGuildPath)) fs.mkdir(linkedGuildPath)

      fs.readdir(linkedGuildPath, (err, files) => {
      
      if (!files) return console.log("err 001")

      var fileCount = files.length;
      if (fileCount >= 2) {
        return message.reply("Le maximum de **" + fileCount + "** fichiers de configuration autorisés par serveur a été atteint.")
      } else if (fileCount <= 1) {

        message.reply("veuillez choisir un réseau :").then(msg => {


      msg.react("\u0031\u20E3").then(react0 => msg.react("\u0032\u20E3").then(react1 => msg.react("\u0033\u20E3")))


      client.on("messageReactionAdd", (reaction, user, channel) => {

        if (user.id != client.user.id) { // is not bot user

          if (user.id != message.author.id) { // user react is not the same of user message
            message.channel.send(`**${user}** pas touche !`).then(msg => reaction.remove() && msg.delete(7500));

          } else if ((user.id == message.author.id) && (reaction.message.id == msg.id)) {

            if (reaction.emoji == "\u0031\u20E3") netChoice = "A00";
            else if (reaction.emoji == "\u0032\u20E3") netChoice = "B00";
            else if (reaction.emoji == "\u0033\u20E3") netChoice = "C00";

            if ((msg != undefined)||(msg != null)) msg.delete();

            console.log("\nnetwork choice : " + netChoice)
            console.log("maxSlot :" + maxSlot)

            var newGuildFilePath = networksDir + netChoice + "/" + guildID + "/" + chanID + ".js";

            fs.readdir(networksDir + netChoice, (err, files) => {
              
              var fileCount = files.length;
              console.log(fileCount);

              var registerGuildPath = function() {
                
                if (!fs.existsSync(unlinkedGuildPath)) { // il n'y a pas de dossier de configuration pourtant pour nom l'identifiant de ce serveur dans ./unlinked_servers/

                  if (fs.existsSync(linkedGuildPath)) { // un dossier de configuration pour ce serveur existe déjà dans le ./linked_servers/

                  }

                } else { // si il y a un dossier de configuration pour ce serveur dans ./unlinked_servers/

                  if (!fs.existsSync(linkedGuildFilePath)) fs.createFileSync(linkedGuildFilePath)  // on vérifie qu'aucun fichier ne porte déjà ce nom et on créé un fichier dans le dossier ./linked_servers/

                  if (!fs.existsSync(newGuildFilePath)) { // on vérifie qu'aucun fichier ne porte déjà ce nom dans le dossier réseau choisi

                    fs.createFileSync(newGuildFilePath) // on créé un dossier et le fichier de configuration pour notre salon à link

                    if (!fs.existsSync(unlinkedGuilFilePath)) fs.createFileSync(unlinkedGuilFilePath) // on créé un fichier

                    fs.rename(unlinkedGuilFilePath, newGuildFilePath, function (err) {
                      if (err) throw err
                      else {
                        console.log("Le serveur " + guildID + " a été ajouté au réseau " + netChoice)

                        fs.readdir(unlinkedDir + guildID, (err, files) => { // 
                          var fileCount = files.length;
                          if (fileCount == 0) fs.rmdir(unlinkedDir + guildID) && console.log(" Le dossier " + unlinkedDir + guildID + " est vide, il a été supprimé")
                          else console.log(" Le dossier " + unlinkedDir + guildID + " n'est pas vide, il n'a donc pas pu être supprimé")
                        })
                      }
                    })
                    

                  }
                }
              };

              var addGuildToNetworkChoice = function(Discord, client) {

                if (fs.existsSync(newGuildFilePath)) {

                  linkedChanIDsList.push(chanID)

                  var listPushLoaderPath = "./modules/listPushLoader.js";
                  var id = chanID;

                  const loadPusherList = require("." + listPushLoaderPath)
                  loadPusherList(netChoice, id)
                }
                    
              };

              var createFileServ = function() {

                message.channel.createWebhook(client.user.tag, default_avatar).then(wb=> {

                  var hookID = wb.id;
                  var hookToken = wb.token;
                  var fileText = `var Discord = require("discord.js")\n
hook_${chanID} = new Discord.WebhookClient("${hookID}", "${hookToken}");\n
module.exports = hook_${chanID}`;

                  if (fs.existsSync(newGuildFilePath)) {

                    fs.writeFileSync(newGuildFilePath, fileText)

                    addGuildToNetworkChoice()

                    message.channel.send(`Votre salon **#` + message.channel.name + "** vient d'être inscrit sur le réseau **" + netChoice + "**")

                  }

                  console.log("ID du salon : " + wb.channelID)

                  

                })

              };

              

              if (fileCount == maxSlot) {
                return message.channel.send("Le réseau **" + netChoice + "** est saturé, veuillez re-taper la commande **\`!link\`** et choisir un autre réseau.").then(msg => msg.delete(7000))

              } else if (fileCount == 0) {
                message.channel.send("Vous êtes le premier serveur sur le réseau **" + netChoice + "**").then(msg => {
                  registerGuildPath()
                  createFileServ()
                  
                })

              } else if ((fileCount <= maxSlot-1) && (fileCount >= 1)) {
                message.channel.send("**"+ fileCount + " serveur(s)** se trouve(nt) actuellement sur le réseau **" + netChoice + "**").then(msg => {
                  registerGuildPath()
                  createFileServ()

                })
              }

            })

          }
        }
      })

    })

      }
    })

  	
}

module.exports = linkCmd
