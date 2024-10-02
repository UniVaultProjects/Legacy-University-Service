import { Request } from 'express';
import { HttpError } from '../types/types';
import responseMessage from '../constant/responseMessage';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err : Error | unknown , req : Request , errorStatusCode : number  = 500) : HttpError =>{
    const errorObj : HttpError = {
        success : false , 
        statusCode : errorStatusCode , 
        request : {
            ip : req.ip , 
            method : req.method , 
            url : req.originalUrl
        },
        message : err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG , 
        data : null ,
        trace : err instanceof Error ? {err : err.stack} : null

    }

    console.info(`CONTROLLER_ERROR`,{
        meta : errorObj
    })
    
    if(config.ENV == EApplicationEnvironment.PRODUCTION){
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj
}