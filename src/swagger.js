const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Schedule API",
      version: "1.0.0",
      description: "Express + Prisma + PostgreSQL API dokumentatsiyasi",
    },
    servers: [
      { url: "https://time-table-backend-4o64.onrender.com", description: "Render server" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"], // agar routes ichida yozsang
};

module.exports = swaggerJSDoc(options);