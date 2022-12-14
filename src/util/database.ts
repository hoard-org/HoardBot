import { levels as HoardLevels } from './levels.js';
import { MongoClient } from 'mongodb';
import { logger } from './index.js'
import { config } from '../config.js';
import type { Collection } from 'mongodb';
import Guild from '../structures/database/guild.js';

export default class Database {
    // Non-null because start function runs immediately.
    users!: Collection;
    guilds!: Collection<Guild>;

    async start() {
        const mongo = new MongoClient(config.mongo.uri);
        try {
            await mongo.connect();
            logger.debug('Connected to MongoDB.')

            const db = mongo.db(config.mongo.db);
            this.users = db.collection(config.mongo.collections.users);
            this.guilds = db.collection(config.mongo.collections.guilds)
        } catch (e: any) {
            throw new Error(e);
        }
    }

    // Guild Methods

    /**
     * Ensure that a guild exists in the database
     */
    async ensureGuild(id: string): Promise<void> {
        // check if it exists and create it if it doesn't
        if (await this.guilds.countDocuments({ _id: id }, { limit: 1 }).then((res) => res === 0)) {
            await this.guilds.insertOne(new Guild(id));
        }
    }

    /**
     * 
     * @param id Guild ID;
     * @returns {array}
     */
    async getLevels(id: string) {
        const guild = await this.guilds.findOne({ _id: id })
        if (!guild) {
            // lol wtf
        }
        return guild!.data.levels
    }

    /**
     * Check if Leveling is enabled in the guild or not.
     * @param id Guild ID
     * @returns {boolean}
     */
    async areLevelsEnabled(id: string): Promise<boolean> {
        const guild = await this.guilds.findOne({ _id: id });
        if (!guild) {
            // lol wtf
        }

        return guild!.modules.levels.enabled
    }

    //. todo
    async getLevelOptions(id: string) {
        const guild = await this.guilds.findOne({ _id: id });

        return guild!.modules.levels.options
    }


    // Member Methods (Only thing here is levels and what not.)
    async addXP(userID: string, guildID: string, amount: string): Promise<{
        levelUp: boolean,
        currentLevel: number
    }> {
        await this.ensureLevelObject(userID, guildID)

        let levels = await this.getLevels(guildID)
        let userLevel = levels.find((lvl) => lvl._id === userID)!;
        const index = levels.indexOf(userLevel);
        userLevel.xp = (parseInt(amount) + parseInt(userLevel.xp)).toString();
        levels[index] = userLevel;

        let didLevelUp = false;

        if (parseInt(userLevel.xp) >= HoardLevels[parseInt(userLevel.level)].xp) {
            userLevel.level = (parseInt(userLevel.level) + 1).toString()
            didLevelUp = true;
        }

        await this.guilds.updateOne({ _id: guildID }, { $set: { 'data.levels': levels } })

        return {
            levelUp: didLevelUp,
            currentLevel: parseInt(userLevel.level)
        }
    };

    async ensureLevelObject(userID: string, guildID: string) {
        const levels = await this.getLevels(guildID);
        if (!levels.find((lvl) => lvl._id === userID)) {
            levels[levels.length] = {
                _id: userID,
                xp: '0',
                level: '0'
            }

            await this.guilds.updateOne({ _id: guildID }, { $set: { 'data.levels': levels } })
        }
    }

    setLevel() { };


    // User Methods

    /**
     * Ensure that a user exists in the database
     */
    async ensureUser(): Promise<void> {
        // check if it exists and create it if it doesn't
    }
}