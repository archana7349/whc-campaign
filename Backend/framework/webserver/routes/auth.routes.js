import authController from "../../../adapters/controller/auth.controller.js";
import userDbRepository from "../../../application/repositories/user.db.repository.js";
import userDbRepositoryMongoDB from "../../../framework/database/mongodb/repositories/user.mongo.repository.js";
import authServiceInterface from "../../../application/services/auth.service.js";
import authServiceImpl from "../../services/auth.service.js";

export default function authRouter(express) {
  const router = express.Router();
  const controller = authController(
    userDbRepository,
    userDbRepositoryMongoDB,
    authServiceInterface,
    authServiceImpl
  );
  router.route("/").post(controller.loginUser);
  return router;
}
