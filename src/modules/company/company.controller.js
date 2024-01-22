import CompanyModel from "../../../db/models/company.model.js"
import ApplicationModel from '../../../db/models/application.model.js'
import JobModel from '../../../db/models/job.model.js'
import moment from "moment"
import excel from 'exceljs'
import generateUniqueString from "../../utils/generateUniqueString.js"

export const addCompany = async(req,res,next)=>{
    // get data
    const {_id} = req.authUser
    const {companyEmail,numberOfEmployee,address,industry,description,companyName} = req.body
    // check if one of the required data not entered
    if(!companyEmail||!numberOfEmployee||!address||!industry||!description||!companyName){
        return next(new Error('All fields are required',{cause:400}))
    }
    // check companyName and companyEmail is not assigned before
    const checkDuplicateCompanyName = await CompanyModel.findOne({companyName})
    if(checkDuplicateCompanyName){
        return next(new Error('This company name is used before',{cause:409}))
    }
    const checkDuplicateCompanyEmail = await CompanyModel.findOne({companyEmail})
    if(checkDuplicateCompanyEmail){
        return next(new Error('This company email is used before',{cause:409}))
    }
    // create new company
    const newCompany = await CompanyModel.create(
        {companyEmail,numberOfEmployee,address,industry,description,companyName,companyHR:_id}
    )
    if(!newCompany){
        return next(new Error('Failed to add company',{cause:400}))
    }
    // send response
    res.status(201).json({message:'Company added done' , Data:newCompany})
}

export const updateCompany = async(req,res,next)=>{
    const {companyId} = req.params
    const {companyName,description,companyEmail,industry,address,numberOfEmployee} = req.body
    // check valid companyEmail
    if(companyEmail){
        const notValidCompanyEmail = await CompanyModel.findOne({companyEmail})
        if(notValidCompanyEmail){
            return next(new Error('Invalid company email',{cause:409}))
        }
    }
    // check valid companyName
    if(companyName){
        const notValidCompanyName = await CompanyModel.findOne({companyName})
        if(notValidCompanyName){
            return next(new Error('Invalid company name',{cause:409}))
        }
    }
    // update company data
    const updateData = await CompanyModel.findByIdAndUpdate(companyId ,
        {companyName,description,companyEmail,industry,address,numberOfEmployee},
        {new: true}
    )
    if(!updateData){
        return next(new Error('Update failed',{cause:400}))
    }
    // send response
    res.status(200).json({message:'Update done', updateData})
}

export const deleteCompany = async(req,res,next)=>{
    const {companyId} = req.params
    // find company and delete
    const companyDeleted = await CompanyModel.findByIdAndDelete(companyId)
    if(!companyDeleted){
        return next(new Error('Deletion failed',{cause:400}))
    }
    // send response
    res.status(200).json({message:'Company deleted successfully'})
}

export const getCompanyData = async(req,res,next)=>{
    const {companyId} = req.params
    // check the company found or not
    const foundCompany = await CompanyModel.findById(companyId)
    .select( '-_id companyName description industry address numberOfEmployee companyEmail')
    if(!foundCompany){
        return next(new Error('This company not found',{cause:404}))
    }
    // send response
    res.status(200).json({Data:foundCompany})
}

export const searchForCompany = async(req,res,next)=>{
    const {companyName} = req.query
    // apply search
    const company = await CompanyModel.find({$text:{$search:companyName}})
    .select('-_id companyName description industry address numberOfEmployee companyEmail')
    if(!company.length){
        return next(new Error('No company found with this name',{cause:404}))
    }
    // send response
    res.status(200).json({Data:company})
}

export const allApplicationsForJob = async(req,res,next)=>{
    const {jobId} = req.params
    const applications = await ApplicationModel.find({jobId})
    .select('-_id userId userTechSkills userSoftSkills userResume')
    .populate('userId','username email -_id DOB mobileNumber')
    if(!applications.length){
        return next(new Error('No users applied application for this job',{cause:404}))
    }
    res.status(200).json({message:'These are all application applied for this job',applications})
}

export const collectAllApplicationsForCompany=async(req,res,next)=>{
    const {companyId} = req.params
    const {day} = req.body
    // get all jobs for specific company
    const allJobsForCompany = await JobModel.find({companyId})
    if(!allJobsForCompany){return next(new Error('No jobs Found'))}
    // get all applications to company
    let applications = []
    for (const job of allJobsForCompany) {
        const jobId = job._id
        const allApplications = await ApplicationModel.find({jobId})
        .populate([
            {path:'jobId',select:'-_id jobTitle jobLocation workingTime seniorityLevel technicalSkills softSkills'},
            {path:'userId',select:'-_id username email DOB mobileNumber'}
        ])
        applications.push(...allApplications)
    }
    // filter application based on day
    const applicationInSpecificDay = applications.filter(app =>{
        const createdAtMoment = moment(app.createdAt)
        return createdAtMoment.isSame(day,'day')
    })
    if(!applicationInSpecificDay.length){
        return next(new Error(`No applications applied in this day: ${day}`,{cause:404}))
    }
    // create excel sheet
    const workBook = new excel.Workbook()
    const workSheet = workBook.addWorksheet('Applications')
    workSheet.columns = [
        {header:'jobLocation' , key:'jobLocation', width:30},
        {header:'jobTitle' , key:'jobTitle', width:30},
        {header:'workingTime' , key:'workingTime', width:30},
        {header:'seniorityLevel' , key:'seniorityLevel', width:30},
        {header:'technicalSkills' , key:'technicalSkills', width:30},
        {header:'softSkills' , key:'softSkills', width:30},
        {header:'username' , key:'username', width:20},
        {header:'email' , key:'email', width:20},
        {header:'DOB' , key:'DOB', width:20},
        {header:'mobileNumber' , key:'mobileNumber', width:20},
        {header:'userTechSkills' , key:'userTechSkills', width:60},
        {header:'userSoftSkills' , key:'userSoftSkills', width:60},
        {header:'UserResume' , key:'userResume', width:50},
        {header:'CreatedAt' , key:'createdAt', width:30},
    ]
    applicationInSpecificDay.forEach(app=>{
        workSheet.addRow({
            jobLocation:app.jobId.jobLocation,
            jobTitle:app.jobId.jobTitle,
            workingTime:app.jobId.workingTime,
            seniorityLevel:app.jobId.seniorityLevel,
            technicalSkills:app.jobId.technicalSkills,
            softSkills:app.jobId.softSkills,
            username:app.userId.username,
            email:app.userId.email,
            DOB:app.userId.DOB,
            mobileNumber:app.userId.mobileNumber,
            userTechSkills:app.userTechSkills,
            userSoftSkills:app.userSoftSkills,
            userResume:app.userResume,
            createdAt:app.createdAt
        })
    })
    // save excel file
    const name = generateUniqueString()
    const fileName = `applications-for-specific-company-in-specific-day-${name}.xlsx`
    workBook.xlsx.writeFile(fileName)
    .then(console.log('Done'))
    .catch(err =>console.log(err.message))
    res.status(200).json({message:`Excel file '${fileName}' created successfully.`})
}