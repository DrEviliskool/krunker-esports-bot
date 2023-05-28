
import { EmbedBuilder, Message, Client, Role, GuildMember, CategoryChannel, ChannelType, TextChannel, SlashCommandBuilder, User } from "discord.js";
import { OWNERS } from "../../config";



export const Opentic = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }
    const archivedcategory = await msg.guild?.channels.fetch('1111736415663964221') as CategoryChannel
    const category = await msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1111653220440346735") as CategoryChannel //CAN CHANGE


    const currentchannel = await msg.channel as TextChannel
    const ticklogs = await msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1111653433519386644") as TextChannel //CAN CHANGE
    let x = 1

    if (x = 1) {

        if (currentchannel.name.startsWith('ticket-')) {

            msg.react("❌")
            msg.channel.send('Cannot open an already open ticket').then(async (themessage) => {


                setTimeout(() => {

                    msg.delete()
                    themessage.delete()

                }, 1000 * 4);

            })
            return


        } else if (currentchannel.name.startsWith('closed-')) {

            try {
                currentchannel.setName("hey12343").catch(async (err) => { console.log(err.timeToReset) } )
                currentchannel.setName("xdlolamogu").catch(async (err) => { console.log(err.timeToReset) } )
                currentchannel.setName("impostersus").catch(async (err) => { console.log(err.timeToReset) } )
                currentchannel.setName("therealgoat").catch(async (err) => { console.log(err.timeToReset) } )
            } catch (err) {

                console.log(err)
            }

            // const thecloseduser = await client.users.fetch(currentchannel.name.replace("closed-", "")) as User
            // currentchannel.setName(`ticket-${thecloseduser.id}`).then(async () => {
            //     (await currentchannel.setParent(category)).setRateLimitPerUser(600, "IDK THEY SUCK")

                


            //     const embedtwo = new EmbedBuilder()
            //         .setAuthor({ name: `${msg.author.tag} (${msg.author.id})`, iconURL: msg.author.displayAvatarURL() })
            //         .setColor("Green")
            //         .setTimestamp()
            //         .setTitle(`opened ${thecloseduser.tag}'s ticket`)

            //     ticklogs.send({ embeds: [embedtwo] })

            //     thecloseduser.send(`Your ticket in **${msg.guild?.name}** has been ___opened.___`)
            // })



        } else if (currentchannel.name.startsWith('archived-')) {

            console.log('1 2 3')

            const thearchiveduser = await client.users.fetch(currentchannel.name.replace("archived-", "")) as User
            console.log(`New user id `+thearchiveduser.id)
            currentchannel.setName(`ticket-${thearchiveduser.id}`).catch(async (err) => {

                console.log(`ERROR:\n\n${err}`)
            })
            
            // .then(async () => {
            //     console.log('another 1 2 3, EPIC!!')
            //     currentchannel.setParent(category)
            //     thearchiveduser.send(`Your ticket in **${msg.guild?.name}** has been ___opened.___`)


                // const embedtwo = new EmbedBuilder()
                //     .setAuthor({ name: `${msg.author.tag} (${msg.author.id})`, iconURL: msg.author.displayAvatarURL() })
                //     .setColor("Green")
                //     .setTimestamp()
                //     .setTitle(`Opened ${thearchiveduser.tag}'s ticket`)

                // ticklogs.send({ embeds: [embedtwo] })
            // })
        } 
        // else {

        //     msg.react("❌")
        //     msg.channel.send(`Bot errored, contact DrEvil`).then(async (themessage) => {
    
    
        //         setTimeout(() => {
    
        //             msg.delete()
        //             themessage.delete()
                    
        //         }, 1000 * 4);
    
        //     })
        //     return
        // }



    }






}