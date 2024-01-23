import { Schema , model } from "mongoose";

const companySchema = new Schema(
    {
        companyName:{type:String,unique:true,required:true},
        description:{type:String,required:true},
        industry:{type:String,required:true},
        address:{type:String,required:true},
        numberOfEmployeeFrom:{type:Number , required:true},
        numberOfEmployeeTo:{type:Number,required:true},
        numberOfEmployee:{type:String},
        companyEmail:{type:String,unique:true,required:true},
        companyHR:{type:Schema.Types.ObjectId,ref:'User',required:true}
    },
    {timestamps:true}
)
companySchema.index({companyName:'text'})

companySchema.set('toObject',{virtuals:true})
companySchema.set('toJSON' , {virtuals:true})

companySchema.virtual('jobs',{
    ref:'Job',
    localField:'_id',
    foreignField:'companyId'
})

const CompanyModel = model('Company',companySchema)
export default CompanyModel