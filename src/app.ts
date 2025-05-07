import express from "express";
import cors from "cors";
import corsConfig from "./config/cors.config.js";
import routes from "./routes/index.js";
import DB from "./models/index.js";

import "reflect-metadata";

import globalErrorHandler from "./middleware/globalErrorHandler.js";
import globalUaParser from "./middleware/globalUaParser.js";

import { config } from "dotenv";
config();

const port = Number(process.env.APP_PORT);
if (!port || isNaN(port)) {
  throw new Error("There is no APP_PORT in .env file");
}

const app = express();

async function main() {
  await DB.connect();

  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(globalUaParser);
  app.use("/", routes);
  app.use(globalErrorHandler);

  app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
  });
}

(async () => {
  await main();
})();
