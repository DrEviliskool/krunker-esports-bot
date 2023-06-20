import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, Client, Interaction, TextChannel, User } from "discord.js";

export const opentic12 = async (interaction: Interaction, client: Client) => {

  const appealserver = client.guilds.cache.get('1117740395850387479')
  const openedticketscateogry = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753879459795086") as CategoryChannel
  const acceptedticcategory = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1119230695894683729") as CategoryChannel
  const deniedddticcategory = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753934845595698") as CategoryChannel

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

  if (interaction.isButton()) {

    let chc = await interaction.channel as TextChannel

    interaction.message.delete()
    let appealer = await client.users.fetch(chc.name) as User

    if (chc.parent?.id === acceptedticcategory.id || chc.parent?.id === deniedddticcategory.id) {

      chc.setParent(openedticketscateogry)

      setTimeout(() => {

        chc.permissionOverwrites.create(`${appealer.id}`, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true }).catch(err => { console.log(err) })
        appealer.send(`Your ticket in **${appealserver?.name}** has been ___opened___`)

        interaction.channel?.send({ content: `${appealer}, ticket has been opened!` })
        closeticrow.setComponents()

      }, 1000 * 2);

    } else {
      interaction.reply({ content: `Ticket must be closed`, ephemeral: true })
      return
    }


  }




}