import { Router } from "express";
import { signup } from "../controllers/auth.controller.js";
import { Login } from "../controllers/auth.controller.js";
import { googleLogin } from "../controllers/auth.controller.js";
const router = Router();

router.post('/signup',signup);
router.post('/login',Login);
router.post("/google", googleLogin);

export default router ;