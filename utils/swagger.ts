import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  info: {
    // API informations (required)
    title: 'Auth Service', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Server API' // Description (optional)
  },
  host: 'localhost:3000', // Host (optional)
  basePath: '/' // Base path (optional)
};

const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: ['../routes/api', '../routes/auth']
};

export const swaggerSpec = swaggerJSDoc(options);
