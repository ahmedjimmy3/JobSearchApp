import Joi from "joi";
import { generalRules } from "../../utils/generalValidationRules.js";

export const addCompanySchema = {
    body: Joi.object({
        companyName: generalRules.anyStringRequired,
        description: generalRules.anyStringRequired,
        industry: generalRules.anyStringRequired,
        address: generalRules.anyStringRequired,
        numberOfEmployeeFrom: generalRules.anyNumber.required(),
        numberOfEmployeeTo: generalRules.anyNumber.required(),
        companyEmail: generalRules.anyStringRequired.email(),
    }),
    headers: generalRules.headersHiddenWithToken,
}

export const updateCompanySchema = {
    body: Joi.object({
        companyName: generalRules.anyString,
        description: generalRules.anyString,
        industry: generalRules.anyString,
        address: generalRules.anyString,
        numberOfEmployeeFrom: generalRules.anyNumber,
        numberOfEmployeeTo: generalRules.anyNumber,
        companyEmail: generalRules.anyString.email(),
    }),
    headers: generalRules.headersHiddenWithToken,
    params: Joi.object({
        companyId: generalRules.dbId.required()
    })
}

export const deleteAndGetCompanySchema = {
    params: Joi.object({
        companyId: generalRules.dbId.required()
    }),
    headers: generalRules.headersHiddenWithToken,
}

export const searchCompanyWithName = {
    query: Joi.object({
        companyName: generalRules.anyStringRequired
    }),
    headers: generalRules.headersHiddenWithToken
}

export const getAllApplicationForJob = {
    params:Joi.object({
        companyId: generalRules.dbId.required(),
        jobId: generalRules.dbId.required()
    }),
    headers: generalRules.headersHiddenWithToken
}

export const excelSheet = {
    body: Joi.object({
        day: generalRules.anyStringRequired,
    }),
    params:Joi.object({
        companyId:generalRules.dbId.required(),
    }),
}