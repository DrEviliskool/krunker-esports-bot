
import { EmbedBuilder, Message, Client, Role, GuildMember, CategoryChannel, ChannelType, TextChannel, SlashCommandBuilder, User } from "discord.js";
import { OWNERS } from "../../config";



export const ArchTic = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }

    const ticklogs = await msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1111653433519386644") as TextChannel //CAN CHANGE
    const currentchannel = msg.channel as TextChannel || msg.mentions.channels.first() as TextChannel
    const archivedcategory = await msg.guild?.channels.fetch('1111736415663964221') as CategoryChannel



    if (currentchannel.parent?.id === "1111653220440346735" || currentchannel.parent?.id === "1111736415663964221") { //CAN CHANGE

        msg.delete()


        if (currentchannel.name.startsWith("ticket-")) {

            const theuser = await client.users.fetch(currentchannel.name.replace("ticket-", "")) as User
            currentchannel.permissionOverwrites.edit(theuser.id, { ViewChannel: false }).then(async (channellll) => {

                channellll.setParent(archivedcategory)
                currentchannel.setName(`archived-${theuser.id}`)

                const embedtwo = new EmbedBuilder()
                    .setAuthor({ name: `${msg.author.tag} (${msg.author.id})`, iconURL: msg.author.displayAvatarURL() })
                    .setColor("Yellow")
                    .setTimestamp()
                    .setTitle(`archived ${theuser.tag}'s ticket`)

                ticklogs.send({ embeds: [embedtwo] })


            })


        } else if (currentchannel.name.startsWith("closed-")) {

            const otheruser = await client.users.fetch(currentchannel.name.replace("closed-", "")) as User
            currentchannel.permissionOverwrites.edit(otheruser.id, { ViewChannel: false }).then(async (channellll) => {

                channellll.setParent(archivedcategory)
                currentchannel.setName(`archived-${otheruser.id}`)
                currentchannel.permissionOverwrites.edit(otheruser.id, { ViewChannel: false } )

                const embedtwo = new EmbedBuilder()
                    .setAuthor({ name: `${msg.author.tag} (${msg.author.id})`, iconURL: msg.author.displayAvatarURL() })
                    .setColor("Yellow")
                    .setTimestamp()
                    .setTitle(`archived ${otheruser.tag}'s ticket`)

                ticklogs.send({ embeds: [embedtwo] })


            })
        }









    } else {

        msg.react("❌")
        msg.channel.send('Channel is already archived or is not in the tickets category!').then(async (themessage) => {


            setTimeout(() => {

                msg.delete()
                themessage.delete()
                
            }, 1000 * 4);

        })
        return
        
    }



}