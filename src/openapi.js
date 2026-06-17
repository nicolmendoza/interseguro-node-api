export function createOpenApiSpec({ goApiUrl, nodeApiUrl }) {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Interseguro Technical Challenge API',
      version: '1.0.0',
      description: 'Swagger documentation for the Go/Fiber QR API and Node/Express statistics API.',
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
      { name: 'Auth', description: 'JWT token generation' },
      { name: 'Go API', description: 'QR factorization, rotation and API orchestration' },
      { name: 'Node API', description: 'Matrix statistics' },
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
        QRResponse: {
          type: 'object',
          properties: {
            q: { $ref: '#/components/schemas/Matrix' },
            r: { $ref: '#/components/schemas/Matrix' },
          },
        },
        StatsResponse: {
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
      '/auth/token': {
        post: {
          tags: ['Auth'],
          summary: 'Generate a JWT token',
          servers: [{ url: goApiUrl }],
          responses: {
            200: {
              description: 'JWT generated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                    },
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
          summary: 'Calculate QR factorization',
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
              description: 'QR factorization result',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/QRResponse' },
                },
              },
            },
            400: { description: 'Invalid matrix' },
            401: { description: 'Missing or invalid JWT' },
          },
        },
      },
      '/rotate': {
        post: {
          tags: ['Go API'],
          summary: 'Rotate a matrix clockwise',
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
              description: 'Rotated matrix',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      rotated: { $ref: '#/components/schemas/Matrix' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid matrix' },
            401: { description: 'Missing or invalid JWT' },
          },
        },
      },
      '/analyze': {
        post: {
          tags: ['Go API'],
          summary: 'Calculate QR and request statistics from Node API',
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
              description: 'QR result and statistics',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      q: { $ref: '#/components/schemas/Matrix' },
                      r: { $ref: '#/components/schemas/Matrix' },
                      stats: { $ref: '#/components/schemas/StatsResponse' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid matrix' },
            401: { description: 'Missing or invalid JWT' },
            502: { description: 'Node API unavailable' },
          },
        },
      },
      '/stats': {
        post: {
          tags: ['Node API'],
          summary: 'Calculate statistics for matrices',
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
              description: 'Matrix statistics',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/StatsResponse' },
                },
              },
            },
            400: { description: 'Invalid matrices' },
            401: { description: 'Missing or invalid JWT' },
          },
        },
      },
    },
  };
}
