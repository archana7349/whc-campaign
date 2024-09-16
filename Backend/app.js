import express from "express";
import mongoose from "mongoose";
import xconf from "#xconf";
import expressConfig from "./framework/webserver/express.js";
import routes from "./framework/webserver/routes/index.js";
import mongoDbConnection from "./framework/database/mongodb/connection.js";
import errorHandlingMiddleware from "./framework/webserver/middleware/error.handler.js";

const app = express();

expressConfig(app);

mongoDbConnection(mongoose, xconf, {
  autoIndex: false,
  connectTimeoutMS: 1000,
}).connectToMongo();

routes(app, express);

app.use(errorHandlingMiddleware);

app.listen(xconf.port, () => {
  console.log("Server Started!", xconf.port);
});

export default app;
