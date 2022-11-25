import { logger } from './util/index.js';
import Client from './structures/client.js';

import config from './config.js'

logger.info('Starting HoardBot.');

new Client(config.token).start()