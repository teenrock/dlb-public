
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
  unlinkedChanIDsList = [];
  linkedChanIDsList = [];

  maxSlot = 5;


  var netListsLoaderPath = "./modules/netListsLoader.js";

  var writeListLoader = function() {

    listLoaderTxt = ``;

    fs.readdirSync(networksDir).forEach(network => {
      listLoaderTxt = listLoaderTxt + "\n" + network + ` = [];\nnetworksList.push(${network});\npushTo_${network} = function(id) {${network}.push(id) };`;
    })

    var fileText = `function loadLists() {\n\n  ${listLoaderTxt}\n\n}\n\nmodule.exports = loadLists;`;

    fs.writeFileSync(netListsLoaderPath, fileText)

    const loadLists = require("." + netListsLoaderPath)
    loadLists()

  };


  var listPushLoaderPath = "./modules/listPushLoader.js";

  var writeListPushLoader = function() {

    listPusherTxt = ``;
    netChoice = null;

    fs.readdirSync(networksDir).forEach(network => {
      listPusherTxt = listPusherTxt + "\n" + `    if (netChoice == "${network}") pushTo_${network}`;
    })

    var fileText = `\nfunction loadPusherList(netChoice) {\n\n  if (netChoice == null) return\n\n  else {\n${listPusherTxt}\n\n    console.log(" Un salon vient d'être ajouté au réseau : " + netChoice)\n  }\n\n}\n\nmodule.exports = loadPusherList;`;

    fs.writeFileSync(listPushLoaderPath, fileText)

    const loadPusherList = require("." + listPushLoaderPath)
    loadPusherList(netChoice)

  };



  if (!fs.existsSync(netListsLoaderPath)) fs.createFile(netListsLoaderPath).then(writeFileSync => writeListLoader());

  else writeListLoader();

  if (!fs.existsSync(listPushLoaderPath)) fs.createFile(listPushLoaderPath);

  else writeListPushLoader();



  fs.readdirSync(networksDir).forEach(network => { // A00, B00, C00

    var networkDir = networksDir + network + "/";

    console.log(" # NETWORK  : " + network);


    fs.readdirSync(networkDir).forEach(dir => { // Servers IDs Directories

      if (dir == ".keep") return

      var guildDir =  networkDir + dir + "/";

      console.log(" Serveur " + dir + " enregistré sur " + network)


      fs.readdirSync(guildDir).forEach(file => {

        if (!file) {

          fs.rmdir(guildDir) && console.log(" Le serveur " + dir + " est enregistré sur le réseau " + network + " mais ne contient aucun fichier de configuration, il a donc été supprimé\n")

        } else {

          var fileName = file.split(".js").join("")

          var guildfile = guildDir + file;

          var hook = require("." + guildfile)

          hook

          linkedHooksList.push(hook)
          linkedFilesList.push(file)
          linkedChanIDsList.push(fileName)

          console.log("       - " + file + " chargé")
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

      hook

      unlinkedHooksList.push(hook)
      unlinkedFilesList.push(file)
      unlinkedChanIDsList.push(fileName)

    })
  })



  console.log("\n Linked FileList : \n")
  linkedFilesList.forEach(file => console.log(" " + file));

  console.log("\n Unlinked FileList : \n")
  unlinkedFilesList.forEach(file => console.log(" " + file));



}

module.exports = onReady