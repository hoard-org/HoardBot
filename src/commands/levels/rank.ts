// todo; use canvas to make pretty card.

import { CommandInteraction, InteractionDataOptionsUser, User } from "eris";
import { Command, OptionType } from "../../structures/Command.js";
import { levels } from "../../util/levels.js";
import { createCanvas, loadImage } from 'canvas';
import { Client } from "../../structures/Client.js";

export default class Rank extends Command {
    constructor(public client: Client) {
        super({
            name: 'rank',
            description: 'Check a user\'s rank.',
            ephemeral: true,
            category: 'levels',
            options: [{
                type: OptionType.USER,
                name: 'user',
                required: false,
                description: 'User who\'s rank you\'d like to check.'
            }]
        })
    }

    async run(interaction: CommandInteraction) {
        let user: User | undefined


        if (!interaction.data.options) {
            user = interaction.member!.user
        } else {
            user = this.client.resolveUser((interaction.data.options as InteractionDataOptionsUser[])[0].value)
            if (!user) {
                user = interaction.member!.user;
            }
        }

        const level = await user.getLevel(interaction.guildID!)

        if (!level) {
            return { content: 'An unexpected error has occured.' }
        }

        const canvas = createCanvas(500, 167)
        const ctx = canvas.getContext('2d');
        // Draw level card BG on canvas.
        const levelBG = await loadImage('assets/levelCard.png')
        ctx.drawImage(levelBG, 0, 0, 500, 167)

        // Draw circle around user avatar.
        ctx.beginPath();
        ctx.fillStyle = '#36393f'
        ctx.arc(83.5, 83.5, 75, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Draw XP bar.
        ctx.fillRect(159, 122, 335, 40)
        ctx.fillStyle = '#fff'
        ctx.fillRect(164, 127, 325, 30);
        ctx.fillStyle = '#7ff55b';
        const nextLevelXP = levels[parseInt(level.level)].xp
        const XPPercent = parseFloat((parseInt(level.xp) / nextLevelXP).toFixed(2));
        ctx.fillRect(164, 127, Math.round(325 * XPPercent), 30)

        // Write XP;
        ctx.fillStyle = '#000'
        ctx.textAlign = 'center';
        ctx.font = '20px Ubuntu'
        ctx.fillText(`${level.xp}/${nextLevelXP} XP`, 164 + 162.5, 142 + 7.5)


        // Draw user avatar.
        ctx.beginPath();
        ctx.arc(82.5, 82.5, 69, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle = '#fff'
        ctx.stroke();
        ctx.clip()
        const userAvatar = await loadImage(user.avatarURL);
        ctx.drawImage(userAvatar, 14.5, 14.5, 138, 138)


        return {
            content: `Level: ${level.level}\nXP: ${level.xp}/${nextLevelXP}`, file: {
                name: 'Rank.png',
                file: canvas.toBuffer()
            }
        }
    }
}