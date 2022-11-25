export type Config = {
    token: string;
    developers: string[]
}

let cfg: Config;

try {
    // @ts-ignore
    cfg = (await import('../config.json', { assert: { type: 'json' } })).default;
} catch (e) {
    console.log('Config invalid or does not exist. Please check.');
    process.exit(1);
}

export default cfg
