type OpenApiSpecOptions = {
  nodeApiUrl: string;
};

export function createOpenApiSpec({ nodeApiUrl }: OpenApiSpecOptions) {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Interseguro Node API',
      version: '1.0.0',
      description: 'Documentacion Swagger para la API Node/Express de estadisticas de matrices.',
    },
    servers: [
      {
        url: nodeApiUrl,
        description: 'Node API',
      },
    ],
    tags: [
      { name: 'Health', description: 'Estado del servicio' },
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
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Consultar estado del servicio',
          responses: {
            200: { description: 'Servicio disponible' },
          },
        },
      },
      '/stats': {
        post: {
          tags: ['Node API'],
          summary: 'Calcular estadisticas de matrices',
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
