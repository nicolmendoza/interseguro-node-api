import { createApp } from './app.js';

const port = process.env.PORT ?? 3001;
const jwtSecret = process.env.JWT_SECRET ?? 'interseguro-secret';

createApp({ jwtSecret }).listen(port, () => {
  console.log(`Node API listening on port ${port}`);
});
