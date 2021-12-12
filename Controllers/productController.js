
import {RefreshToken, Product} from '../Models';
import CustomErrorHandler from "../Services/CustomErrorHndler";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import productSchema from "../RequestValidator/productValidate";

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,'uploads/'),
    filename: (req, file, cb)=>{
        const uniqueName = `${Date.now()}-${Math.random(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

let handleFile = multer({storage: storage,limits:{fileSize:1000000*100}}).single('image');

const productController = {
    
    async store (req,res,next) {

        handleFile(req, res, async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;
            const {error} = productSchema.validate(req.body);
            if(error){
                fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    return next(CustomErrorHandler.serverError());
                });
                return next(error);
            }
            const {name,price,size} = req.body;
            let product;
            try {
                product = await Product.create({
                    name,price,size,
                    image:filePath
                });
            } catch (error) {
                return next(error);
            }
            return res.status(200).json({status:true,message:"product stored successfully.",data:product});   
        });
    },

    async update (req,res,next) {

        handleFile(req, res, async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if(req.file){
                filePath = req.file.path;
            }
            const {error} = productSchema.validate(req.body);
            if(error){
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                        return next(CustomErrorHandler.serverError());
                    });
                }
                return next(error);
            }
            const {name,price,size} = req.body;
            let product;
            try {
                product = await Product.findOneAndUpdate({_id:req.params.id},{
                    name,price,size,
                    ...(req.file && {image:filePath})
                },{new:true});
            } catch (error) {
                return next(error);
            }
            return res.status(200).json({status:true,message:"product updated successfully.",data:product});   
        });
    },

    async destroy (req,res,next) {
        try {
            const product = await Product.findOneAndRemove({_id:req.params.id});
            if(!product){
                next(CustomErrorHandler.notFound('Product not found.'));
            }
            const imagePath = product._doc.image; // get image orginal attribute 
            await fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
                next(CustomErrorHandler.serverError());
            });
            return res.status(200).json({status:true,message:"product deleted successfully."});   
        } catch (error) {
            return next(error);  
        }

    },

    async index (req,res,next) {
        try {
            let page = 1;
            let itemsPerPage = 5;
            if(req.query.page){
                page = req.query.page;
            }
            let skipRec = (page - 1) * itemsPerPage;
            const products = await Product.find().select('-updatedAt -__v').skip(skipRec).limit(itemsPerPage).sort({_id:-1});
            const totalRecords = await Product.countDocuments();
            let pageData = {totalPage:Math.ceil(totalRecords/itemsPerPage),totalRecords};
            return res.status(200).json({status:true,message:"products get successfully.",data:products,page:pageData}); 
        } catch (error) {
            return next(error);  
        }  
    },

    async show (req,res,next) {
        try {
            const product = await Product.findById({_id:req.params.id});
            if(!product){
                next(CustomErrorHandler.notFound('Product not found'));
            }
            return res.status(200).json({status:true,message:"products get successfully.",data:product}); 
        } catch (error) {
            console.log(error);
            return next(error);  
        }  
    },

}

export default productController;