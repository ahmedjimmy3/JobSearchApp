import CompanyModel from "../../db/models/company.model.js"
import JobModel from "../../db/models/job.model.js"

const checkCompanyOwner = ()=>{
    return async(req,res,next)=>{
        const {jobId} = req.params
        const {_id} = req.authUser
        const {companyId} = req.params
        const companyFound = await CompanyModel.findById(companyId)
        if(!companyFound){
            return next(new Error('This company not found',{cause:404}))
        }
        if(_id.toString() != companyFound.companyHR.toString()){
            return next(new Error('You can not access this company', {cause:401}))
        }
        if(jobId){
            const job = await JobModel.findById(jobId)
            if(!job){ return next(new Error('This job not found',{cause:404}))}
            if(companyFound._id.toString() != job.companyId.toString()){
                return next(new Error('This job or application does not found here',{cause:401}))
            }
        }
        req.thisCompany = companyFound
        next()
    }
}

export default checkCompanyOwner