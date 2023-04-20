import { Client, EmbedBuilder, Guild, GuildMember, Message, TextChannel, User } from "discord.js";
import ms from "ms";
import humanizeDuration from "humanize-duration"
import { redisClient } from "../bot";
import { OWNERS, serverarray } from "../config";
export const CompBan = async (msg: Message, args: string[], client: Client) => {

  if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
    return
  }


  const kpclog = client.channels.cache.get('801552076726730752') as TextChannel 
  const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
  const ckalog = client.channels.cache.get('1098035657668046960') as TextChannel
  const esport = client.channels.cache.get('1097169881222365257') as TextChannel
  const admins = client.channels.cache.get('1060536650918281296') as TextChannel

  const player = await client.users.fetch(args[0])
  if (!player || !args[0]) return msg.channel.send('Example usage: ?ban **123456789** 90d Account sharing')


  let time:any = args[1]
  if (time == "perm" || time == "perma" || time == "permanent" || time == "forever" || time == "infinity" || time == "infinite" || time == "permanently") {
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
  const rediskey = `banned-${player.id}`


  if (seconds > 0) {

    redisClient.set(rediskey, `Reason: ${reason}\n\nDiscord Tag: ${player.tag}`, { EX: seconds }).catch(ok => {
      console.log('Err line 68 ', ok)
    })

    const dmembed = new EmbedBuilder()
    .setDescription(`Hello ${(await player).username}, you have been esport banned for **${prettytime}**.\n\nReason: ${reason}`)
    .setColor("Red")
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


  } else {

    redisClient.set(rediskey, `Reason: ${reason}\n\nDiscord Tag: ${player.tag}`).catch(ok => {
      console.log('Err line 75 ', ok)
    })

    const dmembed = new EmbedBuilder()
    .setDescription(`Hello ${(await player).username}, you have been **permanently** esport banned.\n\nReason: ${reason}`)
    .setColor("Red")
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
      { name: `Time:`, value: `Permanent`, inline: true },
      
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
  .setDescription(`**${(await player).tag}** has been **permanently** esport banned.\n\nReason: **${reason}**`)
  .setColor("Red")
  .setTimestamp();

msg.channel.send({ embeds: [currentchanneldoneemebed] })

  }
  







}