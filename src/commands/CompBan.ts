import { Client, EmbedBuilder, Message, TextChannel, User } from "discord.js";
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import { redisClient } from "../bot";
import { OWNERS, serverarray } from "../config";
import { leparser } from "../func/index";

export const CompBan = async (msg: Message, args: string[], client: Client) => {
  
  const service = new HumanizeDuration(new HumanizeDurationLanguage())

  const kpclog = client.channels.cache.get('801552076726730752') as TextChannel 
  const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
  const ckalog = client.channels.cache.get('832517548355747840') as TextChannel
  const esport = client.channels.cache.get('1097169881222365257') as TextChannel
  const admins = client.channels.cache.get('1060536650918281296') as TextChannel


  if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
    return
  }



  const player = await client.users.fetch(args[0])
  if (!player || !args[0] || !args[1]) return msg.channel.send('Example usage: ?compban **123456789** 90d Account sharing or ?compban **123456789** test (perm)')

  const time = leparser(args[1])
  if (!time && args[1]) {

    const reason = args.slice(1).join(" ")
    const dmembed = new EmbedBuilder()
    .setDescription(`Hello ${player.username}, you have been **permanently** esport banned.\n\nReason: ${reason}`)
    .setColor("#ffdc3a")
    .setTimestamp()

    player.send({embeds: [dmembed]}).catch(err => {
      console.log(`Couldn't dm ${player.tag}`)
    })

    setTimeout(async () => {

      serverarray.forEach(async (server) => {
        await client.guilds.fetch(server).then(async (guild) => {
          await guild.bans.create(player, { reason: reason }).catch(err => {
            console.log(`Couldnt ban ${player.tag} in ${guild.name}\nERROR:\n\n\n${err}`)
  
          })
        })
      })
      
    }, 1000 * 2);


    const banembed = new EmbedBuilder()
    .setTitle('New Esport Ban!')
    .addFields(
      { name: `Responsible Admin:`, value: `${msg.author.tag} (${msg.author.id})`, inline: true},
      { name: `Reason:`, value: `${reason}`, inline: true },
      { name: `Time:`, value: `Permanent`, inline: true },
      
    )
    .setThumbnail((await client.guilds.fetch('623849289403334656')).iconURL())
    .setAuthor({ name: `${player.tag} (${player.id})`, iconURL: player.displayAvatarURL() })
    .setColor('Red')
    .setTimestamp()

    kpclog.send({ embeds: [banembed] });
    ncklog.send({ embeds: [banembed] });
    ckalog.send({ embeds: [banembed] });
    esport.send({ embeds: [banembed] });
    admins.send({ embeds: [banembed] })




    const currentchanneldoneemebed = new EmbedBuilder()
      .setTitle('Successfully done!')
      .setDescription(`**${player.tag}** has been **permanently** esport banned.\n\nReason: **${reason}**`)
      .setColor("#ffdc3a")
      .setTimestamp();

    msg.channel.send({ embeds: [currentchanneldoneemebed] })
    return
  }
  const prettytime = service.humanize(time!, { largest: 2 } )
  
  const reason = args.slice(2).join(" ")
  if (!reason) return msg.channel.send('Example usage: ?compban 123456789 90d **Account sharing**')




  if (!player || !time || !reason) return msg.channel.send('Example usage: ?compban 123456789 90d Account sharing')

  const seconds = time / 1000

  const rediskey = `banned-${player.id}`

  if (seconds > 0) {

    redisClient.set(rediskey, reason, { EX: seconds }).catch(ok => {
      console.log('Err line 68 ', ok)
    })


  }
 
  const dmembed = new EmbedBuilder()
    .setDescription(`Hello ${player.username}, you have been esport banned for **${prettytime}**.\n\nReason: ${reason}`)
    .setColor("#ffdc3a")
    .setTimestamp()

  player.send({ embeds: [dmembed] }).catch(err => {
    console.log(`Couldn't dm ${player.tag}`)
  })
    
  serverarray.forEach(server => {
    client.guilds.fetch(server).then(async guild => {
      guild.bans.create(player, { reason: reason }).catch(async (err) => {
        console.log(`Couldnt ban ${player.tag} in ${guild.name}`)
  
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
    .setAuthor({ name: `${player.tag} (${player.id})`, iconURL: player.displayAvatarURL() })
    .setColor('Red')
    .setTimestamp()

  kpclog.send({ embeds: [banembed] });
  ncklog.send({ embeds: [banembed] });
  ckalog.send({ embeds: [banembed] });
  esport.send({ embeds: [banembed] });
  admins.send({ embeds: [banembed] })

  const currentchanneldoneemebed = new EmbedBuilder()
    .setTitle('Successfully done!')
    .setDescription(`**${player.tag}** has been esport banned for **${prettytime}**.\n\nReason: **${reason}**`)
    .setColor("#ffdc3a")
    .setTimestamp();

  msg.channel.send({ embeds: [currentchanneldoneemebed] })

}