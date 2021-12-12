import express from "express";
import userController from "../Controllers/userController";

const authorizeRoutes = express.Router();

authorizeRoutes.get('/user/get-profile',userController.getProfile);
authorizeRoutes.post('/user/update-profile',userController.updateProfile);
authorizeRoutes.post('/user/logout',userController.logout);

export default authorizeRoutes;