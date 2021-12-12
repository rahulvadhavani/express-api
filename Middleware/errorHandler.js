import {ValidationError} from 'joi';
import {DEBUG_MODE} from '../Config';
import CustomErrorHandler from '../Services/CustomErrorHndler';

const errorHandler = (error,req,res,next) => {
    let statusCode = 500;
    let data = {
        status:false,
        status_code:500,
        message:'Internal server error.',
        ...(DEBUG_MODE == 'true' && {originalError:error.message})
    }

    if(error instanceof ValidationError){
        statusCode = 422,
        data ={
            status:false,
            status_code:422,
            message:error.message,
        }
    }
    
    if(error instanceof CustomErrorHandler){
        statusCode = error.status,
        data ={
            status:false,
            status_code:error.status,
            message:error.message,
        }
    }

    return res.status(statusCode).json(data);
}

export default errorHandler;