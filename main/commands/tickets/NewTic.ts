import { EmbedBuilder, Message, Client, Role, GuildMember, ChannelType, CategoryChannel, PermissionsBitField, TextChannel, User } from "discord.js";

export const NewTic = async (msg: Message, args: string[], client: Client) => {

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


    const appealer = msg.author as User

    const category = await msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildCategory && channell.id === "1111653220440346735") as CategoryChannel //CAN CHANGE
    const ticklogs = await msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.id === "1111653433519386644") as TextChannel //CAN CHANGE
    const everyone = await msg.guild?.roles.cache.find(r => r.name === '@everyone')

    const userchannel = await msg.guild?.channels.cache.find(channell => channell.type === ChannelType.GuildText && channell.name === `ticket-${appealer.id}`) as TextChannel //CAN CHANGE

    if (!userchannel) {

        msg.delete()

        await msg.guild?.channels.create({

            name: `ticket-${appealer.id}`,
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
    
                {
                    id: everyone!.id,
                    deny: PermissionsBitField.Flags.ViewChannel
                },
    
                {
                    id: appealer.id,
                    allow: customrolepermissions,
                },
    
            ]
    
        }).then(async (thechannel) => {
    
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${appealer.tag} (${appealer.id})`, iconURL: appealer.displayAvatarURL() })
                .setColor("Green")
                .setTimestamp()
                .setDescription('Support will be here shortly.\n\nAsk here what you need!')
    
            thechannel.send({ content: `Welcome ${msg.author}!`, embeds: [embed] })
        }).then(async () => {
    
            const embedtwo = new EmbedBuilder()
                .setAuthor({ name: `${appealer.tag} (${appealer.id})`, iconURL: appealer.displayAvatarURL() })
                .setColor("Green")
                .setTimestamp()
                .setTitle(`made a ticket`)
    
            ticklogs.send({ embeds: [embedtwo] })
        })
    
    


    } else {

        msg.react("❌")
        msg.channel.send(`${appealer}, you already have a ticket opened (${userchannel})`).then(async (themessage) => {


            setTimeout(() => {

                msg.delete()
                themessage.delete()
                
            }, 1000 * 7);

        })
        return

    }






}