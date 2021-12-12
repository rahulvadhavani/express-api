import { DB_URL } from './index';
import Mongoose from 'mongoose';
import errorHandler from '../Middleware/errorHandler';

function connectDB(){
    Mongoose.connect(DB_URL, function(err, db) {
        if (err) {
            console.log('Unable to connect to the server. Please start the server. Error:', err);
            throw errorHandler(err);
        } else {
            console.log('db Connected to Server successfully!');
        }
    });
}

export default connectDB;