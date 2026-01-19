import { Router } from "express";
import { signup } from "../controllers/auth.controller.js";
import { Login } from "../controllers/auth.controller.js";
import { googleLogin } from "../controllers/auth.controller.js";
import { refreshTokenController } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";

const router = Router();

router.post('/signup',signup);
router.post('/login',Login);
router.post("/google", googleLogin);
router.post("/refresh",refreshTokenController);
router.post("/logout", logout);


export default router ;