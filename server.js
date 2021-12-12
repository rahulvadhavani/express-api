import express from 'express';
import { APP_PORT } from './Config';
import errorHandler from './Middleware/errorHandler';
import routes from './Routes';
import connectDB from './Config/db';
import auth from './Middleware/auth';
import authorizeRoutes from './Routes/authorizeRoutes';
import adminRoutes from './Routes/adminRoutes';
import path from 'path';
import adminAuth from "./Middleware/adminAuth";

connectDB();
const app = express();
global.appRoot = path.resolve(__dirname);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/api/auth',routes);
app.use('/api',auth,authorizeRoutes);
app.use('/api/admin',[auth,adminAuth],adminRoutes);
app.use('/uploads',express.static('uploads'));
app.use(errorHandler);
app.listen(APP_PORT,()=>{
    console.log(`app is running on port ${APP_PORT}`);
});