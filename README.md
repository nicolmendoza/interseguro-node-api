# Interseguro Node API

API REST construida con Node.js, Express y TypeScript.

Su responsabilidad es recibir matrices calculadas por la API Go y devolver estadisticas sobre sus valores.

## Requisitos

- Node.js 20+
- npm
- Docker

## Produccion

Servicio desplegado en Google Cloud Run:

```txt
Node API: https://interseguro-node-api-745150536858.europe-west1.run.app
Swagger:  https://interseguro-node-api-745150536858.europe-west1.run.app/docs
OpenAPI:  https://interseguro-node-api-745150536858.europe-west1.run.app/openapi.json
```

La documentacion Swagger de este servicio describe los endpoints propios de la API Node.

## Despliegue en Google Cloud

Este servicio fue desplegado en Google Cloud Run usando un contenedor Docker:

- `interseguro-node-api`: API Node/Express para estadisticas y documentacion Swagger/OpenAPI.

El servicio se construye como imagen Docker y se despliega de forma independiente en Cloud Run. El codigo fuente esta versionado en GitHub y Cloud Build queda conectado al repositorio para compilar la imagen y publicar una nueva revision cuando se suben cambios.

Las variables de entorno se configuran desde Cloud Run, no quedan hardcodeadas en el codigo fuente. En produccion la API Node usa:

```txt
JWT_SECRET=<configurado en Cloud Run>
FRONTEND_URL=https://interseguro-technical-challenge-745150536858.europe-west1.run.app
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_SECONDS=60
NODE_API_URL=https://interseguro-node-api-745150536858.europe-west1.run.app
```

Cloud Run inyecta `PORT` automaticamente en el contenedor, por eso no se configura manualmente en produccion.

## Variables de entorno

```txt
PORT
JWT_SECRET
FRONTEND_URL
RATE_LIMIT_MAX
RATE_LIMIT_WINDOW_SECONDS
NODE_API_URL
```

`FRONTEND_URL` restringe CORS al dominio del frontend.
`RATE_LIMIT_MAX` y `RATE_LIMIT_WINDOW_SECONDS` controlan el limite de solicitudes por ventana de tiempo.
`NODE_API_URL` se usa para publicar el servidor base en la documentacion Swagger.

## Ejecutar con Docker

Crear red compartida:

```bash
docker network create interseguro-net
```

Construir imagen:

```bash
docker build -t interseguro-node-api .
```

Ejecutar contenedor:

```bash
docker run --rm --name interseguro-node-api \
  --network interseguro-net \
  -e PORT=8080 \
  -e JWT_SECRET=local-development-secret \
  -e FRONTEND_URL=http://localhost:3002 \
  -e RATE_LIMIT_MAX=100 \
  -e RATE_LIMIT_WINDOW_SECONDS=60 \
  -e NODE_API_URL=http://localhost:3001 \
  -p 3001:8080 \
  interseguro-node-api
```

Nota: estas URLs se usan para documentacion Swagger. En Docker local se recomienda usar `localhost` para que los enlaces sean utiles desde el navegador.

La API queda en:

```txt
http://localhost:3001
```

Swagger:

```txt
http://localhost:3001/docs
```

## Tests

Unit/integration tests con Jest:

```bash
npm test
```

Typecheck:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

Cobertura actual:

- `stats.test.ts`: dominio de estadisticas y validacion de matrices.
- `app.test.ts`: endpoint `/stats`, JWT y respuesta HTTP usando Supertest.

## Arquitectura hexagonal

La API usa una arquitectura hexagonal ligera.

```txt
src/
  domain/
    matrix/
      matrix.types.ts
      matrix.validation.ts
    stats/
      stats.types.ts
      stats.service.ts

  application/
    stats/
      calculateMatrixStatsUseCase.ts
      calculateMatrixStats.types.ts

  infrastructure/
    config/
      config.ts
    docs/
      openapi.ts

  transport/
    http/
      server.ts
      app.ts
      routes.ts
      dto/
      handlers/
      middleware/

test/
  app.test.ts
  stats.test.ts
```

Responsabilidades:

- `domain`: reglas puras de validacion y estadisticas.
- `application`: caso de uso para calcular estadisticas.
- `infrastructure`: configuracion y documentacion Swagger/OpenAPI.
- `transport/http`: adaptador HTTP con Express, rutas, handlers, DTOs y JWT.

## Endpoints

```txt
GET  /health
GET  /openapi.json
GET  /docs
POST /stats
```

`POST /stats` requiere JWT:

```txt
Authorization: Bearer <token>
```

## Estructura de datos

```ts
type Matrix = number[][];

type StatsRequest = {
  matrices?: Matrix[];
};

type MatrixStats = {
  max: number;
  min: number;
  average: number;
  sum: number;
  diagonalMatrices: Array<{
    index: number;
    isDiagonal: boolean;
  }>;
  hasDiagonalMatrix: boolean;
};

type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };
```

Ejemplo request:

```json
{
  "matrices": [
    [
      [1, 0],
      [0, 1]
    ]
  ]
}
```

Ejemplo response:

```json
{
  "max": 1,
  "min": 0,
  "average": 0.5,
  "sum": 2,
  "diagonalMatrices": [
    {
      "index": 0,
      "isDiagonal": true
    }
  ],
  "hasDiagonalMatrix": true
}
```

## Scripts principales

```bash
npm run build
npm run start
npm run typecheck
npm test
```
