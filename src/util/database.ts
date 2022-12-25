import {
    levels as HoardLevels
} from './levels.js';
import { MongoClient } from 'mongodb';
import { logger } from './index.js'
import { config } from '../config.js';
import type { Collection } from 'mongodb';
import {
    Guild,
    GuildMemberLevel,
    GuildModules,
    ModLogEntry,
    ModLogActionTypes
} from '../structures/database/guild.js';
import { User } from '../structures/database/user.js';

export default class Database {
    // Non-null because start function runs immediately.
    users!: Collection<User>;
    guilds!: Collection<Guild>;

    /**
     * Start the database.
     */
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
     * 
     * @param id Guild ID
     * @returns {GuildLevelOptions}
     */
    async getLevelOptions(id: string) {
        const guild = await this.guilds.findOne({ _id: id });

        return guild!.modules.levels.options
    }

    /**
     * 
     * @param id Guild ID;
     * @returns {ModLogEntry[]}
     */
    async getModLog(id: string): Promise<ModLogEntry[]> {
        const guild = await this.guilds.findOne({ _id: id });

        return guild!.data.modlog
    }

    async addModLog({
        guildId,
        offenderId,
        modId,
        time,
        reason,
        actionType
    }: {
        guildId: string,
        offenderId: string,
        modId: string,
        time?: string,
        actionType: ModLogActionTypes,
        reason: string
    }) {
        const currentModlog = await this.getModLog(guildId);
        const nextCase = currentModlog.length === 0 ? 1 : currentModlog[currentModlog.length].case++;

        await this.guilds.updateOne({ _id: guildId }, {
            $set: {
                'data.modlog': [...currentModlog, {
                    case: nextCase,
                    userId: offenderId,
                    modId: modId,
                    type: actionType,
                    createdAt: Date.now(),
                    reason: reason,
                    time: time
                }]
            }
        })

    }

    /**
     * 
     * @param id Guild ID
     * @returns {GuildModules}
     */
    async getGuildModules(id: string): Promise<GuildModules> {
        const guild = await this.guilds.findOne({ _id: id });
        if (!guild) {
            // lol wtf
        }
        return guild!.modules
    }

    // Member Methods (Only thing here is levels and what not.)

    /**
     * Add XP to a user.
     * @param userID User ID
     * @param guildID Guild ID
     * @param amount Amount of XP to add
     * @returns 
     */
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

    /**
     * Ensure that there's a level object for the user.
     * @param userID User ID
     * @param guildID Guild ID
     */
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

    /**
     * Get a user's level.
     * @param userID User ID
     * @param guildID Guild ID
     * @returns {GuildMemberLevel | null}
     */
    async getLevel(userID: string, guildID: string): Promise<GuildMemberLevel | null> {
        const levels = await this.getLevels(guildID)
        const userLevel = levels.find((lvl) => lvl._id === userID);
        if (!userLevel) {
            return null;
        }

        return userLevel
    }


    // User Methods

    /**
     * Ensure that a user exists in the database
     */
    async ensureUser(id: string): Promise<void> {
        // check if it exists and create it if it doesn't
        if (await this.users.countDocuments({ _id: id }, { limit: 1 }).then((res) => res === 0)) {
            await this.users.insertOne(new User(id));
        }
    }
}