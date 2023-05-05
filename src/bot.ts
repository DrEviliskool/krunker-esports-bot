import { ActivityType, Client, EmbedBuilder, GatewayIntentBits, Message, TextChannel, User } from 'discord.js'
import dotenv from 'dotenv';
import * as redis from "redis"

import {
  NewTeamAll,
  GiveThemAll,
  EndTourney,
  DelCategory,
  AllTourneys,
  CompBan,
  CompUnban,
  delmsg,

} from './commands/Commands';
import { OWNERS, serverarray } from './config';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.error(err);
});


const client = new Client({
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
const logger = client.channels.cache.get('1103737409243451424') as TextChannel
const kpclog = client.channels.cache.get('801552076726730752') as TextChannel
const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
const ckalog = client.channels.cache.get('1098035657668046960') as TextChannel
const esport = client.channels.cache.get('1097169881222365257') as TextChannel
const admins = client.channels.cache.get('1060536650918281296') as TextChannel



export const redisClient = redis.createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_ENDP,
    port: 10188
  }
});


redisClient.on('error', (err) => {
  logger.send(`REDDIS ERROR:\n\n${err}`)
})
redisClient.connect().then(() => {
  console.log('Redis Client is ready!')
})


async function thesubscriber() {

  redisClient.sendCommand(['CONFIG', 'SET', 'notify-keyspace-events', 'xE'])
  const subscriber = redisClient.duplicate()
  await subscriber.connect()



  await subscriber.subscribe('__keyevent@0__:expired', async (message) => {
    const unbannedid = message.replace("banned-", "")
    const unbanneduser = await client.users.fetch(unbannedid).catch(async (err) => {

      logger.send(`<@937071829410000987> Problem in auto unban.\n\nError: **${err}**.`)

    }) as User

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




client.on('ready', async () => {


  console.log('Bot is ready!');
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

client.on('messageCreate', (msg) => {


  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase()

  let interaction:any


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
    
  }
})

client.login(process.env.BOT_TOKEN);