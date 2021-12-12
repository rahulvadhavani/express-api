class CustomErrorHandler extends Error{

    constructor(status,msg){
        super();
        this.status = status;
        this.message = msg;
    }
    static alreadyExist(message){
        return new CustomErrorHandler(409,message);
    }
    static wrongCredential(message="Username or password is incorrect."){
        return new CustomErrorHandler(401,message);
    }
    static unAuthorize(message="Unauthorize"){
        return new CustomErrorHandler(401,message);
    }

    static tokenEXpired(message="Token expired"){
        return new CustomErrorHandler(401,message);
    }
    static notFound(message="Not found"){
        return new CustomErrorHandler(401,message);
    }
    static serverError(message="server Error"){
        return new CustomErrorHandler(401,message);
    }
}

export default CustomErrorHandler;