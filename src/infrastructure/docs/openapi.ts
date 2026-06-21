type OpenApiSpecOptions = {
  goApiUrl: string;
  nodeApiUrl: string;
};

export function createOpenApiSpec({ goApiUrl, nodeApiUrl }: OpenApiSpecOptions) {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Interseguro Technical Challenge API',
      version: '1.0.0',
      description: 'Documentacion Swagger para la API Go/Fiber de QR y la API Node/Express de estadisticas.',
    },
    servers: [
      {
        url: goApiUrl,
        description: 'Go API',
      },
      {
        url: nodeApiUrl,
        description: 'Node API',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Generacion de tokens JWT' },
      { name: 'Go API', description: 'Factorizacion QR, rotacion y orquestacion entre APIs' },
      { name: 'Node API', description: 'Estadisticas de matrices' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Matrix: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'number' },
          },
          example: [
            [12, -51, 4],
            [6, 167, -68],
            [-4, 24, -41],
          ],
        },
        MatrixRequest: {
          type: 'object',
          required: ['matrix'],
          properties: {
            matrix: { $ref: '#/components/schemas/Matrix' },
          },
        },
        MatricesRequest: {
          type: 'object',
          required: ['matrices'],
          properties: {
            matrices: {
              type: 'array',
              items: { $ref: '#/components/schemas/Matrix' },
            },
          },
        },
        QRResult: {
          type: 'object',
          properties: {
            q: { $ref: '#/components/schemas/Matrix' },
            r: { $ref: '#/components/schemas/Matrix' },
          },
        },
        RotationResult: {
          type: 'object',
          properties: {
            rotated: { $ref: '#/components/schemas/Matrix' },
          },
        },
        MatrixStats: {
          type: 'object',
          properties: {
            max: { type: 'number' },
            min: { type: 'number' },
            average: { type: 'number' },
            sum: { type: 'number' },
            diagonalMatrices: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  index: { type: 'integer' },
                  isDiagonal: { type: 'boolean' },
                },
              },
            },
            hasDiagonalMatrix: { type: 'boolean' },
          },
        },
        AnalyzeResult: {
          type: 'object',
          properties: {
            q: { $ref: '#/components/schemas/Matrix' },
            r: { $ref: '#/components/schemas/Matrix' },
            stats: { $ref: '#/components/schemas/MatrixStats' },
          },
        },
        TokenResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/auth/token': {
        post: {
          tags: ['Auth'],
          summary: 'Generar un token JWT',
          servers: [{ url: goApiUrl }],
          responses: {
            200: {
              description: 'JWT generado correctamente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TokenResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/qr': {
        post: {
          tags: ['Go API'],
          summary: 'Calcular factorizacion QR',
          servers: [{ url: goApiUrl }],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MatrixRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Resultado de la factorización QR',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/QRResult' },
                },
              },
            },
            400: { description: 'Matriz invalida' },
            401: { description: 'JWT faltante o invalido' },
          },
        },
      },
      '/rotate': {
        post: {
          tags: ['Go API'],
          summary: 'Rotar una matriz en sentido horario',
          servers: [{ url: goApiUrl }],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MatrixRequest' },
                example: {
                  matrix: [
                    [1, 2, 3],
                    [4, 5, 6],
                  ],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Matriz rotada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RotationResult',
                  },
                },
              },
            },
            400: { description: 'Matriz invalida' },
            401: { description: 'JWT faltante o invalido' },
          },
        },
      },
      '/analyze': {
        post: {
          tags: ['Go API'],
          summary: 'Calcular QR y solicitar estadisticas a la API Node',
          servers: [{ url: goApiUrl }],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MatrixRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Resultado QR y estadisticas',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AnalyzeResult',
                  },
                },
              },
            },
            400: { description: 'Matriz invalida' },
            401: { description: 'JWT faltante o invalido' },
            502: { description: 'API Node no disponible' },
          },
        },
      },
      '/stats': {
        post: {
          tags: ['Node API'],
          summary: 'Calcular estadisticas de matrices',
          servers: [{ url: nodeApiUrl }],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MatricesRequest' },
                example: {
                  matrices: [
                    [
                      [1, 0],
                      [0, 1],
                    ],
                    [
                      [2, 3],
                      [0, 4],
                    ],
                  ],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Estadisticas de matrices',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/MatrixStats' },
                },
              },
            },
            400: { description: 'Matrices invalidas' },
            401: { description: 'JWT faltante o invalido' },
          },
        },
      },
    },
  };
}
