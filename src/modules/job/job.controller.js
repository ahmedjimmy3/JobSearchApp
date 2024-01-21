import JobModel from "../../../db/models/job.model.js"
import CompanyModel from '../../../db/models/company.model.js'
import cloudinary from '../../utils/cloudinary.js'
import ApplicationModel from "../../../db/models/application.model.js"

export const addJob = async(req,res,next)=>{
    // get data from body
    const {_id} = req.authUser
    const {jobTitle,jobLocation,workingTime,seniorityLevel,technicalSkills,softSkills}=req.body
    // check all fields
    if(!jobLocation||!jobTitle||!workingTime||!seniorityLevel||!technicalSkills||!softSkills){
        return next(new Error('All this fields are required',{cause:400}))
    }
    // get companyId 
    const company = await CompanyModel.findOne({companyHR:_id})
    if(!company){
        return next(new Error('Company not found'))
    }
    const companyId = company._id
    // create job
    const newJob = await JobModel.create(
        {jobTitle,jobLocation,workingTime,seniorityLevel,technicalSkills,softSkills,addedBy:_id,companyId}
    )
    if(!newJob){
        return next(new Error('Failed to add job!!!',{cause:400}))
    }
    // send response
    res.status(201).json({message:'Job added successfully', Job:newJob})
}

export const updateJob = async(req,res,next)=>{
    // get data from body
    const {jobId} = req.params
    const {jobTitle,jobLocation,workingTime,seniorityLevel,technicalSkills,softSkills} = req.body
    // apply update
    const jobModification = await JobModel.findByIdAndUpdate(jobId,
        {jobTitle,jobLocation,workingTime,seniorityLevel,technicalSkills,softSkills},
        {new:true}
    )
    if(!jobModification){
        return next(new Error('Update failed...',{cause:400}))
    }
    // send response
    res.status(200).json({message:'Update Done', Data:jobModification})
}

export const deleteJob = async(req,res,next)=>{
    const {jobId}  =req.params
    // delete job
    const jobDeletion = await JobModel.findByIdAndDelete(jobId)
    if(!jobDeletion){
        return next(new Error('Deletion failed',{cause:400}))
    }
    // send response
    res.status(200).json({message:'Job deleted successfully'})
}

export const jobsWithCompaniesInfo = async(req,res,next)=>{
    const jobs = await JobModel.find()
    .select('-_id jobTitle jobLocation workingTime seniorityLevel technicalSkills softSkills')
    .populate(
        'companyId','-_id companyName companyEmail description industry address numberOfEmployee'
    )
    res.status(200).json({message:'These are all jobs with their companies', jobs})
}

export const allJobsSpecificCompany = async(req,res,next)=>{
    const {companyName} = req.query
    // get company
    const company = await CompanyModel.findOne({companyName})
    if(!company){
        return next(new Error('Company not found',{cause:404}))
    }
    // get all jobs for company
    const jobs = await JobModel.find({companyId:company._id})
    .select('-_id jobTitle jobLocation workingTime seniorityLevel technicalSkills softSkills')
    if(!jobs.length){
        return next(new Error('This company does not have jobs',{cause:404}))
    }
    // send response
    res.status(200).json({message:`These jos for company: ${companyName}` , jobs})
}

export const filterJobs = async(req,res,next)=>{
    const {workingTime,seniorityLevel,jobLocation,jobTitle,technicalSkills} = req.query
    const findJobsThatMatch = await JobModel.find({
        $or:[
            {workingTime},
            {seniorityLevel},
            {jobLocation},
            {jobTitle},
            {technicalSkills}
        ]
    }).select('-_id jobTitle jobLocation workingTime seniorityLevel technicalSkills softSkills')
    if(!findJobsThatMatch){
        return next(new Error('No jobs match your search',{cause:404}))
    }
    res.status(200).json({message:'All jobs that match your filter' , findJobsThatMatch})
}

export const applyJob = async(req,res,next)=>{
    const {jobId} = req.params
    const {_id} = req.authUser
    const {userTechSkills , userSoftSkills} = req.body
    // job exist
    const isJobExist = await JobModel.findById(jobId)
    if(!isJobExist){
        return next(new Error('Job not found'))
    }
    // check if user applied this for this job befors
    const userFound = await ApplicationModel.findOne({jobId,userId:_id})
    if(userFound){
        return next(new Error('You can not apply application again for this job'))
    }
    // check if any field is not entered
    if(!userSoftSkills||!userTechSkills){
        return next(new Error('You should fill all fields'))
    }
    // upload resume to cloudinary
    const folderPath = `JOB_SEARCH_APP/RESUMES/${jobId}/${_id}`
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:folderPath,
        unique_filename:false,
        use_filename:true
    })
    let userResume = {secure_url,public_id}
    // add user info to apply the job
    const applyApplication = await ApplicationModel.create(
        {jobId,userId:_id,userTechSkills,userSoftSkills,userResume}
    )
    if(!applyApplication){
        await cloudinary.api.delete_resources(public_id)
        await cloudinary.api.delete_folder(folderPath)
        return next(new Error('Applying to application failed',{cause:500}))
    }
    // send response
    res.status(201).json({message:'Applying application done', applyApplication})
}