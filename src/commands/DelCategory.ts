import { CategoryChannel, ChannelType, Client, Message } from "discord.js";

export const DelCategory = async (msg: Message, args: string[], client: Client) => {

    
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
    
    const teamname = args.join(" ")
    if (!teamname) return msg.channel.send('Usage: ?delteam <team name>')

    const category = msg.guild?.channels.cache.find(ch => ch.type === ChannelType.GuildCategory && ch.name === teamname) as CategoryChannel
    const role = msg.guild?.roles.cache.find(r => r.name === teamname)
    role?.delete()


    category?.children.cache.forEach(channel => {
        channel.delete()
    })

    setTimeout(() => {
        category?.delete().then(a => {
            msg.channel.send(`Category for the team **${teamname}** has been deleted`)
        })

    }, 1000 * 1.5);
   
}