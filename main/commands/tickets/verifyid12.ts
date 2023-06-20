import { Client, GuildMember, Interaction } from "discord.js";

export const verifyid12 = async (interaction: Interaction, client: Client) => {

  const theinteractor = interaction.member as GuildMember
  const appealserver = client.guilds.cache.get('1117740395850387479')
  const verifyrole = appealserver?.roles.cache.find(role => role.name === "Verified")


  if (interaction.isButton()) {

    if (theinteractor.roles.cache.has(`${verifyrole?.id}`)) {
      interaction.reply({ content: `You are already verified!`, ephemeral: true })
      return
    } else {
      theinteractor.roles.add(verifyrole!)
      interaction.reply({ content: `You have been verified!`, ephemeral: true })
    }

  }




}



