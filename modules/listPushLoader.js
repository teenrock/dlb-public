
function loadPusherList(netChoice) {

  if (netChoice == null) return

  else {

    if (netChoice == "A00") pushTo_A00
    if (netChoice == "B00") pushTo_B00
    if (netChoice == "C00") pushTo_C00

    console.log(" Un salon vient d'être ajouté au réseau : " + netChoice)
  }

}

module.exports = loadPusherList;