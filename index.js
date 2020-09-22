
const Discord = require('discord.js');
const client = new Discord.Client();
const kategori = "ID-CATEGORY";
const voiceutama = "ID-VOICE";

// Ini cukup sekali aja di awal. Gausah tiap user join.
client.userVoice = new Discord.Collection();

client.on('ready', () => {
  console.log("bot has online");
});

// Message event gaperlu.

client.on('voiceStateUpdate', (oldState, newState) => {
  const oldID = oldState.channel ? oldState.channel.id : undefined;
  const newID = newState.channel ? newState.channel.id : undefined;

  if (newID === voiceutama) {
    const voiceData = client.userVoice.get(newState.id);

    if (voiceData) {
      const voiceChannel = newState.guild.channels.cache.get(voiceData.voiceID);
  
      return newState.setChannel(voiceChannel);
    } else
      /* 
        Di sini cek dulu member punya role investor/senior atau ga.
	      Kalo punya, pake permissions yang ini:
          {
            id: newState.guild.id,
            allow: ['CONNECT', 'SPEAK'],
          },
          {
            id: newState.member.user.id,
            allow: ['CONNECT', 'SPEAK', 'MANAGE_CHANNELS', ],
          }
	  
	      Kalo gapunya, pake ini
	        {
            id: newState.guild.id,
            allow: ['CONNECT', 'SPEAK'],
          },
	  
	      Jangan semuanya dibikin permissions yang sama.
      */
      return newState.guild.channels.create(`${newState.member.user.username} Channel`, {
        type: "voice",
        parent: kategori,
        userLimit: 5,
        permissionOverwrites: [
          {
            id: newState.guild.id,
            allow: ['CONNECT', 'SPEAK'],
          },
          {
            id: newState.member.user.id,
            allow: ['CONNECT', 'SPEAK', 'MANAGE_CHANNELS', ],
          }
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
    const voiceData = client.userVoice.find(x => x.voiceID === oldID);

    if (voiceData) {  
      const voiceChannel = oldState.guild.channels.cache.get(voiceData.voiceID);
  
      if (voiceChannel.members.filter(x => !x.user.bot).size < 1) voiceChannel.delete();
  
      return client.userVoice.delete(voiceData.ownerID);
    }
  }
});

client.login("BOT-TOKEN");
