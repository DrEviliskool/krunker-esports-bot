import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, Client, EmbedBuilder, Interaction, TextChannel, User } from "discord.js";
import { OWNERS, serverarray } from "../../config";

export const accepttic12 = async (interaction: Interaction, client: Client) => {

  const openedticketscateogry = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1117753879459795086") as CategoryChannel
  const acceptedticcategory = await client.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1119230695894683729") as CategoryChannel
  const ticklogs = client.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1117754445183320115") as TextChannel
  const logger = client.channels.cache.get('1103737409243451424') as TextChannel

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

    const appealer = await client.users.fetch(chc.name) as User

    const embedtwo = new EmbedBuilder()
      .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
      .setColor("Green")
      .setTimestamp()
      .setTitle(`Accepted ${appealer.tag}'s ticket (<#${chc.id}>)`)

    if (chc.parent?.id === openedticketscateogry.id) {
      chc.setParent(acceptedticcategory)

      setTimeout(() => {

        try {


          const unbanembed = new EmbedBuilder()
            .setTitle('You have been comp unbanned!')
            .addFields(
              { name: `Krunker Esports:`, value: `[Click here!](https://discord.gg/9r6SeMQC3s)` },
              { name: `Krunker Pro Ciruit (EU)`, value: `[Click here!](https://discord.gg/YPjBn5C)` },
              { name: `NACK (NA)`, value: `[Click here!](https://discord.gg/nJmqWam3tj)` },
              { name: `Competitive Krunker APAC (SEA/OCE)`, value: `[Click here!](https://discord.gg/bRs2PVzZza)` },
            )
            .setColor("#ffdc3a")
            .setTimestamp();


          serverarray.forEach(server => {
            client.guilds.fetch(server).then(async (guild) => {
              guild.bans.remove(appealer, "Unbanned by an accepted appeal").catch((err) => {
                logger.send(`**${appealer.tag}** already unbanned in **${guild.name}**`)
              })
            })
          });

          appealer.send({ embeds: [unbanembed] }).catch(() => {
            ticklogs.send(`<@937071829410000987> Couldn't dm **${appealer.tag}** for server links. User's dms are closed`)
          })


        } catch (err) {
          logger.send(`<@937071829410000987> Problem in auto unban - Couldn't unban **${appealer.tag}** in any of the pug servers.`)
        }

        ticklogs.send({ embeds: [embedtwo] })



        interaction.channel?.send({ content: `Ticket has been closed! Support team controls:`, components: [openticrow!] })

      }, 1000 * 2);




    } else {
      interaction.reply({ content: `Channel must be under the **opened tickets** category`, ephemeral: true })
      return
    }

  }




}