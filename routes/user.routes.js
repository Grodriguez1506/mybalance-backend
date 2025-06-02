import { Router } from "express";
import userController from "../controllers/user.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.post("/user/refresh", userController.refresh);
router.get("/user/profile", auth, userController.profile);
router.put("/user/edit", auth, userController.edit);
router.post("/user/logout", userController.logout);

export default router;
