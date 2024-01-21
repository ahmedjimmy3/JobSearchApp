import { Schema,model } from "mongoose"
import jobLocations from "../../src/utils/jobLocations.js"
import workingTimes from "../../src/utils/workingTimes.js"
import seniorityLevels from "../../src/utils/seniorityLevels.js"

const jobSchema = new Schema(
    {
        jobTitle:{type:String,required:true},
        jobLocation:{type:String,enum:[jobLocations.HYBRID,jobLocations.ONSITE,jobLocations.REMOTELY],required:true},
        workingTime:{type:String,enum:[workingTimes.FULL_TIME,workingTimes.PART_TIME],required:true},
        seniorityLevel:{type:String,
            enum:[
                seniorityLevels.CTO,
                seniorityLevels.JUNIOR,
                seniorityLevels.MID_LEVEL,
                seniorityLevels.SENIOR,
                seniorityLevels.TEAM_LEAD
            ],
            required:true
        },
        technicalSkills:{type:Array,required:true},
        softSkills:{type:Array,required:true},
        addedBy:{type:Schema.Types.ObjectId,ref:'User',required:true},
        companyId:{type:Schema.Types.ObjectId,ref:'Company',required:true}
    },
    {timestamps:true}
)

const JobModel = model('Job',jobSchema)
export default JobModel