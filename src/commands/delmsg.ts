import { CategoryChannel, ChannelType, Client, Message } from "discord.js";
import { OWNERS } from "../config";

export const delmsg = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }
    const messageId = args[0]

   msg.channel.messages.fetch(messageId).catch(ok => {
    msg.channel.send(`Couldn't delete the message with the id ${messageId}.`)
   }).then(ok => ok.delete()).then(ok => {
    msg.channel.send(`Deleted the message with the id ${messageId}`)
   }).catch()
}
