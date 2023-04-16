import { Client, EmbedBuilder, Guild, GuildMember, Message, TextChannel, User } from "discord.js";
import ms from "ms";
import humanizeDuration from "humanize-duration"

export const CompBan = async (msg: Message, args: string[], client: Client) => {

    const OWNERS = [
        "920717213965643847", //THE ULTIMATE NOONER
        "937071829410000987", //DrEvil
        "356052289728806912", //Duprious
        "815003739702034482", //Asokra
        "321384844695437314", //JaySii
        "369002352138518528", //brandon
        "180504818555682816", //dojin
        "257709390537162752", //nizzq
        "521051554556542976", //Choco
        "425726603427840000", //Perky
        "316015067499855872", //ps6
        "292474867272515606", //Sakurasou
        "259526415341322250", //tjwyk
        "154052900425826304", //Wingman
      ] // ONLY PEOPLE WITH ACCESS


    if (!OWNERS.some(ID => msg.member?.id.includes(ID))) {
        return
    }

    const player = msg.mentions?.members?.first() || (await msg.guild?.members.fetch(args[0]))
    const time = ms(args[1])
    const prettytime = humanizeDuration(time, { largest: 2 } )
    const reason = args.slice(2).join(" ")

    if (!player || !time || !reason) {
      return msg.channel.send('Example usage: ?ban 123456789 90d Account sharing')
    }

    console.log(prettytime)
    


    const serverarray = [
      '672146248182136863', //kpc
      '996161328546861126', //nack
      '832245400505155595', //cka
      '623849289403334656' //krunker esports server
    ]
    const kpclog = client.channels.cache.get('801552076726730752')  as TextChannel
    const ncklog = client.channels.cache.get('1037019629853351996') as TextChannel
    const ckalog = client.channels.cache.get('832517548355747840')  as TextChannel
    const esport = client.channels.cache.get('1097169881222365257')  as TextChannel

    serverarray.forEach(server => {
      client.guilds.fetch(server).then(guild => {
        guild.bans.create(player!, {reason: reason }).catch(err => {
          console.log(err)
        })

        setTimeout(() => {

          guild.bans.remove(player!)

        }, time);

      })

    })

    setTimeout(() => {

      const unbanembed = new EmbedBuilder()
      .setAuthor({ name: `${player.user.tag} (${player.user.id})`, iconURL: player.user.displayAvatarURL.toString() })
      .setTitle('Was unbanned automatically, time expired.')
      .setColor("Green")
      .setTimestamp()

      kpclog.send({ embeds: [unbanembed] });
      ncklog.send({ embeds: [unbanembed] });
      ckalog.send({ embeds: [unbanembed] });
      esport.send({ embeds: [unbanembed] });
      
    }, time);

    const banembed = new EmbedBuilder()
    .setTitle('New Comp Ban!')
    .setDescription(`**${player?.user.tag}** (${player?.user.id}) has been comp banned for **${prettytime}**\n\nReason: **${reason}**`)
    .setAuthor({ name: `${msg.author.tag} (${msg.author.id})`, iconURL: msg.author.displayAvatarURL.toString() })
    .setColor('Red')
    .setTimestamp()

    kpclog.send({ embeds: [banembed] });
    ncklog.send({ embeds: [banembed] });
    ckalog.send({ embeds: [banembed] });
    esport.send({ embeds: [banembed] });

}