const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Soul Sync API Documentation',
      version: '2.4.0',
      description: 'Interactive OpenAPI specification for Soul Sync — The next-generation Liquid Glass social web application with Supabase integration.',
      contact: {
        name: 'Soul Sync Engineering',
        url: 'https://soulsync.io'
      }
    },
    servers: [
      {
        url: 'http://localhost:5005',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar { background-color: #060818; border-bottom: 2px solid #8b5cf6; }
      body { background-color: #0a0d27; color: #ffffff; }
      .swagger-ui { filter: invert(88%) hue-rotate(180deg); }
      .swagger-ui .topbar img { display: none; }
    `,
    customSiteTitle: 'Soul Sync API Docs (Swagger)'
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = {
  setupSwagger,
  swaggerSpec
};
