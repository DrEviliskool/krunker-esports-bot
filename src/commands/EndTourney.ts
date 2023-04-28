import { channel } from "diagnostics_channel"
import { EmbedBuilder, ChannelType, Message, Client, CategoryChannel, Role } from "discord.js"
import { OWNERS } from "../config"
import { XMLHttpRequest } from "xhr2"
export const EndTourney = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }


    const filter = m => m.author.id === msg.author.id

    function loadJSON(path, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    success(JSON.parse(xhr.responseText));
                }
                else {
                    console.log('Error! ' + xhr);
                }
            }
        };
        xhr.open('GET', path, true);
        xhr.send();
    }

    const tournamentid = args[0]
    if (!tournamentid) return msg.channel.send('Usage: ?endtourney <Tournament ID>')

    loadJSON(`https://www.kchub.net/api/tournament/${tournamentid}`, myData, 'jsonp');


    function myData(tournament) {

        const allteamnames = tournament.teams.map(theteam => theteam.teamName.trim())

        msg.channel.send(`What team is **first** in the tournament?\n\nTeams:\n${allteamnames.join("\n").trim()}`).then(msg2 => {
            msg2.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async (messages) => {
                let firstteam = messages.first().content

                msg.channel.send(`What team is **second** in the tournament\n\nTeams:\n${allteamnames.join("\n")}`).then(msg2 => {
                    msg2.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(messages => {
                        let secondteam = messages.first().content

                        msg.channel.send(`What team is **third** in the tournament?\n\nTeams:\n${allteamnames.join("\n")}`).then(msg2 => {
                            msg2.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async (messages) => {
                                let thirdteam = messages.first().content



                                tournament.teams.forEach(team => {

                                    let teamName = team.teamName.trim()

                                    const category = msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.name === teamName) as CategoryChannel
                                    const role = msg.guild?.roles.cache.find(role => role.name === teamName) as Role


                                    if (teamName == firstteam || teamName == secondteam || teamName == thirdteam) {
                                        return
                                    } else {

                                        try {
                                            category.children.cache.forEach(async (channel) => {
                                                await channel.delete().then(async (o) => {
                                                    await category.delete().catch(err => console.log('Error in del category (IGNORE)'))
                                                }).catch(err => console.log('Error in del children'))
                                            })


                                            role.delete().catch(err => console.log('Err in del role'))
                                        
                                        
                                        } catch (e) {
                                            return msg.channel.send(`Couldn't delete the channels for ${teamName}. Error:\n\n${e}`)
                                        }



                                    }
                                });


                                setTimeout(async () => {

                                    const embed = new EmbedBuilder()
                                        .setTitle(`Successfully set the following:`)
                                        .setFields(
                                            { name: '1st Place 🥇:', value: `${firstteam}` },
                                            { name: '2nd Place 🥈:', value: `${secondteam}` },
                                            { name: '3rd Place 🥉:', value: `${thirdteam}` },
                                        )
                                        .setColor("#ffdc3a")
                                        .setTimestamp();

                                    msg.channel.send({ embeds: [embed] });

                                }, 1000 * 3);
                            })
                        })
                    })
                })
            })
        })
    }
}