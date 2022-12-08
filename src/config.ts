import { readFile } from 'fs/promises';

export type Config = {
    /** Bot token */
    token: string;
    /** Bot developers */
    developers: string[],
    /** Mango settings. */
    mongo: {
        /** MongoDB connection string. https://www.mongodb.com/docs/manual/reference/connection-string/ */
        uri: string;
        /** DB to use in MongodB. */
        db: string;
        /** DB collection names */
        collections: {
            /** User collection */
            users: string;
            /** Guild collection */
            guilds: string
        }
    }
}

let cfg: Config;

try {
    const file = await readFile('./config.json', 'utf-8')
    cfg = JSON.parse(file)
} catch (e) {
    console.error(e);
    console.log('Config invalid or does not exist. Please check.');
    process.exit(1);
}

export const config: Config = cfg;