
function onReady (Discord, client, message, channel, path, fs, decache) {

  client.on("err", err => {
    console.log(err)
  });

  var startLog = require("./startLog.js");
  startLog(client)

  default_avatar = "http://teenanon.free.fr/teenrock/discordbot/pictures_res/default_avatar.png";

  networksDir = "./networks/";
  linkedDir = "./linked_servers/";
  unlinkedDir = "./unlinked_servers/";
  

  networksList = []; // Networks List ['A00', 'B00', 'C00'] 
  linkedServersList = [];
  linkedFilesList = [];
  unlinkedServersList = [];
  unlinkedFilesList = [];
  linkedChanIDsList = [];

  maxSlot = 5;

  // Create networksList & SlotList
  fs.readdirSync(networksDir).forEach(network => { // A00, B00, C00
    var networkDir = networksDir + network + "/";

    networksList.push(network) && console.log(" # NETWORK  : " + network);

    fs.readdirSync(networkDir).forEach(dir => { // Servers IDs Directories
      var guildDir =  networkDir + dir + "/";
      console.log(" Serveur " + dir + " enregistré sur " + network)

      fs.readdirSync(guildDir).forEach(file => {

        if (!file) {
          console.log(" --- Le serveur " + dir + " est enregistré sur le réseau " + network + " mais ne contient aucun fichier de configuration")

        } else {

          var guildfile = guildDir + file;

          var hook = require("." + guildfile)

          hook

          linkedServersList.push(hook)
          linkedFilesList.push(file)

          console.log(" Fichier " + file + " chargé")
        }
      })
      
    })
    console.log()
  })

  fs.readdirSync(unlinkedDir).forEach(dir => {
    var unlinkedGuildDir = unlinkedDir + dir + "/";

    fs.readdirSync(unlinkedGuildDir).forEach(file => {

      var hook = require("." + unlinkedGuildDir + file)
      hook(Discord, client)
      unlinkedServersList.push(hook)
      unlinkedFilesList.push(file)

    })
  })

  console.log("\n Linked FileList : \n")
  linkedFilesList.forEach(file => console.log(" " + file));

  console.log("\n Unlinked FileList : \n")
  unlinkedFilesList.forEach(file => console.log(" " + file));


}

module.exports = onReady