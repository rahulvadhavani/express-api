import Mongoose from 'mongoose';
import {APP_URL} from '../Config';


const Schema = Mongoose.Schema;
const productSchema = new Schema({
    name: {type:String,required:true},
    price: {type:Number,required:true},
    size: {type:String,required:true},
    image: {type:String,required:true,get:(image) => { 
        return `${APP_URL}/${image}`; 
    }},
},{timestamps:true,toJSON:{getters:true},id:false});
 
export default Mongoose.model('Product',productSchema);