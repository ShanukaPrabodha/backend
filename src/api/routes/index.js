import { Router } from "express";
import controller from "../controllers";

const router = Router();

router.get("/", (req, res) => {
	res.send("Login API");
});

// User Routes
router.post("/user/login", controller.loginUser);
router.post("/user/register", controller.registerUser);

export default router;
