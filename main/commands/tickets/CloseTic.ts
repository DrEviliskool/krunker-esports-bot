import { EmbedBuilder, Message, Client, Role, GuildMember, CategoryChannel, ChannelType, TextChannel, SlashCommandBuilder, User } from "discord.js";
import { OWNERS } from "../../config";



export const CloseTic = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }

    const ticklogs = await msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1111653433519386644") as TextChannel //CAN CHANGE
    const currentchannel = msg.channel as TextChannel || msg.mentions.channels.first() as TextChannel


    if (currentchannel.parent?.id === "1111653220440346735") { //CAN CHANGE

        if (currentchannel.name.startsWith("ticket-")) {

            const theuser = await client.users.fetch(currentchannel.name.replace("ticket-", "")) as User

            currentchannel.permissionOverwrites.edit(theuser.id, { ViewChannel: false }).then(async () => {
                currentchannel.setName(`closed-${theuser.id}`)
                theuser.send(`Your ticket in **${msg.guild?.name}** has been ___closed.___`)
    
                const embedtwo = new EmbedBuilder()
                    .setAuthor({ name: `${msg.author.tag} (${msg.author.id})`, iconURL: msg.author.displayAvatarURL() })
                    .setColor("Yellow")
                    .setTimestamp()
                    .setTitle(`closed ${theuser.tag}'s ticket`)
    
                ticklogs.send({ embeds: [embedtwo] })
                msg.delete()
    
            })

        } else {

            msg.react("❌")
            msg.channel.send('Channel must be in the tickets category and already open!').then(async (themessage) => {
    
    
                setTimeout(() => {
    
                    msg.delete()
                    themessage.delete()
                    
                }, 1000 * 4);
    
            })
            return
        }











    } else {

        msg.react("❌")
        msg.channel.send('Channel must be in the tickets category!').then(async (themessage) => {


            setTimeout(() => {

                msg.delete()
                themessage.delete()
                
            }, 1000 * 4);

        })
        return
    }



}