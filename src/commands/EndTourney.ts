import { channel } from "diagnostics_channel"
import { EmbedBuilder, ChannelType, Message, Client, CategoryChannel, Role} from "discord.js"
import { XMLHttpRequest } from "xhr2"
export const EndTourney = async (msg: Message, args: string[], client: Client) => {


    const OWNERS = [
        "920717213965643847", //THE ULTIMATE NOONER
        "937071829410000987", //DrEvil
        "356052289728806912", //Duprious
        "815003739702034482", //Asokra
        "321384844695437314", //JaySii
        "369002352138518528", //brandon
        "180504818555682816", //dojin
        "257709390537162752", //nizzq
        "521051554556542976", //Choco
        "425726603427840000", //Perky
        "316015067499855872", //ps6
        "292474867272515606", //Sakurasou
        "259526415341322250", //tjwyk
        "154052900425826304", //Wingman
      ] // ONLY PEOPLE WITH ACCESS


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

        msg.channel.send(`What team is **first** in the tournament?\n\nTeams:\n${allteamnames.join("\n")}`).then(msg2 => {
            msg2.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async (messages) => {
                let firstteam = messages.first().content

                msg.channel.send(`What team is **second** in the tournament\n\nTeams:\n${allteamnames.join("\n")}`).then(msg2 => {
                    msg2.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(messages => {
                        let secondteam = messages.first().content

                        msg.channel.send(`What team is **third** in the tournament?\n\nTeams:\n${allteamnames.join("\n")}`).then(msg2 => {
                            msg2.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async (messages) => {
                                let thirdteam = messages.first().content



                                tournament.teams.forEach(team => {
                                    
                                    if (team.teamName == firstteam || team.teamName == secondteam || team.teamName == thirdteam) {
                                        return
                                    } else {

                                        const category = msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.name === team.teamName) as CategoryChannel
                                        category.children.cache.forEach(async (channel) => {
                                            await channel.delete().then(async (o)=> {
                                                await category.delete().catch(err => console.log(err))
                                            }).catch(err => console.log(err))
                                        })

                                        const role = msg.guild?.roles.cache.find(role => role.name === team.teamName) as Role
                                        
                                        role.delete().catch(err => console.log(err))

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
                                    .setColor("Green")
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