import { pagination } from "@devraelfreeze/discordjs-pagination";
import { ButtonStyle, EmbedBuilder, GuildMember, Message, Client, TextChannel, Interaction } from "discord.js";
import { XMLHttpRequest } from "xhr2"

export const AllTourneys = async (msg: Message, args: String[], client: Client, interaction: Interaction) => {

    // loadJSON method to open the JSON file.
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

    let orgname = args[0]

        if (!orgname) return msg.channel.send('Usage example: ?alltourneys kpc')

        if (orgname == "krunker esports" || orgname == "esports" || orgname == "krunker" || orgname == "esport") {
            orgname = "KrunkerEsports"
        }

        loadJSON(`https://www.kchub.net/api/organization/${orgname}`, myData, 'jsonp');

        const buttonarray = [
            { label: 'Previous', emoji: '◀️', style: ButtonStyle.Danger },
            { label: 'Next', emoji: '▶️', style: ButtonStyle.Success },
        ]
        const allembeds = [] as any
        async function myData(data) {
            const tournaments = data.tournaments

            tournaments.forEach(tourney => {

                if (tourney.bracketLink == null) {
                    tourney.bracketLink = "No challonge brackets link"
                }

                allembeds.push(
                    new EmbedBuilder()
                        .setTitle(`All tournaments in ${orgname}!`)
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
            }); //end


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
        }


    }






    // await paginationEmbed(
    //     msg, // The interaction object
    //     allembeds, // Your array of embeds
    //     buttonarray, // Your array of buttons
    //     60000, // (Optional) The timeout for the embed in ms, defaults to 60000 (1 minute)
    //     'Page {current}/{total}' // (Optional) The text to display in the footer, defaults to 'Page {current}/{total}'
    // );
    // .setCommand(msg)
    // .setPages(allembeds)
    // .setButtons(buttonarray)
    // .setPaginationCollector({ timeout: 120000 })
    // .send();

    // console.log('jhi')



