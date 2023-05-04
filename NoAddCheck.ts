import { addSeconds } from "date-fns";
import { ChannelType } from "discord.js";
import { Client, EmbedBuilder, GuildMember, Message, TextChannel } from "discord.js";



export const NoaddCheckCommand = async (msg: Message, args: string[], client: Client) => {
    if (msg.channel.type !== ChannelType.GuildText) return

    if (!msg.member?.roles.cache.has('845388176348545075')) return;

      const adminCommandChatsIDs = ["817030916235984936", "816806455054172171", "1059991932480270537"]

      if (!adminCommandChatsIDs.includes(msg.channel.id)) return;

    let player: GuildMember | undefined;


    try {
        player = msg.mentions?.members?.first() || (await msg.guild?.members.fetch(args[0]));
        if (!player) return msg.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setTitle("Error").setDescription("User not found.")] });
    } catch (e) {
        msg.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setTitle("Error").setDescription("User not found.")] });
        return;
    }

    const authorUsername = msg.author.username;
    const authorImage = msg.author.displayAvatarURL()


    const chatChannelTier1 = client.channels.cache.get('735126005349482558') as TextChannel;
    const chatChannelTier2 = client.channels.cache.get('785143121662705664') as TextChannel;

    const filter = (m: Message) => m.author.id === msg.author.id && !Number.isNaN(parseInt(m.content));

    const datenow = Date.now()
    const twentyfiveslater = addSeconds(datenow, 26)
    const realtwentyfiveslater = Math.floor(twentyfiveslater.getTime() / 1000);

    msg.channel.send(`Objective amount of the suspected person: Closing in: <t:${realtwentyfiveslater}:R>`).then(msg1 => {
        if (msg1.channel.type !== ChannelType.GuildText) return
        msg1.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(messages => {
            if (msg.channel.type !== ChannelType.GuildText) return
            let suspectedobj = parseInt(messages.first()?.content || '0')

            const datenow = Date.now()
            const twentyfiveslater = addSeconds(datenow, 26)
            const realtwentyfiveslater2 = Math.floor(twentyfiveslater.getTime() / 1000);


            msg.channel.send(`Objective amount of TeamMate 1: Closing in: <t:${realtwentyfiveslater2}:R>`).then(msg2 => {
                if (msg2.channel.type !== ChannelType.GuildText) return
                
                msg1.edit(`Objective amount of the suspected person: <a:check:1091726081922449538>`)

                msg2.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(messages => {
                    if (msg.channel.type !== ChannelType.GuildText) return
                    const datenow = Date.now()
                    const twentyfiveslater = addSeconds(datenow, 26)
                    const realtwentyfiveslater3 = Math.floor(twentyfiveslater.getTime() / 1000);

                    let mateobj1 = parseInt(messages.first()?.content || '0')
                    msg.channel.send(`Objective amount of TeamMate 2: Closing in: <t:${realtwentyfiveslater3}:R>`).then(msg3 => {
                        if (msg3.channel.type !== ChannelType.GuildText) return
                        msg2.edit(`Objective amount of TeamMate 1: <a:check:1091726081922449538>`)
                        msg3.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(messages => {
                            if (msg.channel.type !== ChannelType.GuildText) return
                            let mateobj2 = parseInt(messages.first()?.content || '0')
                            const datenow = Date.now()
                            const twentyfiveslater = addSeconds(datenow, 26)
                            const realtwentyfiveslater4 = Math.floor(twentyfiveslater.getTime() / 1000);

                            msg.channel.send(`Objective amount of TeamMate 3: Closing in: <t:${realtwentyfiveslater4}:R>`).then(msg4 => {
                                if (msg4.channel.type !== ChannelType.GuildText) return
                                msg3.edit(`Objective amount of the TeamMate 2: <a:check:1091726081922449538>`)
                                msg4.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(messages => {
                                    if (msg.channel.type !== ChannelType.GuildText) return
                                    let mateobj3 = parseInt(messages.first()?.content || '0')
                                    const datenow = Date.now()
                                    const twentyfiveslater = addSeconds(datenow, 26)
                                    const realtwentyfiveslater5 = Math.floor(twentyfiveslater.getTime() / 1000);

                                    msg.channel.send(`Tier **___1___** or Tier **___2___**? Closing in: <t:${realtwentyfiveslater5}:R>`).then(msg5 => {
                                        if (msg5.channel.type !== ChannelType.GuildText) return
                                        msg4.edit(`Objective amount of the TeamMate 3: <a:check:1091726081922449538>`)
                                        msg5.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(messages => {
                                            if (msg.channel.type !== ChannelType.GuildText) return


                                            let whichtier = messages.first()?.content.toLowerCase() || '';
                                            if (msg.channel.type === ChannelType.GuildText) {
                                                msg.channel.bulkDelete(10)
                                            }

                                            msg.channel.send('Calculating....').then(msg => {
                                                if (msg.channel.type !== ChannelType.GuildText) return
                                                msg.channel.awaitMessages({ filter: filter, time: 10 })
                                                    .then(messages => {

                                                        let total = suspectedobj + mateobj1 + mateobj2 + mateobj3
                                                        let tenp = (total / 100) * 10
                                                        let fifteenp = (total / 100) * 15

                                                        const lessthantenp = new EmbedBuilder()
                                                            .setTitle('Done!')
                                                            .setAuthor({
                                                                name: player?.user.username || "",
                                                                iconURL: player?.user.displayAvatarURL()
                                                            })
                                                            .setDescription(`<@!${player?.id}> is less than 10% and has been NoAdded!`)
                                                            .setColor('Red')
                                                            .setTimestamp()

                                                        const lessthanfifteenp = new EmbedBuilder()
                                                            .setTitle('Done!')
                                                            .setAuthor({
                                                                name: player?.user.username || "",
                                                                iconURL: player?.user.displayAvatarURL()
                                                            })
                                                            .setDescription(`<@!${player?.id}> is less than 15% and has been NoAdded!`)
                                                            .setColor('Red')
                                                            .setTimestamp()

                                                        const usergood = new EmbedBuilder()
                                                            .setTitle('Done!')
                                                            .setAuthor({
                                                                name: player?.user.username || "",
                                                                iconURL: player?.user.displayAvatarURL()
                                                            })
                                                            .setDescription(`<@!${player?.id}> is not less than 15% and is good to go!`)
                                                            .setColor('Green')
                                                            .setTimestamp()

                                                        const Calculationsembed = new EmbedBuilder()
                                                            .setTitle('Calculations Done!')
                                                            .addFields(
                                                                { name: 'Total Objective:', value: `${total}`, inline: true },
                                                                { name: '10% Objective:', value: `${tenp}`, inline: true },
                                                                { name: '15% Objective:', value: `${fifteenp}`, inline: true }
                                                            )
                                                            .setColor('Green')
                                                            .setFooter({
                                                                text: `Ran by ${authorUsername}`,
                                                                iconURL: authorImage
                                                            })
                                                            .setTimestamp()

                                                        let chatChannel: TextChannel;



                                                        

                                                        if (whichtier == '1') {
                                                            chatChannel = chatChannelTier1




                                                            if ((suspectedobj < fifteenp) && (suspectedobj > tenp)) {
                                                                msg.channel.send({ embeds: [Calculationsembed] })
                                                                msg.channel.send({ embeds: [lessthanfifteenp] })

                                                                const data = {
                                                                    player_id: `${player?.id}`, 
                                                                    server_id: `${msg.guild.id}`,
                                                                    duration: "21600",
                                                                    reason: "TDMING (objective under 15%)"
                                                                };

                                                                fetch('https://api.neatqueue.com/api/player/ban', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'accept': 'application/json',
                                                                        'Authorization': 'u5DN-93FqABB2O83ZTilO8fHsmwETwRz',
                                                                        'Content-Type': 'application/json'
                                                                    },
                                                                    body: JSON.stringify(data)
                                                                  })
                                                                  .then(response => response.json())
                                                                  .then(data => console.log(data))
                                                                  .catch(error => console.error(error));
                                                                

                                                                return

                                                            } else if (suspectedobj < tenp) {
                                                                msg.channel.send({ embeds: [Calculationsembed] })
                                                                msg.channel.send({ embeds: [lessthantenp] })

                                                                const data = {
                                                                    player_id: `${player?.id}`, 
                                                                    server_id: `${msg.guild.id}`,
                                                                    duration: "43200",
                                                                    reason: "TDMING (objective under 10%)"
                                                                };

                                                                fetch('https://api.neatqueue.com/api/player/ban', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'accept': 'application/json',
                                                                        'Authorization': 'u5DN-93FqABB2O83ZTilO8fHsmwETwRz',
                                                                        'Content-Type': 'application/json'
                                                                    },
                                                                    body: JSON.stringify(data)
                                                                  })
                                                                  .then(response => response.json())
                                                                  .then(data => console.log(data))
                                                                  .catch(error => console.log(error));



                                                                return
                                                            } else {
                                                                msg.channel.send({ embeds: [Calculationsembed] })
                                                                msg.channel.send({ embeds: [usergood] })
                                                                return
                                                            }



                                                        } else if (whichtier == '2') {
                                                            chatChannel = chatChannelTier2

                                                            if ((suspectedobj < fifteenp) && (suspectedobj > tenp)) {
                                                                msg.channel.send({ embeds: [lessthanfifteenp] })
                                                                chatChannel.send(`!noadd <@${player?.id}> 6h TDM (<15%)`)
                                                                return
                                                            } else if (suspectedobj < tenp) {
                                                                msg.channel.send({ embeds: [lessthantenp] })
                                                                chatChannel.send(`!noadd <@${player?.id}> 12h TDM (<10%)`)
                                                                return
                                                            } else {
                                                                msg.channel.send({ embeds: [Calculationsembed] })
                                                                msg.channel.send({ embeds: [usergood] })
                                                                return
                                                            }


                                                        } else {
                                                            return msg.channel.send('Error! Please either choose 1 or 2')
                                                        }




                                                    })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })

            })
        })
    })
}