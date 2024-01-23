import Joi from "joi";
import { generalRules } from "../../utils/generalValidationRules.js";

export const signUpSchema = {
    body: Joi.object({
        email: generalRules.anyStringRequired.email(),
        lastName: generalRules.anyStringRequired,
        firstName: generalRules.anyStringRequired,
        password: generalRules.anyStringRequired.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        recoveryEmail: generalRules.anyStringRequired.email(),
        DOB: generalRules.anyStringRequired,
        mobileNumber: generalRules.anyNumber.required(),
        role:generalRules.anyString
    }),
    headers: generalRules.headersHidden
}

export const loginSchema = {
    body: Joi.object({
        email: generalRules.anyString.email(),
        mobileNumber: generalRules.anyNumber,
        recoveryEmail: generalRules.anyString.email(),
        password: generalRules.anyStringRequired.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    }),
    headers: generalRules.headersHidden,
}

export const deleteAccountSchema = {
    params: Joi.object({
        accountId:generalRules.dbId.required()
    }),
    headers: generalRules.headersHiddenWithToken,
}

export const updateAccountSchema = {
    body: Joi.object({
        email : generalRules.anyString.email(),
        mobileNumber :generalRules.anyNumber, 
        recoveryEmail :generalRules.anyString.email(), 
        DOB :generalRules.anyString, 
        lastName :generalRules.anyString, 
        firstName: generalRules.anyString
    }),
    params: Joi.object({
        accountId:generalRules.dbId.required()
    }),
    headers: generalRules.headersHiddenWithToken,
}

export const accountDataSchema = {
    params: Joi.object({
        accountId:generalRules.dbId.required()
    }),
    headers: generalRules.headersHiddenWithToken,
}

export const updatePasswordSchema = {
    body: Joi.object({
        oldPassword:generalRules.anyStringRequired,
        newPassword:generalRules.anyStringRequired,
        rePass: Joi.ref('newPassword')
    }).with('newPassword' , 'rePass'),
    headers: generalRules.headersHiddenWithToken,
}

export const recoveryEmailSchema = {
    query: Joi.object({
        recoveryEmail:generalRules.anyStringRequired.email()
    }),
    headers: generalRules.headersHiddenWithToken,
}

export const sendOTPSchema = {
    body:Joi.object({
        email:generalRules.anyStringRequired.email()
    }),
    headers: generalRules.headersHidden,
}

export const setPasswordAfterSendingOTPSchema = {
    body:Joi.object({
        email:generalRules.anyStringRequired.email(),
        OTP:generalRules.anyNumber.required(),
        newPassword:generalRules.anyStringRequired,
        rePass:Joi.ref('newPassword')
    }).with('newPassword','rePass'),
    headers: generalRules.headersHidden,
}