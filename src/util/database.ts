import { MongoClient } from 'mongodb';
import { logger } from './index.js'
import { config } from '../config.js';
import type { Collection } from 'mongodb';

export default class Database {
    // Non-null because start function runs immediately.
    users!: Collection;
    guilds!: Collection;

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

    ensureGuild() { }

    // Member Methods (Only thing here is levels and what not.)


    // User Methods

    ensureUser() { }
}