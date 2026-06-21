export type Config = {
  port: string;
  jwtSecret: string;
  frontendUrl: string;
  rateLimitMax: number;
  rateLimitWindowSeconds: number;
  nodeApiUrl?: string;
};

export function getConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    port: getRequiredEnv(env, 'PORT'),
    jwtSecret: getRequiredEnv(env, 'JWT_SECRET'),
    frontendUrl: getRequiredEnv(env, 'FRONTEND_URL'),
    rateLimitMax: getRequiredNumberEnv(env, 'RATE_LIMIT_MAX'),
    rateLimitWindowSeconds: getRequiredNumberEnv(env, 'RATE_LIMIT_WINDOW_SECONDS'),
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

function getRequiredNumberEnv(env: NodeJS.ProcessEnv, key: string): number {
  const value = Number(getRequiredEnv(env, key));

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`la variable de entorno ${key} debe ser un numero positivo`);
  }

  return value;
}
