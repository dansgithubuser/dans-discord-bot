require('dotenv').config();

const logger = require('./logger.js');

process.on('unhandledException', (err) => logger.error('unhandled exception:', err));
process.on('unhandledRejection', (err) => logger.error('unhandled rejection:', err));

require('./express.js');
