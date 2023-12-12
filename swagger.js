const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'A simple API with Swagger documentation',
    },
  },
  apis: ['./apiProducts/Controllers/productController.js','./apiProducts/Controllers/stockController.js'], // Point to the file that contains your route definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
