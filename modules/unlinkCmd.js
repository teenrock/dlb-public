function unlinkCmd(Discord, client, message, fs, decache, path) {

  var chanID = message.channel.id;
  var guildID = message.guild.id;
  var unlinkedGuilFilePath = unlinkedDir + guildID + "/" + chanID + ".js";
  var linkedGuildFilePath = linkedDir + guildID + "/" + chanID + ".js";
  
  // on vérifie que que le salon soit présent sur un réseau, le cas échant on s'arrête ici
  if(!fs.existsSync(linkedGuildFilePath)) return message.reply("ce salon n'est actuellement relié à aucun réseau. Utilisez la commande **\`!link\`** si vous souhaitez de nouveau rejoindre un réseau.")
  // on demande confirmation pour retirer le salon du réseau
  message.reply("veuillez confirmer que vous souhaitez retirer ce salon du réseau").then(msg => {
    // on envoie le choix de confirmation sous forme de réaction
    msg.react("🇾").then(react0 => msg.react("🇳"))
    // on attend une réaction
    client.on("messageReactionAdd", (reaction, user, channel) => {
      // on vérifie que l'utilisateur qui réagit n'est pas un bot
      if (user.id != client.user.id) {
        // on vérifie que l'utilisateur qui réagit est celui qui a émit la commande de link
        if (user.id != message.author.id) {
            message.channel.send(`**${user}** pas touche !`).then(msg => reaction.remove() && msg.delete(7500)); // si ce n'est pas le cas on retire la réaction

          } else if ((user.id == message.author.id) && (reaction.message.id == msg.id)) { // on vérifie que l'id utilisateur et l'id du message correspondent respectivement

            // on réagit en approuvant ou pas
            if (reaction.emoji == "🇳") return
            else if (reaction.emoji == "🇾") {

              if ((msg != undefined)||(msg != null)) msg.delete();

              var fileText = `function hook(Discord, client) {
\/\/hook_${chanID} = undefined;
}
module.exports = hook`;

            // DELINK CODE
            if (fs.existsSync(linkedGuildFilePath)) fs.removeSync(linkedGuildFilePath) // on supprime le fichier dans le dossier ./linked_servers/

            fs.readdirSync(networksDir).forEach(network => { // on lit chaque dossier dans le dossier ./networks/ puis pour chaque réseau
              var linkedGuildFile = networksDir + network + "/" + guildID + "/" + chanID + ".js";
              var linkedGuildDir = networksDir + network + "/" + guildID + "/";

              if (fs.existsSync(linkedGuildFile)) { // on vérifie que le fichier de configuration du salon en link est bien existant

                console.log("Le serveur " + guildID + " a retiré le salon " + chanID + " du réseau " + network)

                fs.createFile(unlinkedGuilFilePath).then(writeFileSync => { // on recréé un fichier de configuration vierge dans le dossier ./unlinked_servers/
                  fs.writeFileSync(unlinkedGuilFilePath, fileText) && console.log(" Le fichier " + unlinkedGuilFilePath + " vient d'être généré");
                })

                fs.removeSync(linkedGuildFile) && console.log("Le fichier de configuration du salon " + linkedGuildFile + " vient d'être supprimé") // si le fichier existe on le supprime

                fs.readdir(linkedGuildDir, (err, files) => { // 
                  var fileCount = files.length;
                  if (fileCount == 0) fs.rmdir(linkedGuildDir) && console.log(" Le dossier " + linkedGuildDir + " est vide, il a été supprimé")
                })
                
                fs.readdir(linkedDir + guildID, (err, files) => { // ensuite on vérifie si le dossier ./linked_servers/ contient encore des fichiers de configurations d'autres salons
                  var fileCount = files.length;
                  if (fileCount == 0) fs.rmdir(linkedDir + guildID) && console.log(" Le dossier " + linkedDir + guildID + "/ est vide, il a été supprimé")
                })

              }
            })
              
            }
            
          }
        }
      })

  })
}

module.exports = unlinkCmd
