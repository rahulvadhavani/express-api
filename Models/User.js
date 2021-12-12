import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;
const userSchema = new Schema({
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    role: {type:String,default:'customer'},
},{timestamps:true});
 
export default Mongoose.model('User',userSchema);