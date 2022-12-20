import { Command } from "../../structures/Command.js";
import { Client } from "../../structures/Client.js";
import { CommandInteraction } from "eris";

export default class Leaderboard extends Command {
    constructor(public client: Client) {
        super({
            name: 'leaderboard',
            description: 'See the guild leaderboard.',
            category: 'levels'
        })
    }

    async run(interaction: CommandInteraction) {
        if (!interaction.member) {
            throw new Error('Interaction had no member.')
        }
        const guild = interaction.member.guild
        let leaderboard = await guild.getAllLevels();
        leaderboard = leaderboard
            .filter((lvl) => guild.members.has(lvl._id))
            .sort((a, b) => parseInt(b.xp) - parseInt(a.xp))
            .slice(0, 10)


        return {
            embed: {
                author: {
                    name: `${guild.name}'s Leaderboard`,
                    icon_url: guild.dynamicIconURL() ?? undefined
                },
                fields: leaderboard.map((user) => ({
                    name: this.client.resolveUser(user._id)!.username,
                    value: `Level: ${user.level}\nXP: ${user.xp}`
                }))
            }
        }
    }
}