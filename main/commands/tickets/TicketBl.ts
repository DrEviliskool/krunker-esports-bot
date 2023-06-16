import { OWNERS } from "../../config";
import { EmbedBuilder, GuildMember, Message } from "discord.js";

export const TicketBl = async (msg: Message, args: string[]) => {

    if (!OWNERS.some(ID => msg.author?.id.includes(ID))) {
        return
    }



    let player: GuildMember | undefined;

    try {
        player = msg.mentions?.members?.first() || (await msg.guild?.members.fetch(args[0]));
    } catch (e) {
        msg.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setTitle("Error").setDescription("User not found.")] });
        return;
    }

    if (!player) {
        msg.channel.send('Please specify a player');
        return;
    }

    const blacklistedrole = msg.guild?.roles.cache.find((role) => role.id === '1117769557847842966'); //CAN CHANGE
    const member = msg.guild?.members.cache.get(player.id);

    if (!blacklistedrole || !member) return;

    if (member.roles.cache.has(blacklistedrole.id)) {
        member.roles.remove(blacklistedrole)
        msg.channel.send(`Removed ${blacklistedrole.name} from ${player.user.username}`);
        return;
    } else {
        member.roles.add(blacklistedrole);
        msg.channel.send(`Gave ${blacklistedrole.name} to ${player.user.username}`);
        return
    }






}