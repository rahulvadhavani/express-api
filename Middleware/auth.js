import CustomErrorHandler from "../Services/CustomErrorHndler";
import JwtService from "../Services/JwtService";

const auth = async (req,res,next) =>{
    let authHeader = req.headers.authorization;
    
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorize());
    }
    const token = authHeader.split(' ')[1];
    
    try {
        const {_id,role} = await JwtService.verify(token);
        const user ={
            _id,
            role
        }
        req.user = user;
        next();
    } catch (error) {
        return next(CustomErrorHandler.unAuthorize());
        
    }
}

export default auth;