import { ChannelType, PermissionsBitField, Message, Client, Role, CategoryChannel } from "discord.js";
import { OWNERS } from "../../config";
import { XMLHttpRequest } from "xhr2"

export const NewTeamAll = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }


    const customrolepermissionsflags = [
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak,
        PermissionsBitField.Flags.Stream

    ];

    const customrolepermissions = new PermissionsBitField(customrolepermissionsflags);

    const tournamentid = args[0]

    if (!tournamentid) return msg.channel.send(`Example usage: ?newteamall <tournament id> `)


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


    loadJSON(`https://www.kchub.net/api/tournament/${tournamentid}`, myData, 'jsonp');

    function myData(data) {

        const filter = m => m.author.id === msg.author.id


        msg.channel.send('Tourney helper role id?').then(msg => {
            msg.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async (messages) => {
                const tourneyhelperrole = msg.guild.roles.cache.find(role => role.id === messages.first().content) as Role
                msg.channel.send('Caster role id?').then(msg => {
                    msg.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async (messages) => {
                        const casterrole = msg.guild.roles.cache.find(role => role.id === messages.first().content) as Role


                        if (!tourneyhelperrole || !casterrole) {
                            return msg.channel.send(`Invalid role id!`)

                        } else {

                            data.teams.forEach(async (team) => {

                                const teamname = team.teamName.trim()

                                const category = msg.guild.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === teamname) as CategoryChannel
                                if (team.validated == false) return msg.channel.send("```diff\n- The team " + teamname + " is not validated!```")


                                const everyonerole = await msg.guild.roles.cache.find(r => r.name === '@everyone')

                                if (category) {
                                    return msg.channel.send("```diff\n- The team " + teamname + " already exists!```")
                                } else {

                                    await msg.guild.roles.create({
                                        name: `${teamname}`,
                                        color: '#000000',
                                        permissions: PermissionsBitField.Flags.RequestToSpeak,
                                        hoist: true
                                    })

                                    const customrole = await msg.guild.roles.cache.find(r => r.name === teamname)



                                    await msg.guild.channels.create({
                                        name: `${teamname}`,
                                        type: ChannelType.GuildCategory,
                                        permissionOverwrites: [
                                            {
                                                id: customrole.id,
                                                allow: customrolepermissions
                                            },

                                            {
                                                id: everyonerole.id,
                                                deny: PermissionsBitField.Flags.ViewChannel
                                            },

                                            {
                                                id: tourneyhelperrole.id,
                                                allow: customrolepermissions
                                            },

                                            {
                                                id: casterrole.id,
                                                allow: customrolepermissions
                                            },


                                        ]

                                    }).then(async (CategoryChannel) => {
                                        await msg.guild.channels.create({ name: 'chat', type: ChannelType.GuildText, parent: CategoryChannel }).then(channel => {
                                            channel.createInvite({
                                                maxAge: 0,
                                                maxUses: 5,
                                            }).then(invite => {
                                                channel.send(`Invite link for the team **${teamname}**: ${invite}`)
                                            })
                                        })
                                        await msg.guild.channels.create({ name: 'vc', type: ChannelType.GuildVoice, parent: CategoryChannel, })

                                        await msg.guild?.channels.create({ name: 'private', type: ChannelType.GuildVoice, parent: category, permissionOverwrites: 
                                        [
                                            {
                                                
                                                id: casterrole.id, 
                                                allow: customrolepermissions 
                                            },

                                            {
                                                id: tourneyhelperrole.id, 
                                                allow: customrolepermissions 
                                            },
                                
                                            {
                                                id: customrole.id,
                                                allow: [PermissionsBitField.Flags.Stream, PermissionsBitField.Flags.Speak],
                                                deny: PermissionsBitField.Flags.ViewChannel
                                            },
                                
                                            {
                                                id: everyonerole.id,
                                                deny: PermissionsBitField.Flags.ViewChannel
                                
                                            },
                                
                                              
                                          ],
                                        
                                        })
                                    })

                                    msg.channel.send("```diff\n+ The team " + teamname + " is has been created!```")



                                }

                            });



                        }



                    })

                })

            })
        })


    }



}