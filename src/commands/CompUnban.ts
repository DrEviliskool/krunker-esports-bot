import { Client, EmbedBuilder, Message, TextChannel, embedLength } from "discord.js";
import { redisClient } from "../bot";
import { OWNERS, serverarray } from "../config";


export const CompUnban = async (msg: Message, args: string[], client: Client) => {
    
    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }


    const player = client.users.fetch(args[0])

    if (!player) return msg.channel.send('Example usage: ?compunban 123456789')


    
    const kpclog = client.channels.cache.get('801552076726730752') as TextChannel
    const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
    const ckalog = client.channels.cache.get('1098035657668046960') as TextChannel
    const esport = client.channels.cache.get('1097169881222365257') as TextChannel
    const admins = client.channels.cache.get('1060536650918281296') as TextChannel

    serverarray.forEach(server => {
        client.guilds.fetch(server).then(async (guild) => {

            guild.bans.remove((await player))

        })

    })
    

    const dmembed = new EmbedBuilder()
    .setTitle('You have been esport unbanned!')
    .setDescription('Here are all the server links:')
    .addFields(
      { name: `Krunker Esports:`, value: `[Click here!](https://discord.gg/9r6SeMQC3s)` },
      { name: `Krunker Pro Ciruit (EU)`, value: `[Click here!](https://discord.gg/YPjBn5C)` },
      { name: `NACK (NA)`, value: `[Click here!](https://discord.gg/nJmqWam3tj)` },
      { name: `Competitive Krunker APAC (ASIA)`, value: `[Click here!](https://discord.gg/bRs2PVzZza)` },
    )
    .setColor("Red")
    .setTimestamp();

    (await player).send({ embeds: [dmembed] })

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
    .setColor("Red")
    .setTimestamp();

    msg.channel.send({ embeds: [doneembed] })
    redisClient.del(`banned-${(await player).id}`)
}