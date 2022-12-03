import { readFile } from 'fs/promises';

export type Config = {
    token: string;
    developers: string[],
    applicationId: string;
    publicKey: string;
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