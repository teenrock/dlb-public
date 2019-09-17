
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
  linkedHooksList = [];
  linkedFilesList = [];
  unlinkedHooksList = [];
  unlinkedFilesList = [];
  unlinkedChanIdsList = [];
  linkedChanIDsList = [];

  maxSlot = 5;

  netText = ``;

  fs.readdirSync(networksDir).forEach(network => {
    netText = netText + "\n  " + network + "netList = [];";
  })

  var netListsLoader = "./modules/netListsLoader.js";

  var writeListLoader = function() {

    var fileText = `function loadLists() {\n  ${netText}\n\n}\n\nmodule.exports = loadLists;`;

    fs.writeFileSync(netListsLoader, fileText)

    const loadLists = require("." + netListsLoader)
    loadLists()

  }

  if (!fs.existsSync(netListsLoader)) fs.createFile(netListsLoader).then(writeFileSync => writeListLoader());
  else writeListLoader();

  fs.readdirSync(networksDir).forEach(network => { // A00, B00, C00
    var networkDir = networksDir + network + "/";

    networksList.push(network) && console.log(" # NETWORK  : " + network);

    fs.readdirSync(networkDir).forEach(dir => { // Servers IDs Directories

      if (dir == ".keep") return

      var guildDir =  networkDir + dir + "/";
      console.log(" Serveur " + dir + " enregistré sur " + network)

      fs.readdirSync(guildDir).forEach(file => {

        if (!file) {
          console.log(" --- Le serveur " + dir + " est enregistré sur le réseau " + network + " mais ne contient aucun fichier de configuration")

        } else {

          var fileName = file.split(".js").join("")

          var guildfile = guildDir + file;

          var hook = require("." + guildfile)

          hook

          linkedHooksList.push(hook)
          linkedFilesList.push(file)

          console.log(" Fichier " + file + " chargé")
          console.log(" --- " + fileName)
        }
      })
      
    })
    console.log()
  })

  fs.readdirSync(unlinkedDir).forEach(dir => {

    if (dir == ".keep") return

    var unlinkedGuildDir = unlinkedDir + dir + "/";

    fs.readdirSync(unlinkedGuildDir).forEach(file => {

      var fileName = file.split(".js").join("")

      var hook = require("." + unlinkedGuildDir + file)
      hook(Discord, client)

      unlinkedHooksList.push(hook)
      unlinkedFilesList.push(file)
      unlinkedChanIdsList.push(fileName)

    })
  })

  console.log("\n Linked FileList : \n")
  linkedFilesList.forEach(file => console.log(" " + file));

  console.log("\n Unlinked FileList : \n")
  unlinkedFilesList.forEach(file => console.log(" " + file));

}

module.exports = onReady