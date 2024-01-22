import { Types } from "mongoose";
import Joi from "joi";

const objectIdValidation = (value,helper)=>{
    const isValid = Types.ObjectId.isValid(value)
    return (isValid ? value : helper.message('ObjectId format is not valid'))
}

export const generalRules = {
    dbId: Joi.string().custom(objectIdValidation),
    anyStringRequired:Joi.string().required(),
    anyString:Joi.string(),
    anyNumber:Joi.number().integer(),
    headersHidden: Joi.object({
        'user-agent': Joi.string(),
        accept: Joi.string(),
        'cache-control': Joi.string(),
        'postman-token':Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'content-type':Joi.string(),
        'content-length':Joi.string(),
    }),
    headersHiddenWithToken: Joi.object({
        token: Joi.string().required(),
        'user-agent': Joi.string(),
        accept: Joi.string(),
        'cache-control': Joi.string(),
        'postman-token':Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'content-type':Joi.string(),
        'content-length':Joi.string(),
    })
}