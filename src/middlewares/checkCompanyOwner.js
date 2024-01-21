import CompanyModel from "../../db/models/company.model.js"

const checkCompanyOwner = ()=>{
    return async(req,res,next)=>{
        const {_id} = req.authUser
        const {companyId} = req.params
        const companyFound = await CompanyModel.findById(companyId)
        if(!companyFound){
            return next(new Error('This company not found',{cause:404}))
        }
        if(_id.toString() != companyFound.companyHR.toString()){
            console.log(_id)
            console.log(companyFound.companyHR)
            return next(new Error('You can not make update in this company', {cause:401}))
        }
        next()
    }
}

export default checkCompanyOwner