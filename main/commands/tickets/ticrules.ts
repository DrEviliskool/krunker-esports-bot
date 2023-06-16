import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, Message } from "discord.js";

export const ticrules = async (msg: Message, args: string[], client: Client) => {

    const discordrow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel(`Discord's Terms of Service`)
            .setURL('https://discord.com/terms')
            .setStyle(ButtonStyle.Link)
            .setEmoji('<:discord:1117779247503777802>'),

        new ButtonBuilder()
            .setLabel(`Discord's Community Guidelines`)
            .setURL('https://discord.com/guidelines')
            .setStyle(ButtonStyle.Link)
            .setEmoji('<:discord:1117779247503777802>'),
    ) as any

    const embed = new EmbedBuilder()
        .setTitle('__Ban appeal rules:__')
        .setColor("#ffdc3a")
        .setTimestamp()
        .setDescription(`This server is for ___Krunker Esports ban appeals only___. This is NOT the place for bans related to Krunker Bunker or any server other than KPC, NACK, CKA, and/or Krunker Esports.\n\n** **`)
        .addFields(
            { name: `Limit`, value: `Only **___ONE___** appeal ticket per **month**, if a user makes multiple appeal tickets (after closing), your appeal will be denied, you will be ticket blacklisted or banned from this server, and will be unable to appeal that ban.` },
            { name: `Appeals`, value: `If you are esports banned for ___account sharing___ or ___Cheating in any competitive match with or without cash prizes___, your appeal will instantly be denied and you will be ticket blacklisted.` },
            { name: `Private DMs`, value: `DMing any staff/esport admin to appeal a ban is NOT allowed. Any appealing done through DMs will be denied.` },
            { name: `Trolling`, value: `Troll tickets for any reason is NOT allowed. If a user is found trolling in tickets, your ticket will be denied instantly and you will be ticket blacklisted or banned from this server.` },
            { name: `Discord TOS`, value: `Follow Discord's __Terms of service__ and __Community Guidelines__. This includes refraining from sharing inappropriate or unpleasant content, engaging in illegal activities, or promoting harmful behavior.` },
        )

    msg.channel.send({ embeds: [embed], components: [discordrow] })
    msg.delete()
}