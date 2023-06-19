import { ButtonBuilder, ButtonStyle, Client, Embed, EmbedBuilder, Message, TextChannel, User } from "discord.js";
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import { redisClient } from "../../bot";
import { OWNERS, serverarray } from "../../config";
import { leparser } from "../../func/index";
import { addSeconds } from "date-fns";
import { pagination } from "@devraelfreeze/discordjs-pagination";



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

  if (args[0] === "view") {
    const allembeds: any[] = []


    redisClient.sendCommand(['KEYS', '*']).then((keys: any) => {

      keys.forEach(async (value) => {
        let id = value.replace("banned-", "")


        let unbanneduser: User
        try {
          unbanneduser = await client.users.fetch(id!)
        } catch (err) {
          return console.log(err)
        }

        redisClient.get(value).then(async (banreason) => {

          redisClient.ttl(value).then(async (time) => {

            const timeleft = service.humanize(time * 1000, { largest: 2 })

            allembeds.push(

              new EmbedBuilder()
                .setTitle('All temp esport banned users:')
                .setColor("#ffdc3a")
                .setThumbnail((await client.guilds.fetch('623849289403334656')).iconURL())
                .setTimestamp()
                .addFields(
                  { name: `User Tag:`, value: `${unbanneduser.tag}`, inline: true },
                  { name: `User ID:`, value: `${unbanneduser.id}`, inline: true },
                  { name: `Ban Reason:`, value: `${banreason}`, inline: true },
                  { name: `Time left:`, value: `${timeleft}`, inline: true },
                )

            )

          })
        })



      })
    }).then(() => {

      setTimeout(async () => {

        await pagination({
          embeds: allembeds, /** Array of embeds objects */
          message: msg,
          author: msg.author,
          ephemeral: false,
          time: 80000, /** 80 seconds */
          disableButtons: true, /** Remove buttons after timeout */
          fastSkip: false,
          pageTravel: true,
          buttons: [
            {
              type: 2,
              label: 'Previous Page',
              style: ButtonStyle.Primary,
              emoji: '◀️'
            },
            {
              type: 3,
              label: 'Next Page',
              style: ButtonStyle.Primary,
              emoji: '▶️' /** Disable emoji for this button */
            }
          ]

        });

      }, 1000 * 6);


    })



  } else {


    let theplayerid = args[0] as any
    if (!parseInt(theplayerid) || !theplayerid) return msg.channel.send('Example usage: ?compban **123456789** account sharing')

    let player: User

    try {
      player = await client.users.fetch(theplayerid!)
    } catch (err) {
      logger.send(`**${msg.author.tag}** got an error in **?compban:**\n\nError: **${err}**.`)
      msg.channel.send('Invalid user **__ID__**.\n\nExample usage: ?compban **123456789** 90d account sharing or ?compban **123456789** Alting (perm).')
      return
    }

    if (!args[1]) return msg.channel.send(`Example usage: ?compban 123456789 90d account sharing or ?compban 123456789 Alting (perm).`)

    const time = leparser(args[1])
    const seconds = time! / 1000

    if (!time && args[1]) {

      const reason = args.slice(1).join(" ")
      const dmembed = new EmbedBuilder()
        .setDescription(`Hello **${player.tag}**, you have been **permanently** esport banned.\n\nReason: **${reason}.**\n\n`)
        .setColor("#ffdc3a")
        .setTimestamp()
        .setFooter({
          text: `Anything wrong? Join our appeal server:`
        })
      const button = new ButtonBuilder()
        .setURL("https://discord.gg/fVYUcJYRxq")
        .setEmoji('<:KrunkerEsports:1103733400109588571>')
        .setStyle(ButtonStyle.Link) as any;

      player.send({ embeds: [dmembed], components: [button] }).catch(err => {
        logger.send(`Couldn't dm **${player.tag}**`)
      })

      setTimeout(async () => {

        try {

          serverarray.forEach(async (server) => {
            await client.guilds.fetch(server).then(async (guild) => {

              await guild.bans.create(player, { reason: reason }).catch((err) => {
                logger.send(`**${player.tag}** already banned in **${guild.name}**`)
              })

            })
          })

        } catch (err) {
          msg.channel.send(`Couldn't ban **${player.tag}** in any of the pug servers.`)
          logger.send(`Couldn't ban **${player.tag}** in any of the pug servers.\n\nError: **${err}**.`)
          return
        }

      }, 1000 * 3);



      const banembed = new EmbedBuilder()
        .setTitle('New Esport Ban!')
        .addFields(
          { name: `Responsible Admin:`, value: `${msg.author.tag} (${msg.author.id})`, inline: true },
          { name: `Reason:`, value: `${reason}`, inline: true },
          { name: `Ban duration:`, value: `Permanent`, inline: true },

        )
        .setThumbnail(
          (await client.guilds.fetch('623849289403334656')).iconURL()
        )
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
        .setDescription(`**${player.tag}** has been **permanently** esport banned.\n\nReason: **${reason}**.`)
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

      redisClient.set(rediskey, `${reason}`, { EX: seconds }).catch(ok => {
        logger.send(`Error in redisClient.set:\n\nError: **${ok}**.`)
      })


    }

    const dmembed = new EmbedBuilder()
      .setDescription(`Hello **${player.tag}**, you have been esport banned for **${prettytime}**.\n\nReason: **${reason}**.`)
      .setColor("#ffdc3a")
      .setTimestamp()
      .setFooter({
        text: `Anything wrong? Join our appeal server:`
      })
    const button = new ButtonBuilder()
      .setURL("https://discord.gg/fVYUcJYRxq")
      .setEmoji('<:KrunkerEsports:1103733400109588571>')
      .setStyle(ButtonStyle.Link) as any;

    player.send({ embeds: [dmembed], components: [button] }).catch(err => {
      logger.send(`Couldn't dm **${player.tag}**`)
    })

    setTimeout(() => {

      try {

        serverarray.forEach(server => {
          client.guilds.fetch(server).then(async guild => {

            guild.bans.create(player, { reason: reason }).catch((err) => {
              logger.send(`**${player.tag}** already banned in **${guild.name}**`)
            })

          })
        })


      } catch (err) {
        msg.channel.send(`Couldn't ban **${player.tag}** in any of the pug servers.`)
        logger.send(`Couldn't ban **${player.tag}** in any of the pug servers.\n\nError: **${err}**.`)
        return
      }

    }, 1000 * 3);





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


}