import { CategoryChannel, ChannelType, Client, Message } from "discord.js";
import { OWNERS } from "../config";

export const delmsg = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }
    const messageId = args[0]

   msg.channel.messages.fetch(messageId).then(ok => ok.delete())
}
