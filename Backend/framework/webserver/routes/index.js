import authRouter from "./auth.routes.js";

export default function routes(app, express) {
  app.use("/api/v1/login", authRouter(express));
}
