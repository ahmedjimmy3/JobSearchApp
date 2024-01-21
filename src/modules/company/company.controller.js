import CompanyModel from "../../../db/models/company.model.js"

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

