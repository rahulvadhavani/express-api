import express from "express";
import productController from "../Controllers/productController";


const adminRoutes = express.Router();

adminRoutes.post('/product',productController.store);
adminRoutes.put('/product/:id',productController.update);
adminRoutes.delete('/product/:id',productController.destroy);
adminRoutes.get('/product',productController.index);
adminRoutes.get('/product/:id',productController.show);

export default adminRoutes;