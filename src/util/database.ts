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

    // Member Methods (Only thing here is levels and what not.)


    // User Methods

    /**
     * Ensure that a user exists in the database
     */
    async ensureUser(): Promise<void> {
        // check if it exists and create it if it doesn't
    }
}