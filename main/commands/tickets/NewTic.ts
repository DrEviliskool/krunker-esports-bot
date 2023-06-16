import { EmbedBuilder, Message, Client, Role, GuildMember, ChannelType, CategoryChannel, PermissionsBitField, TextChannel, User, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { OWNERS } from "../../config";

export const NewTic = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }

    const theticketrow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('createtic12')
        .setLabel('Create a ticket')
        .setStyle(ButtonStyle.Success)
        .setEmoji("📩"),
    ) as any

    const embed2 = new EmbedBuilder()
    .setTitle('__Click on the button below to create an appeal ticket__')
    .setColor("#ffdc3a")
    .setTimestamp()
    .setDescription("Please read the rules in <#1119225234940252161> before creating a ticket.")

    msg.channel.send({ embeds: [embed2], components: [theticketrow!] })

    msg.delete()
}