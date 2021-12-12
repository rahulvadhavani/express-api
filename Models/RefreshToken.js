import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;
const refreshTokenSchema = new Schema({
    token: {type:String,unique:true},
},{timestamps:false});
 
export default Mongoose.model('RefreshToken',refreshTokenSchema);