export type Config = {
  port: string;
  jwtSecret: string;
  goApiUrl?: string;
  nodeApiUrl?: string;
};

export function getConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    port: getRequiredEnv(env, 'PORT'),
    jwtSecret: getRequiredEnv(env, 'JWT_SECRET'),
    goApiUrl: getOptionalEnv(env, 'GO_API_URL'),
    nodeApiUrl: getOptionalEnv(env, 'NODE_API_URL'),
  };
}

function getRequiredEnv(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key];
  if (!value) {
    throw new Error(`falta la variable de entorno requerida: ${key}`);
  }
  return value;
}

function getOptionalEnv(env: NodeJS.ProcessEnv, key: string): string | undefined {
  return env[key] || undefined;
}
