import { CategoryChannel, ChannelType, Client, Message } from "discord.js";
import { OWNERS } from "../config";

export const DelCategory = async (msg: Message, args: string[], client: Client) => {
    
    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }
    
    const teamname = args.join(" ")
    if (!teamname) return msg.channel.send('Usage: ?delteam <team name>')

    const category = msg.guild?.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === teamname) as CategoryChannel
    const role = msg.guild?.roles.cache.find(r => r.name === teamname)
    role?.delete()


    category?.children.cache.forEach(channel => {
        channel.delete()
    })

    setTimeout(() => {
        category?.delete().then(a => {
            msg.channel.send(`Category for the team **${teamname}** has been deleted`)
        })

    }, 1000 * 1.5);
   
}