import CustomErrorHandler from "../Services/CustomErrorHndler";
import {User} from "../Models";

const adminAuth = async (req,res,next) =>{
    try {
        const user = await User.findOne({_id:req.user._id});
        if(user.role === 'admin'){
            next();
        }else{
            next(CustomErrorHandler.unAuthorize());
        }
    } catch (error) {
        return next(CustomErrorHandler.serverError());
    }
}

export default adminAuth;