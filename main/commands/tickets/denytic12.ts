import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, Client, EmbedBuilder, Interaction, TextChannel, } from "discord.js";
import { OWNERS } from "../../config";

export const denytic12 = async (interaction: Interaction, client: Client) => {

    const openedticketscateogry = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753879459795086") as CategoryChannel
    const deniedddticcategory = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753934845595698") as CategoryChannel
    const ticklogs = client.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1117754445183320115") as TextChannel
  
    const openticrow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('opentic12')
        .setLabel("Open ticket")
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔓'),
  
      new ButtonBuilder()
        .setCustomId('deltic12')
        .setLabel("Delete ticket")
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔓'),
    ) as ActionRowBuilder<ButtonBuilder>

    if (interaction.isButton()) {

      if (!OWNERS.some(ID => interaction.user.id.includes(ID))) {
        interaction.reply({ content: `❌ Admin only command`, ephemeral: true })
        return
      }

      let chc = interaction.channel as TextChannel

      if (chc.parent?.id === openedticketscateogry.id || chc.parent?.id === deniedddticcategory.id) {

        let appealer = await client.users.fetch(chc.name)
        chc.setParent(deniedddticcategory)

        const embedtwo = new EmbedBuilder()
          .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
          .setColor("Red")
          .setTimestamp()
          .setTitle(`Denied ${appealer.tag}'s ticket`)

        ticklogs.send({ embeds: [embedtwo] })

        interaction.reply({ content: `Ticket has been closed! Support team controls:`, components: [openticrow!] }).catch(err => {
          console.log(err)
        })

      } else {
        interaction.reply({ content: `Ticket must be closed`, ephemeral: true })
        return
      }

    }




}