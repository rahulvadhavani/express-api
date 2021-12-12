import express from "express";
import authController from "../Controllers/authController";
import auth from '../Middleware/auth';

const router = express.Router();

router.post('/register',authController.Register);
router.post('/login',authController.Login);
router.post('/refresh',authController.RefreshToken);



export default router;