export function getConfig(env = process.env) {
  return {
    port: getRequiredEnv(env, 'PORT'),
    jwtSecret: getRequiredEnv(env, 'JWT_SECRET'),
    goApiUrl: getOptionalEnv(env, 'GO_API_URL'),
    nodeApiUrl: getOptionalEnv(env, 'NODE_API_URL'),
  };
}

function getRequiredEnv(env, key) {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(env, key) {
  return env[key] || undefined;
}
