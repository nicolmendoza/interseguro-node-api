import cors from 'cors';
import express, { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { createOpenApiSpec } from '../../infrastructure/docs/openapi.js';
import { openApiJsonHandler } from './handlers/docs.handler.js';
import { healthHandler } from './handlers/health.handler.js';
import { registerRoutes } from './routes.js';

type AppDependencies = {
  jwtSecret: string;
  nodeApiUrl?: string;
};

type ValidAppDependencies = {
  jwtSecret: string;
  nodeApiUrl: string;
};

export function createApp({ jwtSecret, nodeApiUrl }: AppDependencies): Express {
  
  const dependencies = { jwtSecret, nodeApiUrl };
  validateDependencies(dependencies);

  const app = express();
  const openApiSpec = createOpenApiSpec(dependencies);

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.get('/openapi.json', openApiJsonHandler(openApiSpec));
  app.get('/health', healthHandler);

  registerRoutes(app, { jwtSecret: dependencies.jwtSecret });

  app.use((req, res) => {
    res.status(404).json({ error: 'ruta no encontrada' });
  });

  return app;
}

function validateDependencies(dependencies: AppDependencies): asserts dependencies is ValidAppDependencies {

  const { jwtSecret, nodeApiUrl } = dependencies;

  if (!jwtSecret) {
    throw new Error('jwtSecret es requerido');
  }
  if (!nodeApiUrl) {
    throw new Error('nodeApiUrl es requerido');
  }
}
