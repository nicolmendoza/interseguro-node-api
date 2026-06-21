import { getConfig } from '../../infrastructure/config/config.js';
import { createApp } from './app.js';

export function startHttpServer() {
  const { port, jwtSecret, goApiUrl, nodeApiUrl } = getConfig();

  return createApp({ jwtSecret, goApiUrl, nodeApiUrl }).listen(port, () => {
    console.log(`Node API escuchando en el puerto ${port}`);
  });
}

startHttpServer();
