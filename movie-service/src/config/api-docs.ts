const { AUTH_SVC_PORT, AUTH_SVC_HOST } = process.env;
const authPort = AUTH_SVC_PORT || 3000;
const authHost = `http://${(AUTH_SVC_HOST || '0.0.0.0')}:${authPort}`;

const swagger = {
  openapi: '3.0.0',
  info: {
    description: 'This is a simple API',
    version: '1.0.0-oas3',
    title: 'Simple Movie API',
    contact: {
      email: 'w.s.f.antonshevchuk@gmail.com'
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  tags: [
    {
      name: 'Movie',
      description: 'Operations to fetch and add movie'
    }
  ],
  paths: {
    '/api/v0/movies': {
      get: {
        tags: [
          'Movie'
        ],
        summary: 'Fetches user movies',
        security: [
          {
            ApiKeyAuth: []
          }
        ],
        description: 'By passing in the appropriate options, you can get user movies\n',
        responses: {
          200: {
            description: 'user movies'
          },
          401: {
            description: 'user is not authorized'
          },
          500: {
            description: 'internal server error'
          }
        }
      },
      post: {
        tags: [
          'Movie'
        ],
        summary: 'adds movie',
        description: 'Adds an movie to user movie list',
        security: [
          {
            ApiKeyAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/MovieAdding'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'movie created'
          },
          400: {
            description: 'invalid input, object invalid'
          },
          401: {
            description: 'user is not authorized'
          },
          404: {
            description: 'movie was not found'
          },
          409: {
            description: 'an existing item already exists'
          },
          500: {
            description: 'internal server error'
          }
        }
      }
    },
    '/auth': {
      servers: [
        {
          url: authHost,
          description: 'Auth API'
        }
      ],
      post: {
        tags: [
          'Auth'
        ],
        summary: 'Authenticates user',
        description: 'User authentication',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/AuthData'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'user authenticated'
          },
          400: {
            description: 'invalid payload'
          },
          401: {
            description: 'bad credentials'
          }
        }
      }
    }
  },
  definitions: {
    Movie: {
      type: 'object',
      required: [
        'title'
      ],
      properties: {
        _id: {
          type: 'string',
          format: 'ObjectId',
          example: '60e27d909f3c9b0011647db2'
        },
        title: {
          type: 'string',
          example: 'Interstellar'
        },
        genre: {
          type: 'string',
          example: 'Adventure, Drama, Sci-Fi'
        },
        director: {
          type: 'string',
          example: 'hristopher Nolan'
        },
        release: {
          type: 'string',
          format: 'date-time',
          example: 'Fri Nov 07 2014 00:00:00 GMT+0000 (Coordinated Universal Time)'
        }
      }
    },
    MovieAdding: {
      type: 'object',
      required: [
        'title'
      ],
      properties: {
        title: {
          type: 'string',
          example: 'Interstellar'
        }
      }
    },
    AuthData: {
      type: 'object',
      required: [
        'username',
        'password'
      ],
      properties: {
        username: {
          type: 'string',
          example: 'thomas'
        },
        password: {
          type: 'string',
          example: 'thomas123'
        }
      }
    }
  },
  schemes: [
    'http'
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    }
  }
};

export default swagger;
