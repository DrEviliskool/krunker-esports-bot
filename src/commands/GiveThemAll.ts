import { EmbedBuilder, Message, Client, Role, GuildMember } from "discord.js";
import { OWNERS } from "../config";
import { XMLHttpRequest } from "xhr2"



export const GiveThemAll = async (msg: Message, args: string[], client: Client, ) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
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

                        try {

                            tournament.teams.forEach(async (team) => {
                                const teamname = team.teamName.trim()

                                //roles
                                const captainrole = await msg.guild.roles.cache.find(role => role.id === captainroleid) as Role;
                                const partirole = await msg.guild.roles.cache.find(role => role.id === validatedroleid) as Role;
                                const customrole = await msg.guild.roles.cache.find(role => role.name === teamname)     as Role;

                                //player tags
                                const playeronediscordtag = team.players[0].discordName.replace(" ", "").trim(); 
                                const playertwodiscordtag = team.players[1].discordName.replace(" ", "").trim();
                                const playerthrdiscordtag = team.players[2].discordName.replace(" ", "").trim();
                                const playerfordiscordtag = team.players[3].discordName.replace(" ", "").trim();

                                


                                //players in code
                                const playeronet = await msg.guild.members.cache.find(member => member.user.tag === playeronediscordtag) as GuildMember;
                                const playertwot = await msg.guild.members.cache.find(member => member.user.tag === playertwodiscordtag) as GuildMember;
                                const playerthrt = await msg.guild.members.cache.find(member => member.user.tag === playerthrdiscordtag) as GuildMember;
                                const playerfort = await msg.guild.members.cache.find(member => member.user.tag === playerfordiscordtag) as GuildMember;

                                //team captain
                                let captain = team.captain
                                if (captain == "P1") {

                                    captain = playeronet
                                    captain.roles.add(captainrole)
                                    captain.roles.add(partirole)
                                    captain.roles.add(customrole)


                                } else if (captain == "P2") {

                                    captain = playertwot
                                    captain.roles.add(captainrole)
                                    captain.roles.add(partirole)
                                    captain.roles.add(customrole)

                                    
                                } else if (captain == "P3") {
                                    
                                    captain = playerthrt
                                    captain.roles.add(captainrole)
                                    captain.roles.add(partirole)
                                    captain.roles.add(customrole)

                                } else if (captain == "P4") {
                                    
                                    captain = playerfort
                                    captain.roles.add(captainrole)
                                    captain.roles.add(partirole)
                                    captain.roles.add(customrole)

                                }
    
                                if (team.Sub == null) {
                                    team.Sub = "No sub"
                                } else {
                                    const subdiscordtag = team.Sub.discordName[0].discordName.trim(); 
                                    const subt = await msg.guild.members.cache.find(member => member.user.tag === subdiscordtag)
    
                                    subt.roles.add(customrole)
                                    subt.roles.add(partirole)
                                    
                                }
                                
    
                                if (tournament.type == "2v2") {

                                    //player 1
                                    setTimeout(async () => {
                                        await playeronet.roles.add(partirole)
                                        await playeronet.roles.add(customrole)
    
                                    }, 1000 * 1);

                                    //player 2
                                    setTimeout(async () => {
                                        
                                        await playertwot.roles.add(partirole)
                                        await playertwot.roles.add(customrole)
    
                                    }, 1000 * 1)
    
                                } else if (tournament.type == "3v3") {

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
    
                                await msg.channel.send(`Attempting to give the roles to all members playing in the tournament **${tournament.name}** ... Please wait'`)
                              
                            
                        } catch (e) {
                            return console.log(`Error! ${e}`)
                        }
                        
                        
                         


                    })
                })
            })
        })

    }

    
}

