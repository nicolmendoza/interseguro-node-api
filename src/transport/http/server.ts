import { getConfig } from '../../infrastructure/config/config.js';
import { createApp } from './app.js';

export function startHttpServer() {
  const { port, jwtSecret, nodeApiUrl } = getConfig();

  return createApp({ jwtSecret, nodeApiUrl }).listen(port, () => {
    console.log(`Node API escuchando en el puerto ${port}`);
  });
}

startHttpServer();
