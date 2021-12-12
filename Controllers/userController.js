
import {RefreshToken, User} from '../Models';
import CustomErrorHandler from "../Services/CustomErrorHndler";

const userController = {

    async getProfile (req,res,next) {
        try {
            const user  = await User.findOne({_id:req.user._id}).select('-password -updatedAt -__v');
            if(!user){
                return next (CustomErrorHandler.tokenEXpired());
            }
            console.log(user);
            return res.status(200).json({status:true,message:"success",data:user});   
            
        } catch (error) {
            return next(error);
        }
    },

    async updateProfile (req,res,next) {
        try {
            const user  = await User.updateOne({_id:req.user._id}, {$set:{name:req.body.name}});
            console.log(user);
            if(!user){
                return next (CustomErrorHandler.tokenEXpired());
            }
            return res.status(200).json({status:true,message:"success",data:user});   
            
        } catch (error) {
            return next(error);
        }
    },

    async logout (req,res,next) {
        try {
            const refreshToken  = await RefreshToken.deleteOne({token:req.body.refresh_token});
        } catch (error) {
            return next(error);
        }
        return res.status(200).json({status:true,message:"user logout successfully."});   
    },
}
export default userController;