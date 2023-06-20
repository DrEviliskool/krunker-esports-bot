import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, Client, EmbedBuilder, GuildMember, Interaction, TextChannel } from "discord.js";

export const deltic12 = async (interaction: Interaction, client: Client) => {

  const theinteractor = interaction.member as GuildMember
  const appealserver = client.guilds.cache.get('1117740395850387479')
  const verifyrole = appealserver?.roles.cache.find(role => role.name === "Verified")
  const openedticketscateogry = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753879459795086") as CategoryChannel
  const acceptedticcategory = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1119230695894683729") as CategoryChannel
  const deniedddticcategory = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753934845595698") as CategoryChannel
  const ticklogs = client.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1117754445183320115") as TextChannel
  const blacklistedrole = appealserver?.roles.cache.find(role => role.id === '1117769557847842966'); //CAN CHANGE

  const closeticrow = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId('accepttic12')
      .setLabel("Accept Appeal")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('denytic12')
      .setLabel("Deny Appeal")
      .setEmoji("❎")
      .setStyle(ButtonStyle.Danger),

  ) as ActionRowBuilder<ButtonBuilder>

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

    let chc = interaction.channel as TextChannel

    if (chc.parent?.id === acceptedticcategory.id || chc.parent?.id === deniedddticcategory.id) {

      let appealer = await client.users.fetch(chc.name)

      const embedtwo = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
        .setColor("Red")
        .setTimestamp()
        .setTitle(`Deleted ${appealer.tag}'s ticket`)

      ticklogs.send({ embeds: [embedtwo] })
      chc.delete()
    } else {
      interaction.reply({ content: `Ticket must be closed`, ephemeral: true })
      return
    }

  }




}