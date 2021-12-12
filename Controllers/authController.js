import Joi from "joi";
import {User} from '../Models';
import CustomErrorHandler from "../Services/CustomErrorHndler";
import bcrypt from 'bcrypt';
import JwtService from '../Services/JwtService';
import {REFRESH_SECRET} from '../Config';
import {RefreshToken} from '../Models';

const authController = {

    async Register (req,res,next) {
        
        const registerSchema = Joi.object({
            name:Joi.string().min(3).max(30).required(),
            email:Joi.string().email({tlds:{allow:false}}).required(),
            password:Joi.string().min(3).required(),
            confirm_password:Joi.ref('password'),
        });
        const {error} = registerSchema.validate(req.body);
        if(error){
            return next(error);
        }
        let access_token;
        let refresh_token;
        try {
            const userExist  = await User.exists({email:req.body.email});
            if(userExist){
                return next (CustomErrorHandler.alreadyExist('this email is already exist'));
            }
            const hashedPassword = await bcrypt.hash(req.body.password,10); 
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            });
            try {
                const response = await user.save();
                access_token =  JwtService.sign({_id:response._id,role:response.role});
                refresh_token =  JwtService.sign({_id:response._id,role:response.role},'1y',REFRESH_SECRET);
                await RefreshToken.create({token:refresh_token});
                
            } catch (error) {
                return next(error);
            }
            return res.status(200).json({status:true,message:"Registered successfully.",data:{access_token,refresh_token}});   
            
        } catch (error) {
            return next(error);
        }
    },

    async Login(req,res,next) {
        const loginSchema = Joi.object({
            email:Joi.string().email({tlds:{allow:false}}).required(),
            password:Joi.string().min(3).required(),
        });
        const {error} = loginSchema.validate(req.body);
        if(error){
            return next(error);
        }
        let access_token;
        let refresh_token;
        let user;
        try {
            user  = await User.findOne({email:req.body.email}).select('-updatedAt -__v');
            if(!user){
                return next(CustomErrorHandler.wrongCredential());  
            }
            const checkPassword = await bcrypt.compare(req.body.password, user.password);            
            if(!checkPassword){
                return next(CustomErrorHandler.wrongCredential());  
            }
            access_token =  JwtService.sign({_id:user._id,role:user.role});
            refresh_token =  JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET);
            await RefreshToken.create({token:refresh_token});
            
        } catch (error) {
            return next(error);
        }
        user = {_id:user._id,name:user.name,email:user.email,role:user.role,createdAt:user.createdAt};
        return res.status(200).json({
            status:true,
            message:"success",
            data:{access_token,refresh_token,user:user}
        });   
    },

    async RefreshToken(req,res,next){
        const refreshSchema = Joi.object({
            refresh_token:Joi.string().required(),
        });
        const {error} = refreshSchema.validate(req.body);
        if(error){
            return next(error);
        }
        let access_token;
        let refresh_token;
        try {
            const refreshToken = await RefreshToken.findOne({token:req.body.refresh_token});
            console.log(refreshToken);
            if(!refreshToken){
                return next(CustomErrorHandler.tokenEXpired());
            }
            const userId = await JwtService.verify(req.body.refresh_token,REFRESH_SECRET); 
            const user = await User.findOne({_id:userId});
            if(!user){
                return next(CustomErrorHandler.notFound('User not found.'));
            }
            access_token = JwtService.sign({_id:user._id,role:user.role});
            refresh_token = req.body.refresh_token;
        } catch (error) {
            console.log(error);
            return next(error);
        }
        return res.status(200).json({
            status:true,
            message:"success",
            data:{access_token,refresh_token}
        });   
    }

}
export default authController