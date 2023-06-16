import { ActionRowBuilder, ActivityType, AnyComponentBuilder, ButtonBuilder, ButtonStyle, CacheType, CategoryChannel, ChannelType, Client, EmbedBuilder, GatewayIntentBits, GuildMember, Message, ModalBuilder, ModalSubmitInteraction, PermissionsBitField, StringSelectMenuBuilder, TextChannel, TextInputBuilder, TextInputStyle, User } from 'discord.js'
import dotenv from 'dotenv';
import * as redis from "redis"
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';

import {
  NewTeamAll,
  GiveThemAll,
  EndTourney,
  DelCategory,
  AllTourneys,
  CompBan,
  CompUnban,
  delmsg,
  NewTic,
  TicketBl,
  AppealText,
  ticrules,

} from "./commands/main/Commands";
import { OWNERS, serverarray } from './config';
import { ChatGPTAPI } from '@twinklepkg/chatgpt';


dotenv.config();

process.on('uncaughtException', (err) => {
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.error(err);
});

function ratelimit_handler(req) {
  if (req.method === 'PATCH' && req.route === '/channels/:id') {
    return true;
  } else {
    return false;
  }
}


const client = new Client({
  rest: {
    rejectOnRateLimit: ratelimit_handler
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
}) as Client
const prefix = '?';




export const redisClient = redis.createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_ENDP,
    port: 10188
  }
});

async function redisOn() {
  setTimeout(() => {

    redisClient.quit().then(async () => {

      await redisClient.connect().then(() => {
        console.log('Redis Client has been refreshed!')
      })

    }).then(() => {
      redisOn()
    })

  }, 1000 * 60 * 60);



}

const customrolepermissionsflags = [
  PermissionsBitField.Flags.SendMessages,
  PermissionsBitField.Flags.ViewChannel,
  PermissionsBitField.Flags.EmbedLinks,
  PermissionsBitField.Flags.AttachFiles,
  PermissionsBitField.Flags.ReadMessageHistory,
  PermissionsBitField.Flags.Connect,
  PermissionsBitField.Flags.Speak,
  PermissionsBitField.Flags.Stream

];
const customrolepermissions = new PermissionsBitField(customrolepermissionsflags);

redisClient.on('error', (err) => {
  console.log(`REDDIS ERROR:\n\n${err}`)
})

redisClient.connect().then(() => {
  console.log('Redis Client is ready!')
}).then(() => {
  redisOn()
})

const logger = client.channels.cache.get('1103737409243451424') as TextChannel
const kpclog = client.channels.cache.get('801552076726730752') as TextChannel
const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
const ckalog = client.channels.cache.get('1098035657668046960') as TextChannel
const esport = client.channels.cache.get('1097169881222365257') as TextChannel
const admins = client.channels.cache.get('1060536650918281296') as TextChannel


async function thesubscriber() {


  redisClient.sendCommand(['CONFIG', 'SET', 'notify-keyspace-events', 'xE'])
  const subscriber = redisClient.duplicate()
  await subscriber.connect()



  await subscriber.subscribe('__keyevent@0__:expired', async (message) => {
    const unbannedid = message.replace("banned-", "")
    let unbanneduser: User

    try {
      unbanneduser = await client.users.fetch(unbannedid!)
    } catch (err) {
      logger.send(`<@937071829410000987> Problem in auto unban.\n\nError: **${err}**.`)
      return
    }

    try {

      serverarray.forEach(server => {
        client.guilds.fetch(server).then(async (guild) => {
          guild.bans.remove(unbanneduser, "Ban expired - Unbanned automatically")
        })
      });

    } catch (err) {

      logger.send(`<@937071829410000987> Problem in auto unban - Couldn't unban **${unbanneduser.tag}** in any of the pug servers.`)

    }



    const dmunbanembed = new EmbedBuilder()
      .setTitle('You have been esport unbanned!')
      .setDescription('Here are all the server links:')
      .addFields(
        { name: `Krunker Esports:`, value: `[Click here!](https://discord.gg/9r6SeMQC3s)` },
        { name: `Krunker Pro Ciruit (EU)`, value: `[Click here!](https://discord.gg/YPjBn5C)` },
        { name: `NACK (NA)`, value: `[Click here!](https://discord.gg/nJmqWam3tj)` },
        { name: `Competitive Krunker APAC (SEA/OCE)`, value: `[Click here!](https://discord.gg/bRs2PVzZza)` },
      )
      .setColor("#ffdc3a")
      .setTimestamp();

    unbanneduser.send({ embeds: [dmunbanembed] }).catch(async err => {
      logger.send(`Couldn't dm **${unbanneduser.tag}**`)
    })

    const unbanembed = new EmbedBuilder()
      .setAuthor({ name: `${unbanneduser.tag} (${unbanneduser.id})` })
      .setTitle('Was unbanned automatically, time expired.')
      .setColor("#ffdc3a")
      .setTimestamp();

    await kpclog.send({ embeds: [unbanembed] });
    await ncklog.send({ embeds: [unbanembed] });
    await ckalog.send({ embeds: [unbanembed] });
    await esport.send({ embeds: [unbanembed] });
    await admins.send({ embeds: [unbanembed] });

    logger.send(`EXPIRED UNBAN: ${unbanneduser.tag} (${unbannedid})`)
  });
}

client.on('interactionCreate', async (interaction) => {
  const theinteractor = interaction.member as GuildMember
  const appealserver = client.guilds.cache.get('1117740395850387479')
  const verifyrole = appealserver?.roles.cache.find(role => role.name === "Verified")
  const openedticketscateogry = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753879459795086") as CategoryChannel
  const acceptedticcategory = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1119230695894683729") as CategoryChannel
  const deniedddticcategory = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753934845595698") as CategoryChannel
  const ticklogs = client.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1117754445183320115") as TextChannel
  const blacklistedrole = appealserver?.roles.cache.find(role => role.id === '1117769557847842966'); //CAN CHANGE



  if (interaction.isButton()) {

    const closeticrow = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setCustomId('accepttic12')
        .setLabel("Accept Appeal")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId('denytic12')
        .setLabel("Deny Appeal")
        .setEmoji("❎")
        .setStyle(ButtonStyle.Danger),

    ) as ActionRowBuilder<ButtonBuilder>

    const openticrow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('opentic12')
        .setLabel("Open ticket")
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔓'),

      new ButtonBuilder()
        .setCustomId('deltic12')
        .setLabel("Delete ticket")
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔓'),
    ) as ActionRowBuilder<ButtonBuilder>


    if (theinteractor.roles.cache.has(blacklistedrole?.id!)) {
      interaction.followUp({ content: `You are ticket blacklisted, please contact any online support for more information.`, ephemeral: true })
      return
    } else {


      if (interaction.customId === "verifyid12") {

        if (theinteractor.roles.cache.has(`${verifyrole?.id}`)) {
          interaction.reply({ content: `You are already verified!`, ephemeral: true })
          return
        } else {
          theinteractor.roles.add(verifyrole!)
          interaction.reply({ content: `You have been verified!`, ephemeral: true })
        }

      } else if (interaction.customId === "createtic12") {

        const modal = new ModalBuilder()
          .setCustomId('themodal12')
          .setTitle('Krunker Esports Appeal');


        const krunkerign = new TextInputBuilder()
          .setCustomId('krunkerign12')
          .setLabel('What is your krunker in game name?')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Write your krunker in game name here.")
          .setRequired(true);
        const banreason = new TextInputBuilder()
          .setCustomId('banreason12')
          .setLabel('What is the reason of your ban?')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Write the reason of your ban here.")
          .setRequired(true);
        const unbanreason = new TextInputBuilder()
          .setCustomId("unbanreason12")
          .setLabel("Why do you think you should get unbanned?")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Write why you should be unbanned here.")
          .setRequired(true);
        const banner = new TextInputBuilder()
          .setCustomId("banner12")
          .setLabel("Who banned you? (Type none if unknown)")
          .setStyle(TextInputStyle.Short)
          .setMinLength(4)
          .setPlaceholder("Write here who banned you.")
          .setRequired(true);

        const actionrow1 = new ActionRowBuilder<TextInputBuilder>().addComponents(krunkerign);
        const actionrow2 = new ActionRowBuilder<TextInputBuilder>().addComponents(banreason);
        const actionrow3 = new ActionRowBuilder<TextInputBuilder>().addComponents(unbanreason);
        const actionrow4 = new ActionRowBuilder<TextInputBuilder>().addComponents(banner);

        await modal.addComponents(actionrow1, actionrow2, actionrow3, actionrow4)

        interaction.showModal(modal)

        const submitted = await interaction.awaitModalSubmit({
          time: 300000,
          filter: i => i.user.id === interaction.user.id
        }).catch(error => {
          interaction.followUp({ content: `An error occured ... Please try again` })
          return
        }) as ModalSubmitInteraction<CacheType>

        if (submitted) {

          const krunkerign = submitted.fields.getTextInputValue("krunkerign12")
          const banreason = submitted.fields.getTextInputValue("banreason12")
          const banner = submitted.fields.getTextInputValue("banner12")
          let unbanreason = submitted.fields.getTextInputValue("unbanreason12")
          if (!unbanreason) unbanreason = "Unknown"

          const userchannel = await client.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.name === `${interaction.user.id}` && channell.parent?.id === openedticketscateogry.id) as TextChannel
          const everyone = await appealserver?.roles.cache.find(r => r.name === '@everyone')

          if (!userchannel) {

            appealserver?.channels.create({

              name: `${interaction.user.id}`,
              type: ChannelType.GuildText,
              parent: openedticketscateogry,
              permissionOverwrites: [
                {
                  id: everyone!.id,
                  deny: PermissionsBitField.Flags.ViewChannel
                },

                {
                  id: theinteractor.id,
                  allow: customrolepermissions
                }

              ]
            }).then(async (newchan) => {

              submitted.reply({ content: `Ticket has been created <#${newchan.id}>`, ephemeral: true })

              const embedtwo = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
                .setColor("Green")
                .setTimestamp()
                .setTitle(`Created a ticket (<#${newchan.id}>)`)

              ticklogs.send({ embeds: [embedtwo] })


              const embed = new EmbedBuilder()
                .setTitle('Welcome!')
                .setDescription('Support will review your appeal soon! If you have any more information, feel free to provide it here.')
                .addFields(
                  { name: `Krunker in game name:`, value: `${krunkerign}` },
                  { name: `Reason for the comp ban:`, value: `${banreason}` },
                  { name: `Why should you get unbanned:`, value: `${unbanreason}` },
                  { name: `If known, who banned you:`, value: `${banner}` },
                )
                .setColor("#ffdc3a")
                .setTimestamp()



                ; (await newchan.send({ content: `${interaction.user}`, embeds: [embed], components: [closeticrow!] })).pin()

            })


          } else {
            submitted.reply({ content: `You already have a ticket opened (<#${userchannel.id}>)`, ephemeral: true })
          }

        } else {
          interaction.followUp({ content: `Time for submission is over ... Please try again`, ephemeral: true })
          return
        }


      } else if (interaction.customId === "accepttic12") {

        if (!OWNERS.some(ID => interaction.user.id.includes(ID))) {
          interaction.reply({ content: `❌ Admin only command`, ephemeral: true })
          return
        }

        let chc = interaction.channel as TextChannel

        const appealer = await client.users.fetch(chc.name) as User

        const embedtwo = new EmbedBuilder()
          .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: appealer.displayAvatarURL() })
          .setColor("Green")
          .setTimestamp()
          .setTitle(`Accepted ${appealer.tag}'s ticket (<#${chc.id}>)`)

        if (chc.parent?.id === openedticketscateogry.id) {
          chc.setParent(acceptedticcategory)

          setTimeout(() => {

            try {


              const unbanembed = new EmbedBuilder()
              .setTitle('You have been comp unbanned!')
              .addFields(
                { name: `Krunker Esports:`, value: `[Click here!](https://discord.gg/9r6SeMQC3s)` },
                { name: `Krunker Pro Ciruit (EU)`, value: `[Click here!](https://discord.gg/YPjBn5C)` },
                { name: `NACK (NA)`, value: `[Click here!](https://discord.gg/nJmqWam3tj)` },
                { name: `Competitive Krunker APAC (SEA/OCE)`, value: `[Click here!](https://discord.gg/bRs2PVzZza)` },
              )
              .setColor("#ffdc3a")
              .setTimestamp();


              serverarray.forEach(server => {
                client.guilds.fetch(server).then(async (guild) => {
                  guild.bans.remove(appealer, "Unbanned by an accepted appeal")
                })
              });

              appealer.send({ embeds: [unbanembed] }).catch(() => {
                ticklogs.send(`<@937071829410000987> Couldn't dm **${appealer.tag}** for server links. User's dms are closed`)
              })

        
            } catch (err) {
              logger.send(`<@937071829410000987> Problem in auto unban - Couldn't unban **${appealer.tag}** in any of the pug servers.`)
            }

            ticklogs.send({ embeds: [embedtwo] })



            interaction.reply({ content: `Ticket has been closed! Support team controls:`, components: [openticrow!] })

            const unbanembed = new EmbedBuilder()
            .setTitle('You have been comp unbanned!')
            .addFields(
              { name: `Krunker Esports:`, value: `[Click here!](https://discord.gg/9r6SeMQC3s)` },
              { name: `Krunker Pro Ciruit (EU)`, value: `[Click here!](https://discord.gg/YPjBn5C)` },
              { name: `NACK (NA)`, value: `[Click here!](https://discord.gg/nJmqWam3tj)` },
              { name: `Competitive Krunker APAC (SEA/OCE)`, value: `[Click here!](https://discord.gg/bRs2PVzZza)` },
            )
            .setColor("#ffdc3a")
            .setTimestamp();

          }, 1000 * 2);




        } else {
          interaction.reply({ content: `Channel must be under the **opened tickets** category`, ephemeral: true })
          return
        }


      } else if (interaction.customId === "opentic12") {
        let chc = await interaction.channel as TextChannel

        interaction.message.delete()
        let appealer = await client.users.fetch(chc.name) as User

        if (chc.parent?.id === acceptedticcategory.id || chc.parent?.id === deniedddticcategory.id) {

          chc.setParent(openedticketscateogry)

          setTimeout(() => {

            chc.permissionOverwrites.create(`${appealer.id}`, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(err => { console.log(err) })
            appealer.send(`Your ticket in **${appealserver?.name}** has been ___opened___`)

            interaction.channel?.send({ content: `${appealer}, ticket has been opened!` })
            closeticrow.setComponents()

          }, 1000 * 2);

        } else {
          interaction.reply({ content: `Ticket must be closed`, ephemeral: true })
          return
        }



      } else if (interaction.customId === "deltic12") {
        let chc = interaction.channel as TextChannel

        if (chc.parent?.id === acceptedticcategory.id || chc.parent?.id === deniedddticcategory.id) {

          let appealer = await client.users.fetch(chc.name)

          const embedtwo = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
            .setColor("Red")
            .setTimestamp()
            .setTitle(`Deleted ${appealer.tag}'s ticket`)

          ticklogs.send({ embeds: [embedtwo] })
          chc.delete()
        } else {
          interaction.reply({ content: `Ticket must be closed`, ephemeral: true })
          return
        }


      } else if (interaction.customId === "denytic12") {

        if (!OWNERS.some(ID => interaction.user.id.includes(ID))) {
          interaction.reply({ content: `❌ Admin only command`, ephemeral: true })
          return
        }

        let chc = interaction.channel as TextChannel

        if (chc.parent?.id === openedticketscateogry.id || chc.parent?.id === deniedddticcategory.id) {

          let appealer = await client.users.fetch(chc.name)
          chc.setParent(deniedddticcategory)

          const embedtwo = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
            .setColor("Red")
            .setTimestamp()
            .setTitle(`Denied ${appealer.tag}'s ticket`)

          ticklogs.send({ embeds: [embedtwo] })

          interaction.reply({ content: `Ticket has been closed! Support team controls:`, components: [openticrow!] })
        
        } else {
          interaction.reply({ content: `Ticket must be closed`, ephemeral: true })
          return
        }


      }

    }





  }
})




client.on('ready', async () => {


  console.log(`${client.user?.tag} is now online`);
  client.user?.setPresence({
    status: "online",
    activities: [
      {
        name: "Krunker",
        type: ActivityType.Playing
      }
    ]
  })

  thesubscriber()

});

client.on('messageCreate', async (msg) => {


  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase()

  let interaction: any


  switch (command) {
    case 'delcat':
    case 'delcategory':
      DelCategory(msg, args, client)
      break;
    case 'endtourney':
    case 'endtournament':
      EndTourney(msg, args, client)
      break;
    case 'givethemall':
      GiveThemAll(msg, args, client)
      break;
    case 'newteamall':
    case 'newtourney':
      NewTeamAll(msg, args, client)
      break;
    case 'alltourneys':
      AllTourneys(msg, args, client, interaction)
      break;
    case 'compban':
      CompBan(msg, args, client)
      break;
    case 'compunban':
      CompUnban(msg, args, client)
      break;
    case 'delmsg':
      delmsg(msg, args, client)
      break;
    case 'ticket':
      NewTic(msg, args, client)
      break;
    case 'ticketbl':
    case 'ticketblacklist':
    case 'tb':
      TicketBl(msg, args)
      break;
    case 'appealtext':
      AppealText(msg, args, client)
      break;
    case 'rules':
      ticrules(msg, args, client)
      break;


  }
})

client.login(process.env.BOT_TOKEN);









const client2 = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
}) as Client

client2.on('messageCreate', async (msg) => {

  let args = msg.content.slice("!!".length).trim().split(/ +/) as any

  if (!args) {
    args = "what is openai in 30 words"
  }
  const command = args.shift()?.toLowerCase()

  async function chatgptbot() {
    const importDynamic = new Function('modulePath', 'return import(modulePath)')
    const { ChatGPTAPI } = await importDynamic('@twinklepkg/chatgpt')


    const api = new ChatGPTAPI({ apiKey: process.env.API_KEY, }) as ChatGPTAPI


    const loadingms = await msg.channel.send(`${msg.author}\n\nPlease wait ...`)
    let res = await api.sendMessage(args.join(" "))
    loadingms.edit(`${msg.author}\n\n${res.text}`)







    const filter = m => m.author.id === msg.author.id


    let msg2 = await msg.channel.send('Any other questions? Type n/no if not. (Closing in 25 seconds)')

    msg2.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async messages => {

      let themessage = messages.first()?.content.toLowerCase()

      if (themessage === "n" || themessage === "no") {
        return msg2.edit('ChatGPT session **closed** <a:check:1112747349819797525>')
      } else {

        let newmessage = await msg.channel.send(`${msg.author}\n\nPlease wait ...`)


        res = await api.sendMessage(themessage!, {
          conversationId: res.conversationId,
          parentMessageId: res.id,
        })

        async function secondchatgpt() {

          let msg3 = await msg.channel.send('Any other questions? Type n/no if not. (Closing in 25 seconds)')

          msg3.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async messages => {

            let okaymsg = messages.first()?.content.toLowerCase()

            if (okaymsg === "n" || okaymsg === "no") {
              return msg3.edit('ChatGPT session **closed** <a:check:1112747349819797525>')
            } else {
              let newsecondmsg = await msg.channel.send(`${msg.author}\n\nPlease wait ...`)

              res = await api.sendMessage(okaymsg!, {
                conversationId: res.conversationId,
                parentMessageId: res.id,

              })

              newsecondmsg.edit(`${msg.author}\n\n${res.text}`).then(() => {
                secondchatgpt()
              })

            }


          }).catch(err => {
            msg3.edit('ChatGPT session **closed** <a:check:1112747349819797525>')
          })

        }

        newmessage.edit(`${msg.author}\n\n${res.text}`).then(() => {
          secondchatgpt()
        })

      }




    }).catch(err => {
      msg2.edit('ChatGPT session **closed** <a:check:1112747349819797525>')
    })


  }


  switch (command) {
    case 'chatgpt':
      chatgptbot()
  }

})

client2.on('ready', () => {
  console.log(`${client2.user?.tag} is now online`)
  client2.user?.setPresence({
    status: "online",
    activities: [
      {
        name: "with Anthropic",
        type: ActivityType.Competing
      }
    ]
  })
})



client2.login(process.env.BOT_TOKEN_GPT)