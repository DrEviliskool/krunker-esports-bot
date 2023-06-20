import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, ChannelType, Client, EmbedBuilder, GuildMember, Interaction, PermissionsBitField, TextChannel } from "discord.js";

export const modalsubmit = async (interaction: Interaction, client: Client) => {

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

    if (interaction.isModalSubmit()) {

        const customrolepermissionsflags = [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.EmbedLinks,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.Speak,
            PermissionsBitField.Flags.Stream

        ];
        const customrolepermissions = new PermissionsBitField(customrolepermissionsflags);

        const krunkerign = interaction.fields.getTextInputValue("krunkerign12")
        const banreason = interaction.fields.getTextInputValue("banreason12")
        const unbanreason = interaction.fields.getTextInputValue("unbanreason12")
        const region = interaction.fields.getTextInputValue("region12")
        const whereban = interaction.fields.getTextInputValue("banner12")


        const userchannel = await client.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.name === `${interaction.user.id}` && channell.parent?.id === openedticketscateogry.id) as TextChannel
        const everyone = await appealserver?.roles.cache.find(r => r.name === '@everyone')

        if (!userchannel) {

            appealserver?.channels.create({

                name: `${interaction.user.id}`,
                type: ChannelType.GuildText,
                parent: openedticketscateogry,
                permissionOverwrites: [
                    {
                        id: everyone!.id,
                        deny: PermissionsBitField.Flags.ViewChannel
                    },

                    {
                        id: theinteractor.id,
                        allow: customrolepermissions
                    }

                ]
            }).then(async (newchan) => {

                interaction.reply({ content: `Ticket has been created <#${newchan.id}>`, ephemeral: true })

                const embedtwo = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL() })
                    .setColor("Green")
                    .setTimestamp()
                    .setTitle(`Created a ticket (<#${newchan.id}>)`)

                ticklogs.send({ embeds: [embedtwo] })


                const embed = new EmbedBuilder()
                    .setTitle('Welcome!')
                    .setDescription('Support will review your appeal soon! If you have any more information, feel free to provide it here.')
                    .addFields(
                        { name: `Krunker in game name:`, value: `${krunkerign}` },
                        { name: `Reason for the comp ban:`, value: `${banreason}` },
                        { name: `Why should you get unbanned?`, value: `${unbanreason}` },
                        { name: `What server were you banned from?`, value: `${whereban}` },
                        { name: `What's your region?`, value: `${region}` },

                    )
                    .setColor("#ffdc3a")
                    .setTimestamp()

                    ; (await newchan.send({ content: `${interaction.user}`, embeds: [embed], components: [closeticrow] })).pin()

            })


        } else {
            interaction.followUp({ content: `You already have a ticket opened (<#${userchannel.id}>)`, ephemeral: true })
        }
    }

}