import { ButtonStyle, EmbedBuilder, GuildMember, Message, Client } from "discord.js";
import { XMLHttpRequest } from "xhr2"
import Pagination from "customizable-discordjs-pagination";


export const AllTourneys = async (msg: Message, args: String[], client: Client) => {
    
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

    if (orgname == "krunker esports" || orgname == "esports" || orgname == "krunker" || orgname == "esport" ) {
        orgname = "KrunkerEsports"
    }

    loadJSON(`https://www.kchub.net/api/organization/${orgname}`, myData, 'jsonp');

    const buttonarray = [
        { label: 'Previous', emoji: '◀️', style: ButtonStyle.Danger },
        { label: 'Next', emoji: '▶️', style: ButtonStyle.Success },
    ]
    const allembeds:any = []
    function myData(data) {
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
                    .setColor("Green")
                    .setFooter({ text: `Host: ${tourney.hostName}` })
                    .setTimestamp()
            )




        });
    }


    setTimeout(() => {
        new Pagination()
            .setCommand(msg)
            .setPages(allembeds)
            .setButtons(buttonarray)
            .send()
    }, 1000 * 3);



}