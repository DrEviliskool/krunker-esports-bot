import { CategoryChannel, ChannelType, Client, Message } from "discord.js";
import { OWNERS } from "../../config";

export const DelCategory = async (msg: Message, args: string[], client: Client) => {
    
    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }
    
    const teamname = args.join(" ")
    if (!teamname) return msg.channel.send('Usage: ?delteam <team name>')

    const category = msg.guild?.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === teamname) as CategoryChannel
    const role = msg.guild?.roles.cache.find(r => r.name === teamname)
    role?.delete().catch(async (e) => {
        return msg.channel.send(`Couldn't delete the role. Error:\n\n${e}`)
    })


    category?.children.cache.forEach(channel => {
        channel.delete().catch(async (e) => {
            return msg.channel.send(`Couldn't delete the channel(s). Error:\n\n${e}`)
        })
    })

    setTimeout(() => {
        category?.delete().then(a => {
            msg.channel.send(`Category for the team **${teamname}** has been deleted`)
        }).catch(async (e) => {
            return msg.channel.send(`Couldn't delete the channel(s) Error:\n\n${e}`)
        })

    }, 1000 * 1.5);
   
}