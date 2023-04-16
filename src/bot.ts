import { ActivityType, Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv';
import { 
  NewTeamAll, 
  GiveThemAll, 
  EndTourney, 
  DelCategory, 
  AllTourneys,
  CompBan,

} from './commands/Commands';

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
});

const prefix = '?';

client.on('ready', () => {
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
    case 'alltourneysweirtuewhrtoiqurweh':
      AllTourneys(msg, args, client)
      break;
    case 'compban':
      CompBan(msg, args, client)
      break;
    
  }
})

  

client.login(process.env.BOT_TOKEN);
