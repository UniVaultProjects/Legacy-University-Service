import { Request, Response } from 'express';
import { HttpResponse } from '../types/types';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';

export default (req : Request , res : Response , responseCode : number , responseMessage : string , data : unknown = null ) : void =>{
    const response : HttpResponse  = {
        success : true , 
        statusCode : responseCode , 
        request : {
            ip : req.ip || null , 
            method : req.method,
            url : req.originalUrl
        },
        message : responseMessage , 
        data: data
    }

    console.info(`CONTROLLER_RESPONSE `,{
        meta : response 
    })
    
    if(config.ENV == EApplicationEnvironment.PRODUCTION){
        delete response.request.ip
    }
    res.status(responseCode).json(response)
}