import { Client, EmbedBuilder, Message, } from "discord.js";
import { admins, ckalog, esport, kpclog, ncklog, redisClient } from "../bot";
import { OWNERS, serverarray } from "../config";


export const CompUnban = async (msg: Message, args: string[], client: Client) => {
    
    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }
    

    let theplayerid = parseInt(args[0]) as any

    if (!isNaN(theplayerid)) { 
      return msg.channel.send('Example usage: ?compban **123456789** account sharing')
    }
  
  
    const player = await client.users.fetch(theplayerid!)
    if (!player || !args[0]) return msg.channel.send('Example usage: ?compunban 123456789')
    

    serverarray.forEach(server => {
        client.guilds.fetch(server).then(async (guild) => {

            guild.bans.remove(player).catch(async (e) => {
                return msg.channel.send(`Couldn't unban **${player.tag}** in **${guild.name}**.`)
            })

        })

    })

    const unbanembed = new EmbedBuilder()
    .setTitle('New Esport UnBan!')
    .setDescription(`Responsible Admin: ${msg.author.tag} (${msg.author.id})`)
    .setThumbnail((await client.guilds.fetch('623849289403334656')).iconURL())
    .setAuthor({ name: `${(await player).tag} (${(await player).id})`, iconURL: (await player).displayAvatarURL() })
    .setColor('Red')
    .setTimestamp()

    kpclog.send({ embeds: [unbanembed] });
    ncklog.send({ embeds: [unbanembed] });
    ckalog.send({ embeds: [unbanembed] });
    esport.send({ embeds: [unbanembed] });
    admins.send({ embeds: [unbanembed] });

    const doneembed = new EmbedBuilder()
    .setTitle('Successfully done!')
    .setDescription(`**${(await player).tag}**'s esport ban has been removed!`)
    .setColor("#ffdc3a")
    .setTimestamp();

    msg.channel.send({ embeds: [doneembed] })
    redisClient.del(`banned-${(await player).id}`)
}