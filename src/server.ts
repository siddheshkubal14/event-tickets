import http from 'http';
import createApp from './app';
import dotenv from 'dotenv';
import { log } from './utils/logger';
import config from './config';

if ((process.env.NODE_ENV && process.env.NODE_ENV === 'local') ||
    !process.env.NODE_ENV) {
    const result = dotenv.config();
    if (result.error) {
        throw result.error;
    }
}


/**
 * Main entry point for the server application.
 * This script initializes the Express application, sets up the HTTP server
 * 
 * @returns {Promise<void>} A promise that resolves when the server is started.
 */
createApp()
    .then(app => {
        const server = http.createServer(app);

        server.listen(config.port, () => {
            const address = server.address();
            const port = typeof address === 'string' ? address : address?.port;
            log('info', `Server running at port ${port}`, 'server', null);
        });


        server.on('error', (err) => {
            log('error', 'Server error', 'server', err);
        });
    })
    .catch((err) => {
        log('error', 'Failed to start app', err);
    });

