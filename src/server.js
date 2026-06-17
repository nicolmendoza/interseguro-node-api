import { createApp } from './http/app.js';
import { getConfig } from './config.js';

const { port, jwtSecret, goApiUrl, nodeApiUrl } = getConfig();

createApp({ jwtSecret, goApiUrl, nodeApiUrl }).listen(port, () => {
  console.log(`Node API listening on port ${port}`);
});
