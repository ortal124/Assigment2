import express from "express";
import authController from "../controller/authController";

const router = express.Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;