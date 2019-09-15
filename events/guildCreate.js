function guildCreate(Discord, client, guild, fs, decache) {

  var unlinked_dir = `./unlinked_servers/`;
  var guildName = guild.name;
  var guildID = guild.id;
  var guildDir = unlinked_dir + guildID + "/";

  console.log(` Le serveur ${guildName} (${guildID}) vient de faire entrer ${client.user.tag}`);

  guild.createChannel("discord-link-bot", { type: "text"}).then(chan => {

    var guildFile = guildDir + chan.id + ".js";
    var fileText = `function hook(Discord, client) {
\/\/hook_${chan.id} = undefined;
}
module.exports = hook`;

    chan.send(`**Discord Link Bot**`);

    if (!fs.existsSync(guildDir)) {

      fs.mkdir(guildDir)

      fs.createFile(guildFile).then(writeFileSync => {

        fs.writeFileSync(guildFile, fileText)
        console.log(" Le Fichier " + guildFile + " vient d'être généré")

      });
      
    };

  })
  
}

module.exports = guildCreate