import { Schema , model } from "mongoose";

const companySchema = new Schema(
    {
        companyName:{type:String,unique:true,required:true},
        description:{type:String,required:true},
        industry:{type:String,required:true},
        address:{type:String,required:true},
        numberOfEmployee:{type:String},
        companyEmail:{type:String,unique:true,required:true},
        companyHR:{type:Schema.Types.ObjectId,ref:'User',required:true}
    },
    {timestamps:true}
)
companySchema.index({companyName:'text'})

const CompanyModel = model('Company',companySchema)
export default CompanyModel