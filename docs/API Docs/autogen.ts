import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "API Documentation",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["../../backend/src/index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);