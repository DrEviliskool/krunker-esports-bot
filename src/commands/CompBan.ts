import { Client, EmbedBuilder, Message, TextChannel } from "discord.js";
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import { redisClient } from "../bot";
import { OWNERS, serverarray } from "../config";
import { leparser } from "../func/index";
import { addSeconds } from "date-fns";


export const CompBan = async (msg: Message, args: string[], client: Client) => {

  if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
    return
  }

  const logger = client.channels.cache.get('1103737409243451424') as TextChannel
  const kpclog = client.channels.cache.get('801552076726730752') as TextChannel
  const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
  const ckalog = client.channels.cache.get('1098035657668046960') as TextChannel
  const esport = client.channels.cache.get('1097169881222365257') as TextChannel
  const admins = client.channels.cache.get('1060536650918281296') as TextChannel
  
  const service = new HumanizeDuration(new HumanizeDurationLanguage())

  let theplayerid = args[0] as any
  if (!parseInt(theplayerid) || !theplayerid) return msg.channel.send('Example usage: ?compban **123456789** account sharing')

  const player = await client.users.fetch(theplayerid!)
  if (!player || !args[1]) return msg.channel.send('Example usage: ?compban 123456789 90d Account sharing or ?compban 123456789 test (perm)')

  const time = leparser(args[1])
  const seconds = time! / 1000




  if (!time && args[1]) {

    const reason = args.slice(1).join(" ")
    const dmembed = new EmbedBuilder()
      .setDescription(`Hello ${player.username}, you have been **permanently** esport banned.\n\nReason: **${reason}.**`)
      .setColor("#ffdc3a")
      .setTimestamp()
      .setFooter({
        text: `Anything wrong? DM any of the following: Asokra#8181 -  DrEvil | 精英#0581 - wingman#7163`
      })

    player.send({ embeds: [dmembed] }).catch(err => {
      logger.send(`Couldn't dm **${player.tag}**`)
    })

    setTimeout(async () => {

      serverarray.forEach(async (server) => {
        await client.guilds.fetch(server).then(async (guild) => {
          await guild.bans.create(player, { reason: reason }).catch(err => {
            logger.send(`Couldnt ban **${player.tag}** in **${guild.name}**`)

          })
        })
      })

    }, 1000 * 2);


    const banembed = new EmbedBuilder()
      .setTitle('New Esport Ban!')
      .addFields(
        { name: `Responsible Admin:`, value: `${msg.author.tag} (${msg.author.id})`, inline: true },
        { name: `Reason:`, value: `${reason}`, inline: true },
        { name: `Ban duration:`, value: `Permanent`, inline: true },

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
  } //end



  const prettytime = service.humanize(time!, { largest: 2 })
  const reason = args.slice(2).join(" ")
  if (!reason) return msg.channel.send('Example usage: ?compban 123456789 90d **Account sharing**')
  if (!player || !time || !reason) return msg.channel.send('Example usage: ?compban 123456789 90d Account sharing')
  const rediskey = `banned-${player.id}`

  if (seconds > 0) {

    redisClient.set(rediskey, `Discord Tag: ${player.tag} ------- Ban Reason: ${reason}`, { EX: seconds }).catch(ok => {
      logger.send(`Error in redisClient.set:\n\n${ok}`)
    })


  }

  const dmembed = new EmbedBuilder()
    .setDescription(`Hello ${player.username}, you have been esport banned for **${prettytime}**.\n\nReason: ${reason}`)
    .setColor("#ffdc3a")
    .setTimestamp()
    .setFooter({
      text: `Anything wrong? DM any of the following: Asokra#8181 -  DrEvil | 精英#0581 - wingman#7163`
    })

  player.send({ embeds: [dmembed] }).catch(err => {
    logger.send(`Couldn't dm ${player.tag}`)
  })

  serverarray.forEach(server => {
    client.guilds.fetch(server).then(async guild => {

      guild.bans.fetch(player.id).then(user => {

      })

      guild.bans.create(player, { reason: reason }).catch(async (err) => {
        logger.send(`Couldnt ban **${player.tag}** in **${guild.name}**`)

      })
    })
  })

  let thetime = addSeconds(Date.now(), seconds)
  const realtime = Math.floor(thetime.getTime() / 1000)

  const banembed = new EmbedBuilder()
    .setTitle('New Esport Ban!')
    .addFields(
      { name: `Responsible Admin:`, value: `${msg.author.tag} (${msg.author.id})`, inline: true },
      { name: `Reason:`, value: `${reason}`, inline: true },
      { name: `Ban duration:`, value: `${prettytime}`, inline: true },
      { name: `Time:`, value: `<t:${realtime}:R>` }

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