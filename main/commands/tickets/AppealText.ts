import { Message, Client, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { OWNERS } from "../../config";

export const AppealText = async (msg: Message, args: string[], client: Client) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }

    const verify = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('verifyid12')
            .setLabel('Click here to verify!')
            .setStyle(ButtonStyle.Success)
            .setEmoji("✅"),


    ) as any


    const embed = new EmbedBuilder()
        .setTitle('__To verify, click the button below!__')
        .setDescription("Make sure to read the rules in <#1119225234940252161> before verifying.")
        .setColor("#ffdc3a")

    msg.channel.send({ embeds: [embed], components: [verify!] })

    msg.delete()





}