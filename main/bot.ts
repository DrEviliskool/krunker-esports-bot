import { ActionRowBuilder, ActivityType, AnyComponentBuilder, ButtonBuilder, ButtonStyle, CacheType, CategoryChannel, ChannelType, Client, EmbedBuilder, GatewayIntentBits, GuildMember, Message, ModalBuilder, ModalSubmitInteraction, PermissionsBitField, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputStyle, User } from 'discord.js'
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
import { verifyid12 } from './commands/tickets/verifyid12';
import { createtic12 } from './commands/tickets/createtic12';
import { accepttic12 } from './commands/tickets/accepttic12';
import { opentic12 } from './commands/tickets/opentic12';
import { deltic12 } from './commands/tickets/deltic12';
import { denytic12 } from './commands/tickets/denytic12';
import { modalsubmit } from './commands/tickets/modal/modalsubmit';
import { selector } from './commands/tickets/modal/selector';


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

          guild.bans.remove(unbanneduser, "Ban expired - Unbanned automatically").catch((err) => {
            logger.send(`**${unbanneduser.tag}** already unbanned in **${guild.name}**`)
          })

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
    await admins.send({ embeds: [unbanembed] });

    logger.send(`EXPIRED UNBAN: ${unbanneduser.tag} (${unbannedid})`)
  });
}

let interaction: any

client.on('interactionCreate', async (interaction) => {
  const theinteractor = interaction.member as GuildMember
  const appealserver = client.guilds.cache.get('1117740395850387479')
  const blacklistedrole = appealserver?.roles.cache.find(role => role.id === '1117769557847842966'); //CAN CHANGE

  if (interaction.isModalSubmit()) {

    modalsubmit(interaction, client)
    
  }

  if (interaction.isAnySelectMenu()) {

    selector(interaction, client)
    
  }


  if (interaction.isButton()) {

    if (theinteractor.roles.cache.has(blacklistedrole?.id!)) {
      interaction.reply({ content: `You are ticket blacklisted, please contact any online support for more information.`, ephemeral: true })
      return

    } else {


      if (interaction.customId === "verifyid12") {

        verifyid12(interaction, client)

      } else if (interaction.customId === "createtic12") {

        createtic12(interaction, client)

      } else if (interaction.customId === "accepttic12") {

        accepttic12(interaction, client)

      } else if (interaction.customId === "opentic12") {

        opentic12(interaction, client)


      } else if (interaction.customId === "deltic12") {
        
        deltic12(interaction, client)

      } else if (interaction.customId === "denytic12") {

        denytic12(interaction, client)


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