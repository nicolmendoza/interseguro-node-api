# Interseguro Node API

API REST construida con Node.js, Express y TypeScript.

Su responsabilidad es recibir matrices calculadas por la API Go y devolver estadisticas sobre sus valores.

## Requisitos

- Node.js 20+
- npm
- Docker

La forma recomendada de levantar el proyecto es con Docker, porque el reto solicita contenerizar las aplicaciones y facilita ejecutar el servicio con configuracion consistente.

## Produccion

Servicio desplegado en Google Cloud Run:

```txt
Node API: https://interseguro-node-api-745150536858.europe-west1.run.app
Swagger:  https://interseguro-node-api-745150536858.europe-west1.run.app/docs
OpenAPI:  https://interseguro-node-api-745150536858.europe-west1.run.app/openapi.json
```

La documentacion Swagger se sirve desde la API Node y usa las variables `GO_API_URL` y `NODE_API_URL` para mostrar los servidores disponibles en OpenAPI.

## Despliegue en Google Cloud

Este servicio fue desplegado en Google Cloud Run usando un contenedor Docker:

- `interseguro-node-api`: API Node/Express para estadisticas y documentacion Swagger/OpenAPI.

El servicio se construye como imagen Docker y se despliega de forma independiente en Cloud Run. El codigo fuente esta versionado en GitHub y Cloud Build queda conectado al repositorio para compilar la imagen y publicar una nueva revision cuando se suben cambios.

Las variables de entorno se configuran desde Cloud Run, no quedan hardcodeadas en el codigo fuente. En produccion la API Node usa:

```txt
JWT_SECRET=<configurado en Cloud Run>
GO_API_URL=https://interseguro-go-api-745150536858.europe-west1.run.app
NODE_API_URL=https://interseguro-node-api-745150536858.europe-west1.run.app
```

`PORT` no se define manualmente en Cloud Run porque la plataforma lo inyecta automaticamente en el contenedor.

## Variables de entorno

```txt
PORT
JWT_SECRET
GO_API_URL
NODE_API_URL
```

`GO_API_URL` y `NODE_API_URL` se usan para documentacion Swagger y configuracion del servicio.

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
  -e GO_API_URL=http://localhost:3000 \
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
