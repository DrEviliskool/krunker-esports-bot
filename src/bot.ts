import { ActivityType, ButtonBuilder, ButtonStyle, Client, Embed, EmbedBuilder, GatewayIntentBits, Interaction, Message, TextChannel } from 'discord.js'
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



export const redisClient = redis.createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_ENDP,
    port: 10188
  }
});


redisClient.on('error', (err) => {
  console.error(`REDDIS ERROR: ${err}`)
  redisClient.quit()
})
redisClient.connect().then(ok => {
  console.log('Redis Client is ready!')
})
let msg: Message
async function thesubscriber() {

  const kpclog = client.channels.cache.get('1091733571397488660') as TextChannel
  const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
  const ckalog = client.channels.cache.get('1098035657668046960') as TextChannel
  const esport = client.channels.cache.get('1097169881222365257') as TextChannel
  const admins = client.channels.cache.get('1060536650918281296') as TextChannel

  redisClient.sendCommand(['CONFIG', 'SET', 'notify-keyspace-events', 'xE'])
  const subscriber = redisClient.duplicate()
  await subscriber.connect()

  await subscriber.subscribe('__keyevent@0__:expired', async (message) => {
    const unbannedid = message.replace("banned-", "")
    const unbanneduser = client.users.fetch(unbannedid)

    serverarray.forEach(server => {
      client.guilds.fetch(server).then(async (guild) => {
        guild.bans.remove((await unbanneduser)).catch(async (err) => {

          console.log(`Couldnt unban ${(await unbanneduser).tag} in ${guild.name}`)
        })
      })
    });

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

    ; (await unbanneduser).send({ embeds: [dmunbanembed] }).catch(async err => {
      console.log(`Couldnt dm ${(await unbanneduser).tag}`)
    })
      
    const unbanembed = new EmbedBuilder()
      .setAuthor({ name: `${(await unbanneduser).tag} (${(await unbanneduser).id})` })
      .setTitle('Was unbanned automatically, time expired.')
      .setColor("#ffdc3a")
      .setTimestamp();
    
    kpclog.send({ embeds: [unbanembed] });
    ncklog.send({ embeds: [unbanembed] });
    ckalog.send({ embeds: [unbanembed] });
    esport.send({ embeds: [unbanembed] });
    admins.send({ embeds: [unbanembed] });

      console.log(`EXPIRED UNBAN: ${(await unbanneduser).tag} (${unbannedid})`)
  });
}

client.on('ready', () => {

  
  thesubscriber()


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
});

client.on('messageCreate', (msg) => {


  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase()

  let interaction


  switch (command) {
    case 'delcat':
      DelCategory(msg, args, client)
      break;
    case 'endtourney':
      EndTourney(msg, args, client)
      break;
    case 'givethemall':
      GiveThemAll(msg, args, client)
      break;
    case 'newteamall':
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