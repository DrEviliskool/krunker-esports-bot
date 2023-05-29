import { ActivityType, Client, EmbedBuilder, GatewayIntentBits, Message, TextChannel, User } from 'discord.js'
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
  CloseTic,
  NewTic,
  TicketBl,
  ArchTic,
  DelTic,
  Opentic,

} from "./commands/main/Commands";
import { serverarray } from './config';
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


redisClient.on('error', (err) => {
  console.log(`REDDIS ERROR:\n\n${err}`)
})

redisClient.connect().then(() => {
  console.log('Redis Client is ready!')
}).then(() => {
  redisOn()
})




async function thesubscriber() {


  const logger = client.channels.cache.get('1103737409243451424') as TextChannel
  const kpclog = client.channels.cache.get('801552076726730752') as TextChannel
  const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
  const ckalog = client.channels.cache.get('1098035657668046960') as TextChannel
  const esport = client.channels.cache.get('1097169881222365257') as TextChannel
  const admins = client.channels.cache.get('1060536650918281296') as TextChannel

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

    case 'closeticket':
    case 'close':
    case 'ct':
      CloseTic(msg, args, client)
      break;
    case 'ticket':
    case 'create':
    case 'newticket':
    case 'createticket':
      NewTic(msg, args, client)
      break;
    case 'ticketbl':
    case 'ticketblacklist':
    case 'tb':
      TicketBl(msg, args)
      break
    case 'archive':
    case 'archiveticket':
    case 'at':
      ArchTic(msg, args, client)
      break;
    case 'delticket':
    case 'deleteticket':
    case 'delete':
    case 'dt':
      DelTic(msg, args, client)
      break;
    case 'openticket':
    case 'open':
      Opentic(msg, args, client)
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