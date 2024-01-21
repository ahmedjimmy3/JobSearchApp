import { Schema  , model } from "mongoose";

const applicationSchema = new Schema(
    {
        jobId:{type:Schema.Types.ObjectId,ref:'Job',required:true},
        userId:{type:Schema.Types.ObjectId,ref:'User',required:true},
        userTechSkills:{type:Array,required:true},
        userSoftSkills:{type:Array,required:true},
        userResume:{
            secure_url:{type:String , required:true},
            public_id:{type:String , required:true},
        }
    },
    {timestamps:true}
)

const ApplicationModel = model('Application',applicationSchema)
export default ApplicationModel