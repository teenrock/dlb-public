
function loadPusherList(netChoice, id) {

  if (netChoice == null) return

  else {

    if (netChoice == "A00") pushTo_A00(id);
    if (netChoice == "B00") pushTo_B00(id);
    if (netChoice == "C00") pushTo_C00(id);

    console.log(" Un salon vient d'être ajouté au réseau : " + netChoice)
  }

}

module.exports = loadPusherList;