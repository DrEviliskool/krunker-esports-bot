import { Client, EmbedBuilder, Guild, GuildMember, Message, TextChannel, User } from "discord.js";
import ms from "ms";
import humanizeDuration from "humanize-duration"
import { redisClient } from "../bot";
export const CompBan = async (msg: Message, args: string[], client: Client) => {  

  const OWNERS = [
    "920717213965643847", //THE ULTIMATE NOONER
    "937071829410000987", //DrEvil
    "356052289728806912", //Duprious
    "815003739702034482", //Asokra
    "321384844695437314", //JaySii
    "369002352138518528", //brandon
    "180504818555682816", //dojin
    "257709390537162752", //nizzq
    "521051554556542976", //Choco
    "425726603427840000", //Perky
    "316015067499855872", //ps6
    "292474867272515606", //Sakurasou
    "259526415341322250", //tjwyk
    "154052900425826304", //Wingman
  ] // ONLY PEOPLE WITH ACCESS

  const serverarray = [
    '672146248182136863', //kpc
    '996161328546861126', //nack
    '832245400505155595', //cka
    '623849289403334656' //krunker esports server
  ]

  const kpclog = client.channels.cache.get('801552076726730752') as TextChannel 
  const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
  const ckalog = client.channels.cache.get('1098035657668046960') as TextChannel
  const esport = client.channels.cache.get('1097169881222365257') as TextChannel
  const admins = client.channels.cache.get('1060536650918281296') as TextChannel


  if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
    return
  }



  const player = await client.users.fetch(args[0])
  if (!player || !args[0]) return msg.channel.send('Example usage: ?ban **123456789** 90d Account sharing')


  let time:any = args[1]
  if (time == "perm" || time == "perma" || time == "permanent" || time == "forever" || time == "infinity" || time == "infinite") {
    time = -1
  } else {
    time = ms(args[1])
  }
  
  if (!time) return msg.channel.send('Example usage: ?ban 123456789 **90d** Account sharing')
  const prettytime = humanizeDuration(time, { largest: 2 })
  
  
  const reason = args.slice(2).join(" ")
  if (!reason) return msg.channel.send('Example usage: ?ban 123456789 90d **Account sharing**')

  if (!player || !time || !reason) return msg.channel.send('Example usage: ?ban 123456789 90d Account sharing')

  const seconds = time / 1000
  const rediskey = `banned-${player.id}}`

  if (seconds > 0) {

    redisClient.set(rediskey, reason + `Discord Tag: ${player.tag}`, { EX: seconds }).catch(ok => {
      console.log('Err line 68 ', ok)
    })


  } else {

    redisClient.set(rediskey, reason + `Discord Tag: ${player.tag}`).catch(ok => {
      console.log('Err line 75 ', ok)
    })
  }
  
  const dmembed = new EmbedBuilder()
    .setDescription(`Hello ${(await player).username}, you have been esport banned for **${prettytime}**.\n\nReason: ${reason}`)
    .setColor("Green")
    .setTimestamp()

  ;(await player).send({ embeds: [dmembed] }).then(ok => {
    
    serverarray.forEach(server => {
      client.guilds.fetch(server).then(async guild => {
        guild.bans.create((await player), { reason: reason }).catch(async (err) => {
          console.log(`Couldnt ban ${(await player).tag} in ${guild.name}`)
        })
  
      })
  
    })

  })

  const banembed = new EmbedBuilder()
    .setTitle('New Esport Ban!')
    .addFields(
      { name: `Responsible Admin:`, value: `${msg.author.tag} (${msg.author.id})`, inline: true},
      { name: `Reason:`, value: `${reason}`, inline: true },
      { name: `Time:`, value: `${prettytime}`, inline: true },
      
    )
    .setThumbnail((await client.guilds.fetch('623849289403334656')).iconURL())
    .setAuthor({ name: `${(await player).tag} (${(await player).id})`, iconURL: (await player).displayAvatarURL() })
    .setColor('Red')
    .setTimestamp()

  kpclog.send({ embeds: [banembed] });
  ncklog.send({ embeds: [banembed] });
  ckalog.send({ embeds: [banembed] });
  esport.send({ embeds: [banembed] });
  admins.send({ embeds: [banembed] })




  const currentchanneldoneemebed = new EmbedBuilder()
    .setTitle('Successfully done!')
    .setDescription(`**${(await player).tag}** has been esport banned for **${prettytime}**.\n\nReason: **${reason}**`)
    .setColor("Green")
    .setTimestamp();

  msg.channel.send({ embeds: [currentchanneldoneemebed] })

}