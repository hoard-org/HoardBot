import { Message } from "eris";
import { Event } from "../structures/Event.js";

export default class MessageCreate extends Event {
    name = 'messageCreate';
    once = false;
    noXP = new Set();

    async run(message: Message) {
        if (message.author.bot || message.channel.type === 1) return;
        switch (message.type) {
            /** Guild message */
            case 0:
                if (!message.member) {
                    // lol wtf
                    return;
                }
                await message.member.guild.ensure();

                // Don't add XP if user has gotten XP in the last 60 seconds or if it's disabled
                if (await message.member.guild.levelsEnabled() && !this.noXP.has(message.member.id)) {
                    let randomAmount = Math.floor(Math.random() * 25);
                    if (randomAmount < 10) {
                        randomAmount += 10
                    }
                    this.noXP.add(message.member.id)
                    setTimeout(() => {
                        this.noXP.delete(message.member?.id)
                    }, 60000)
                    await message.member.addXP(randomAmount.toString(), message);
                }
                break;
        }
    }
}
