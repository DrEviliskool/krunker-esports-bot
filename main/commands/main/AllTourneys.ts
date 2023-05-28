import { pagination } from "@devraelfreeze/discordjs-pagination";
import { ButtonStyle, EmbedBuilder, GuildMember, Message, Client, TextChannel, Interaction } from "discord.js";
import { XMLHttpRequest } from "xhr2"

export const AllTourneys = async (msg: Message, args: String[], client: Client, interaction: Interaction) => {

    let orgname = args.join(" ").toLowerCase()

    // if (!orgname) return msg.channel.send('Usage example: ?alltourneys kpc')

    // if (orgname == "krunker esports" || orgname == "esports" || orgname == "krunker" || orgname == "esport") {
    //     orgname = "KrunkerEsports"

    // }

    const arr = [] as any
    const allembeds = [] as any


    const krunkerresponse = await fetch("https://www.kchub.net/api/organization/KrunkerEsports");
    const kpcresponse = await fetch("https://www.kchub.net/api/organization/KPC")
    const nackresponse = await fetch("https://www.kchub.net/api/organization/NACK")
    const ckaresponse = await fetch("https://www.kchub.net/api/organization/CKA")



    if (orgname == "krunker esports" || orgname == "esports" || orgname == "krunker" || orgname == "esport") {

        arr.push(krunkerresponse.json())

        arr.forEach(async (whatsinside) => {

            whatsinside.then(async (eacxh) => {

                eacxh.tournaments.forEach(async (tourney) => {

                    if (tourney.bracketLink == null) tourney.bracketLink = "No brackets link"


                    allembeds.push(
                        new EmbedBuilder()
                            .setTitle(`All tournaments in Krunker!`)
                            .addFields(
                                { name: 'Name:', value: `${tourney.name}` },
                                { name: 'Description:', value: `${tourney.description}` },
                                { name: 'Region:', value: `${tourney.region}` },
                                { name: 'Game mode:', value: `${tourney.type}` },
                                { name: 'Signups closed?', value: `${tourney.signupsClosed}` },
                                { name: 'Ended?', value: `${tourney.ended}` },
                                { name: 'Brackets Link:', value: `${tourney.bracketLink}` },
                            )
                            .setColor("#ffdc3a")
                            .setFooter({ text: `Host: ${tourney.hostName}` })
                            .setTimestamp()
                    )
                })






            })

        })



        setTimeout(async () => {

            await pagination({
                embeds: allembeds, /** Array of embeds objects */
                message: msg,
                author: msg.author,
                ephemeral: false,
                time: 40000, /** 40 seconds */
                disableButtons: false, /** Remove buttons after timeout */
                fastSkip: false,
                pageTravel: false,
                buttons: [
                    {
                        type: 2,
                        label: 'Previous Page',
                        style: ButtonStyle.Primary,
                        emoji: '◀️'
                    },
                    {
                        type: 3,
                        label: 'Next Page',
                        style: ButtonStyle.Primary,
                        emoji: '▶️' /** Disable emoji for this button */
                    }
                ]

            });

        }, 1000 * 2.5);

    } else if (orgname == "kpc") {

        arr.push(kpcresponse.json())

        arr.forEach(async (whatsinside) => {

            whatsinside.then(async (eacxh) => {
    
                eacxh.tournaments.forEach(async (tourney) => {
    
                    if (tourney.bracketLink == null) tourney.bracketLink = "No brackets link"
    
    
                    allembeds.push(
                        new EmbedBuilder()
                            .setTitle(`All tournaments in KPC!`)
                            .addFields(
                                { name: 'Name:', value: `${tourney.name}` },
                                { name: 'Description:', value: `${tourney.description}` },
                                { name: 'Region:', value: `${tourney.region}` },
                                { name: 'Game mode:', value: `${tourney.type}` },
                                { name: 'Signups closed?', value: `${tourney.signupsClosed}`},
                                { name: 'Ended?', value: `${tourney.ended}` },
                                { name: 'Brackets Link:', value: `${tourney.bracketLink}` },
                            )
                            .setColor("#ffdc3a")
                            .setFooter({ text: `Host: ${tourney.hostName}` })
                            .setTimestamp()
                    )
                })
    
    
    
    
    
    
            })
    
        })
    
        
    
        setTimeout(async () => {
    
            await pagination({
                embeds: allembeds, /** Array of embeds objects */
                message: msg,
                author: msg.author,
                ephemeral: false,
                time: 40000, /** 40 seconds */
                disableButtons: false, /** Remove buttons after timeout */
                fastSkip: false,
                pageTravel: false,
                buttons: [
                    {
                        type: 2,
                        label: 'Previous Page',
                        style: ButtonStyle.Primary,
                        emoji: '◀️'
                    },
                    {
                        type: 3,
                        label: 'Next Page',
                        style: ButtonStyle.Primary,
                        emoji: '▶️' /** Disable emoji for this button */
                    }
                ]
        
            });
            
        }, 1000 * 2.5);

    } else if (orgname == "nack") {
        
        arr.push(nackresponse.json())

        arr.forEach(async (whatsinside) => {

            whatsinside.then(async (eacxh) => {
    
                eacxh.tournaments.forEach(async (tourney) => {
    
                    if (tourney.bracketLink == null) tourney.bracketLink = "No brackets link"
    
    
                    allembeds.push(
                        new EmbedBuilder()
                            .setTitle(`All tournaments in NACK!`)
                            .addFields(
                                { name: 'Name:', value: `${tourney.name}` },
                                { name: 'Description:', value: `${tourney.description}` },
                                { name: 'Region:', value: `${tourney.region}` },
                                { name: 'Game mode:', value: `${tourney.type}` },
                                { name: 'Signups closed?', value: `${tourney.signupsClosed}`},
                                { name: 'Ended?', value: `${tourney.ended}` },
                                { name: 'Brackets Link:', value: `${tourney.bracketLink}` },
                            )
                            .setColor("#ffdc3a")
                            .setFooter({ text: `Host: ${tourney.hostName}` })
                            .setTimestamp()
                    )
                })
    
    
    
    
    
    
            })
    
        })
    
        
    
        setTimeout(async () => {
    
            await pagination({
                embeds: allembeds, /** Array of embeds objects */
                message: msg,
                author: msg.author,
                ephemeral: false,
                time: 40000, /** 40 seconds */
                disableButtons: false, /** Remove buttons after timeout */
                fastSkip: false,
                pageTravel: false,
                buttons: [
                    {
                        type: 2,
                        label: 'Previous Page',
                        style: ButtonStyle.Primary,
                        emoji: '◀️'
                    },
                    {
                        type: 3,
                        label: 'Next Page',
                        style: ButtonStyle.Primary,
                        emoji: '▶️' /** Disable emoji for this button */
                    }
                ]
        
            });
            
        }, 1000 * 2.5);
    } else if (orgname == "cka") {
        
        arr.push(ckaresponse.json())

        arr.forEach(async (whatsinside) => {

            whatsinside.then(async (eacxh) => {
    
                eacxh.tournaments.forEach(async (tourney) => {
    
                    if (tourney.bracketLink == null) tourney.bracketLink = "No brackets link"
    
    
                    allembeds.push(
                        new EmbedBuilder()
                            .setTitle(`All tournaments in CKA!`)
                            .addFields(
                                { name: 'Name:', value: `${tourney.name}` },
                                { name: 'Description:', value: `${tourney.description}` },
                                { name: 'Region:', value: `${tourney.region}` },
                                { name: 'Game mode:', value: `${tourney.type}` },
                                { name: 'Signups closed?', value: `${tourney.signupsClosed}`},
                                { name: 'Ended?', value: `${tourney.ended}` },
                                { name: 'Brackets Link:', value: `${tourney.bracketLink}` },
                            )
                            .setColor("#ffdc3a")
                            .setFooter({ text: `Host: ${tourney.hostName}` })
                            .setTimestamp()
                    )
                })
    
    
    
    
    
    
            })
    
        })
    
        
    
        setTimeout(async () => {
    
            await pagination({
                embeds: allembeds, /** Array of embeds objects */
                message: msg,
                author: msg.author,
                ephemeral: false,
                time: 40000, /** 40 seconds */
                disableButtons: false, /** Remove buttons after timeout */
                fastSkip: false,
                pageTravel: false,
                buttons: [
                    {
                        type: 2,
                        label: 'Previous Page',
                        style: ButtonStyle.Primary,
                        emoji: '◀️'
                    },
                    {
                        type: 3,
                        label: 'Next Page',
                        style: ButtonStyle.Primary,
                        emoji: '▶️' /** Disable emoji for this button */
                    }
                ]
        
            });
            
        }, 1000 * 2.5);
    } else if (!orgname) {

        arr.push(krunkerresponse.json())
        arr.push(kpcresponse.json())
        arr.push(nackresponse.json())
        arr.push(ckaresponse.json())

        arr.forEach(async (whatsinside) => {

            whatsinside.then(async (eacxh) => {

                eacxh.tournaments.forEach(async (tourney) => {

                    if (tourney.bracketLink == null) tourney.bracketLink = "No brackets link"


                    allembeds.push(
                        new EmbedBuilder()
                            .setTitle(`All tournaments in all regions!`)
                            .addFields(
                                { name: 'Name:', value: `${tourney.name}` },
                                { name: 'Description:', value: `${tourney.description}` },
                                { name: 'Region:', value: `${tourney.region}` },
                                { name: 'Game mode:', value: `${tourney.type}` },
                                { name: 'Signups closed?', value: `${tourney.signupsClosed}` },
                                { name: 'Ended?', value: `${tourney.ended}` },
                                { name: 'Brackets Link:', value: `${tourney.bracketLink}` },
                            )
                            .setColor("#ffdc3a")
                            .setFooter({ text: `Host: ${tourney.hostName}` })
                            .setTimestamp()
                    )
                })






            })

        })



        setTimeout(async () => {

            await pagination({
                embeds: allembeds, /** Array of embeds objects */
                message: msg,
                author: msg.author,
                ephemeral: false,
                time: 40000, /** 40 seconds */
                disableButtons: false, /** Remove buttons after timeout */
                fastSkip: false,
                pageTravel: false,
                buttons: [
                    {
                        type: 2,
                        label: 'Previous Page',
                        style: ButtonStyle.Primary,
                        emoji: '◀️'
                    },
                    {
                        type: 3,
                        label: 'Next Page',
                        style: ButtonStyle.Primary,
                        emoji: '▶️' /** Disable emoji for this button */
                    }
                ]

            });

        }, 1000 * 2.5);


    } else {
        return msg.channel.send(`Example usage: ?alltourney { OPTION }\n\nAll options:\n\n**KPC**, **NACK**, **CKA**, **Krunker**.`)
    }
}