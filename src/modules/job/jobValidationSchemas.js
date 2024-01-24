import Joi from 'joi'
import { generalRules } from '../../utils/generalValidationRules.js'
import jobLocations from '../../utils/jobLocations.js'
import workingTimes from '../../utils/workingTimes.js'
import seniorityLevels from '../../utils/seniorityLevels.js'

export const addJobSchema = {
    body:Joi.object({
        jobTitle: generalRules.anyStringRequired,
        jobLocation: generalRules.anyStringRequired.valid(jobLocations.HYBRID,jobLocations.ONSITE,jobLocations.REMOTELY)
        .insensitive(),
        workingTime: generalRules.anyStringRequired.valid(workingTimes.FULL_TIME , workingTimes.PART_TIME).insensitive(),
        seniorityLevel: generalRules.anyStringRequired
        .valid(seniorityLevels.TEAM_LEAD,seniorityLevels.SENIOR,seniorityLevels.MID_LEVEL,seniorityLevels.JUNIOR,seniorityLevels.CTO)
        .insensitive(),
        technicalSkills: Joi.array().required(),
        softSkills: Joi.array().required()
    }),
    headers: generalRules.headersHiddenWithToken,
    params: Joi.object({
        companyId:generalRules.dbId
    })
}

export const updateJobSchema = {
    body:Joi.object({
        jobTitle: generalRules.anyString,
        jobLocation: generalRules.anyString.valid(jobLocations.HYBRID,jobLocations.ONSITE,jobLocations.REMOTELY)
        .insensitive(),
        workingTime: generalRules.anyString.valid(workingTimes.FULL_TIME , workingTimes.PART_TIME).insensitive(),
        seniorityLevel: generalRules.anyString
        .valid(seniorityLevels.TEAM_LEAD,seniorityLevels.SENIOR,seniorityLevels.MID_LEVEL,seniorityLevels.JUNIOR,seniorityLevels.CTO)
        .insensitive(),
        technicalSkills: Joi.array(),
        softSkills: Joi.array()
    }),
    headers: generalRules.headersHiddenWithToken,
    params: Joi.object({
        jobId: generalRules.dbId.required(),
        companyId:generalRules.dbId
    })
}

export const deleteJobSchema = {
    headers: generalRules.headersHiddenWithToken,
    params: Joi.object({
        jobId: generalRules.dbId.required(),
        companyId:generalRules.dbId
    })
}

export const getAllJobsWithCompanyInfoSchema = {
    headers: generalRules.headersHiddenWithToken,
}

export const getAllJobsForSpecificCompanySchema = {
    query: Joi.object({
        companyName: generalRules.anyStringRequired,
    }),
    headers: generalRules.headersHiddenWithToken,
}

export const filterJobsSchema = {
    query: Joi.object({
        workingTime: generalRules.anyString.valid(workingTimes.FULL_TIME , workingTimes.PART_TIME).insensitive(),
        seniorityLevel: generalRules.anyString
        .valid(seniorityLevels.TEAM_LEAD,seniorityLevels.SENIOR,seniorityLevels.MID_LEVEL,seniorityLevels.JUNIOR,seniorityLevels.CTO)
        .insensitive(),
        jobLocation: generalRules.anyString.valid(jobLocations.HYBRID,jobLocations.ONSITE,jobLocations.REMOTELY)
        .insensitive(),
        jobTitle: generalRules.anyString,
        technicalSkills: generalRules.anyString
    }),
    headers: generalRules.headersHiddenWithToken,
}

export const applyJobSchema = {
    body: Joi.object({
        userTechSkills : Joi.array(),
        userSoftSkills : Joi.array(),
        Resume: Joi.boolean().valid(true)
    }),
    params:Joi.object({
        jobId: generalRules.dbId.required()
    }),
    headers: generalRules.headersHiddenWithToken,
}