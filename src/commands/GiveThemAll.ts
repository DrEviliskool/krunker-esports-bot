import { EmbedBuilder, Message, Client, Role } from "discord.js";
import { OWNERS } from "../config";
import { XMLHttpRequest } from "xhr2"



export const GiveThemAll = async (msg: Message, args: string[], client: Client, ) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return console.log('hi')
    }
    

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
    loadJSON(`https://www.kchub.net/api/tournament/${tournamentid}`, myData, 'jsonp');

    if (!tournamentid) return msg.channel.send('Usage: ?givethemall <Tournament ID>')

    function myData(tournament) {

        const filter = m => m.author.id === msg.author.id

        msg.channel.send('Captain role id?').then(msg => {
            msg.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(messages => {
                const captainroleid = messages.first().content

                msg.channel.send('Validated role id?').then(msg => {
                    msg.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async (messages) => {
                        const validatedroleid = messages.first().content
                        
                        
                        tournament.teams.forEach(async (team) => {
                            const teamname = team.teamName.trim()
                            const captainrole = await msg.guild.roles.cache.find(role => role.id === captainroleid)
                            const partirole = await msg.guild.roles.cache.find(role => role.id === validatedroleid)
                            const customrole = await msg.guild.roles.cache.find(role => role.name === teamname)

                            if (team.Sub == null) {
                                team.Sub = "No sub"
                            } else {
                                const subdiscordtag = team.Sub.discordName[0].discordName.trim(); 
                                const subt = await msg.guild.members.cache.find(member => member.user.tag === subdiscordtag)

                                subt.roles.add(customrole)
                                subt.roles.add(partirole)
                                
                            }


                            if (tournament.type == "2v2") {


                                const playeronediscordtag = team.players[0].discordName.trim(); 
                                const playertwodiscordtag = team.players[1].discordName.trim();
                                
                                const playeronet = await msg.guild.members.cache.find(member => member.user.tag === playeronediscordtag)
                                const playertwot = await msg.guild.members.cache.find(member => member.user.tag === playertwodiscordtag)


                                //player 1

                                setTimeout(async () => {
                                    
                                    await playeronet.roles.add(captainrole)
                                    await playeronet.roles.add(partirole)
                                    await playeronet.roles.add(customrole)

                                }, 1000 * 1);

                                //player 2
                                setTimeout(async () => {
                                    
                                    await playertwot.roles.add(partirole)
                                    await playertwot.roles.add(customrole)

                                }, 1000 * 1)



                            } else if (tournament.type == "3v3") {

                                const playeronediscordtag = team.players[0].discordName.trim(); 
                                const playertwodiscordtag = team.players[1].discordName.trim();
                                const playerthrdiscordtag = team.players[2].discordName.trim();
                                
                                const playeronet = await msg.guild.members.cache.find(member => member.user.tag === playeronediscordtag)
                                const playertwot = await msg.guild.members.cache.find(member => member.user.tag === playertwodiscordtag)
                                const playerthrt = await msg.guild.members.cache.find(member => member.user.tag === playerthrdiscordtag)


                                //player 1

                                setTimeout(async () => {
                                    
                                    await playeronet.roles.add(captainrole)
                                    await playeronet.roles.add(partirole)
                                    await playeronet.roles.add(customrole)

                                }, 1000 * 1);

                                //player 2
                                setTimeout(async () => {
                                    
                                    await playertwot.roles.add(partirole)
                                    await playertwot.roles.add(customrole)

                                }, 1000 * 1);

                                //player 3
                                setTimeout(async () => {
                                    
                                    await playerthrt.roles.add(partirole)
                                    await playerthrt.roles.add(customrole)

                                }, 1000 * 1);
                                
                                

                                
                            } else if (tournament.type == "4v4") {

                                const playeronediscordtag = team.players[0].discordName.trim(); 
                                const playertwodiscordtag = team.players[1].discordName.trim();
                                const playerthrdiscordtag = team.players[2].discordName.trim();
                                const playerfordiscordtag = team.players[3].discordName.trim();
                                
                                const playeronet = await msg.guild.members.cache.find(member => member.user.tag === playeronediscordtag)
                                const playertwot = await msg.guild.members.cache.find(member => member.user.tag === playertwodiscordtag)
                                const playerthrt = await msg.guild.members.cache.find(member => member.user.tag === playerthrdiscordtag)
                                const playerfort = await msg.guild.members.cache.find(member => member.user.tag === playerfordiscordtag)


                                //player 1

                                setTimeout(async () => {
                                    
                                    await playeronet.roles.add(captainrole)
                                    await playeronet.roles.add(partirole)
                                    await playeronet.roles.add(customrole)

                                }, 1000 * 1);

                                //player 2
                                setTimeout(async () => {
                                    
                                    await playertwot.roles.add(partirole)
                                    await playertwot.roles.add(customrole)

                                }, 1000 * 1);

                                //player 3
                                setTimeout(async () => {
                                    
                                    await playerthrt.roles.add(partirole)
                                    await playerthrt.roles.add(customrole)

                                }, 1000 * 1);

                                //player 4
                                setTimeout(async () => {
                                    
                                    await playerfort.roles.add(partirole)
                                    await playerfort.roles.add(customrole)
                                    
                                }, 1000 * 1);
                                
                            }

                        })

                            await msg.channel.send('Attempting to give the roles to all members playing in the tournament ... Please wait')
                            


                    })
                })
            })
        })

    }

    
}

