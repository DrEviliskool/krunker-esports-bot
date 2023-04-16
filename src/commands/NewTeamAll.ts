import { ChannelType, PermissionsBitField, EmbedBuilder, Message, Client, Role } from "discord.js";
import { XMLHttpRequest } from "xhr2"

export const NewTeamAll = async (msg: Message, args: string[], client: Client) => {

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


    if (!OWNERS.some(ID => msg.member?.id.includes(ID))) {
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
                const tourneyhelperrole = msg.guild.roles.cache.find(role => role.id === messages.first().content)
                msg.channel.send('Caster role id?').then(msg => {
                    msg.channel.awaitMessages({ filter: filter, max: 1, time: 25000, errors: ["time"] }).then(async (messages) => {
                        const casterrole = msg.guild.roles.cache.find(role => role.id === messages.first().content)


                        if (!tourneyhelperrole || !casterrole) {
                            return msg.channel.send(`Invalid role id!`)

                        } else {

                            data.teams.forEach(async (team) => {

                                const teamname = team.teamName.trim()

                                const category = msg.guild.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === teamname)
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