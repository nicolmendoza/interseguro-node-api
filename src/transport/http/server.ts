import { getConfig } from '../../infrastructure/config/config.js';
import { createApp } from './app.js';

export function startHttpServer() {
  const { port, jwtSecret, frontendUrl, rateLimitMax, rateLimitWindowSeconds, nodeApiUrl } = getConfig();

  return createApp({ jwtSecret, frontendUrl, rateLimitMax, rateLimitWindowSeconds, nodeApiUrl }).listen(port, () => {
    console.log(`Node API escuchando en el puerto ${port}`);
  });
}

startHttpServer();
