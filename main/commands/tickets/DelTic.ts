
import { EmbedBuilder, Message, Client, Role, GuildMember, CategoryChannel, ChannelType, TextChannel, SlashCommandBuilder, User } from "discord.js";
import { OWNERS } from "../../config";



export const DelTic = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }

    const currentchannel = msg.channel as TextChannel
    const ticklogs = await msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1111653433519386644") as TextChannel //CAN CHANGE

    if (currentchannel.parent?.id === "1111653220440346735" || currentchannel.parent?.id === "1111736415663964221") {

        if (currentchannel.name.startsWith('ticket-')) {

            msg.react("❌")
            msg.channel.send('Cannot delete an open ticket').then(async (themessage) => {


                setTimeout(() => {

                    msg.delete()
                    themessage.delete()

                }, 1000 * 4);

            })
            return


        } else if (currentchannel.name.startsWith('closed-')) {

            const thecloseduser = await client.users.fetch(currentchannel.name.replace("closed-", "")) as User
            currentchannel.delete().then(async () => {

                const embedtwo = new EmbedBuilder()
                    .setAuthor({ name: `${msg.author.tag} (${msg.author.id})`, iconURL: msg.author.displayAvatarURL() })
                    .setColor("Red")
                    .setTimestamp()
                    .setTitle(`Deleted ${thecloseduser.tag}'s ticket`)

                ticklogs.send({ embeds: [embedtwo] })
            })



        } else if (currentchannel.name.startsWith('archived-')) {


            const thecloseduser = await client.users.fetch(currentchannel.name.replace("archived-", "")) as User
            currentchannel.delete().then(async () => {

                const embedtwo = new EmbedBuilder()
                    .setAuthor({ name: `${msg.author.tag} (${msg.author.id})`, iconURL: msg.author.displayAvatarURL() })
                    .setColor("Red")
                    .setTimestamp()
                    .setTitle(`Deleted ${thecloseduser.tag}'s ticket`)

                ticklogs.send({ embeds: [embedtwo] })
            })
        }



    }






}