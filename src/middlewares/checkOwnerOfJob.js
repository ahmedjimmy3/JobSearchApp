import JobModel from "../../db/models/job.model.js"

const checkOwnerOfJob = ()=>{
    return async(req,res,next)=>{
        const {_id} = req.authUser
        const {jobId} =req.params
        const findJob = await JobModel.findById(jobId)
        if(!findJob){
            return next(new Error('This job is not found',{cause:404}))
        }
        if(_id.toString() != findJob.addedBy.toString()){
            return next(new Error('You are not authorized to apply this actions',{cause:401}))
        }
        next()
    }
}

export default checkOwnerOfJob