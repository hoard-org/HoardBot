import { logger } from './util/index.js';
import { Client } from './structures/Client.js';

import { config } from './config.js'

logger.info('Starting HoardBot.');

new Client(config.token, {
    // I'll add these as I go.
    intents: [],
    defaultImageFormat: 'png',
    defaultImageSize: 1024
}).start()