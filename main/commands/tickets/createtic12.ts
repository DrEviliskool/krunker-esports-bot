import { ActionRowBuilder, Client, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const createtic12 = async (interaction: Interaction, client: Client) => {

    if (interaction.isButton()) {

      const modal = new ModalBuilder()
      .setCustomId('themodal12')
      .setTitle('Krunker Esports Appeal');


    const krunkerign = new TextInputBuilder()
      .setCustomId('krunkerign12')
      .setLabel('What is your krunker in game name?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Write your krunker in game name here.")
      .setMaxLength(1000)
      .setRequired(true);
    const banreason = new TextInputBuilder()
      .setCustomId('banreason12')
      .setLabel('What is the reason of your ban?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Write the reason of your ban here.")
      .setMaxLength(1000)
      .setRequired(true);
    const unbanreason = new TextInputBuilder()
      .setCustomId("unbanreason12")
      .setLabel("Why do you think you should get unbanned?")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Write why you should be unbanned here.")
      .setMaxLength(1000)
      .setRequired(true);
    const region = new TextInputBuilder()
      .setCustomId("region12")
      .setLabel("What's your region? (EU/NA/ASIA)")
      .setStyle(TextInputStyle.Short)
      .setMinLength(2)
      .setMaxLength(1000)
      .setPlaceholder("Write here your region.");
    const banner = new TextInputBuilder()
      .setCustomId("banner12")
      .setLabel("What server were you banned from?")
      .setStyle(TextInputStyle.Short)
      .setMinLength(2)
      .setMaxLength(1000)
      .setPlaceholder("Write here which server were you banned from.");

    const actionrow1 = new ActionRowBuilder<TextInputBuilder>().addComponents(krunkerign);
    const actionrow2 = new ActionRowBuilder<TextInputBuilder>().addComponents(banreason);
    const actionrow3 = new ActionRowBuilder<TextInputBuilder>().addComponents(unbanreason);
    const actionrow4 = new ActionRowBuilder<TextInputBuilder>().addComponents(banner);
    const actionrow5 = new ActionRowBuilder<TextInputBuilder>().addComponents(region);

    modal.addComponents(actionrow1, actionrow2, actionrow3, actionrow4, actionrow5,)

    interaction.showModal(modal)

    }




}