
const Discord = require('discord.js');
const client = new Discord.Client();
const kategori = "ID-CATEGORY";
const voiceutama = "ID-VOICE";

client.on('ready', () => {
  console.log("bot has online");
});

client.on('message', message => {
	console.log(message.content);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  const oldID = oldState.channel ? oldState.channel.id : undefined;
  const newID = newState.channel ? newState.channel.id : undefined;

  if (newID === voiceutama) {

    client.userVoice = new Discord.Collection()
    const voiceData = client.userVoice.get(newState.member.user.id);
  
    if (client.userVoice.has(newState.member.user.id)) {
      const voiceChannel = newState.guild.channels.cache.get(voiceData.voiceID);
  
      return newState.setChannel(voiceChannel);
    } else
      return newState.guild.channels.create(`${newState.member.user.username} Channel`, {
        type: "voice",
        parent: kategori,
        userLimit: 5,
        permissionOverwrites: [
          {
            id: newState.member.user.id,
            allow: ['CONNECT', 'SPEAK'],
          },
          {
            id: 618446248256471051,
            allow: ['CONNECT', 'SPEAK', 'MANAGE_CHANNELS', ],
          },
        ]
      }).then(ch => {
        return newState.setChannel(ch).then(() => {
          return client.userVoice.set(
            newState.member.user.id, {
              ownerID: newState.member.user.id,
              voiceID: ch.id
            });
          });
        });
  }

  if (oldID) {
    if (client.userVoice.find(x => x.voiceID.includes(oldID) !== undefined)) {
      const voiceData = client.userVoice.find(x => x.voiceID.includes(oldID));
  
      const voiceChannel = oldState.guild.channels.cache.get(voiceData.voiceID);
  
      if (!voiceChannel.members.size) voiceChannel.delete();
  
      return client.userVoice.delete(voiceData.ownerID);
    }
  }
});

client.login("BOT-TOKEN");