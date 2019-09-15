
function startLog(client) {

  // Servers Count/Names/IDs
  fullMembersList = []
  membersList = []
  var serverCount = client.guilds.size;
  const guildNames = client.guilds.map(g => g.name).join(`\n `);
  const guildIDs = client.guilds.map(g => g.id).join(`\n `);

    client.guilds.forEach(guild => {
      guild.members.forEach(member => {
        var userID = member.id;
        fullMembersList.push(userID)
      })
    })

    function removeDuplicates(arr) {
      let unique_array = []
      for (let i = 0; i < arr.length; i++) {
        if (unique_array.indexOf(arr[i]) == -1) {
          unique_array.push(arr[i])
        }
      }
      return unique_array
    }

    var membersList = removeDuplicates(fullMembersList);
    var membersListStr2 = membersList.toString()
    var memberCount = Object.keys(membersList).length;
    fullMembersList = []
    membersList = []

  console.log(`\n ${client.user.username}@Bot [Started] ${new Date()}
 --------------------------------------\n Utilisateurs: ${memberCount}\n Serveurs: ${serverCount}\n\n ${guildNames}\n\n ${guildIDs}\n --------------------------------------\n`);

}

module.exports = startLog