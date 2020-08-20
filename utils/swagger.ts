import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerDefinition = {
  info: {
    // API informations (required)
    title: 'Kapoera Server', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Server API' // Description (optional)
  },
  schemes: ['http', 'https'],
  host: 'aria.sparcs.org:32960', // Host (optional)
  basePath: '/' // Base path (optional)
};

const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: [path.resolve('./routes/api.ts'), path.resolve('./routes/auth.ts')]
};

console.log(path.resolve('./routes/api.ts'));
export const swaggerSpec = swaggerJSDoc(options);
