import { Client, Message, TextChannel } from "discord.js";
import { OWNERS } from "../../config";

export const delmsg = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }
    
    let messageId
    let channel = msg.mentions.channels?.first() as TextChannel || await client.channels.cache.get(args[0]) as TextChannel
    if (!channel) {
        channel = msg.channel as TextChannel
        messageId = args[0]
    }

    if(!messageId) return msg.react("❌").then(ok => {
        setTimeout(() => {
            msg.delete()
        }, 1000 * 5);
    })

    const realmsg = await channel.messages.fetch(messageId).catch(err => { msg.react("❌").then(ok => { 
        setTimeout(() => {
            msg.delete()
        }, 1000 * 5);
    }) } ) as Message


    if(realmsg) {
        realmsg.delete().then(e => {
            msg.react("✅").then(ok => {

                setTimeout(() => {
                    msg.delete()
                }, 1000 * 5);
            })
        })
    }
}
