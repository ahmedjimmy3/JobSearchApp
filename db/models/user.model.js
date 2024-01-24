import { Schema , model } from "mongoose";
import systemRoles from "../../src/utils/systemRoles.js";
import userStatus from '../../src/utils/user.status.js'

const userSchema = new Schema (
    {
        firstName:{type:String , required:true , trim:true},
        lastName:{type:String , required:true , trim:true},
        username:{type:String },
        email:{type:String , unique:true , required:true},
        password:{type:String , required:true},
        recoveryEmail:{type:String , required:true},
        DOB:{type:String , required:true},
        mobileNumber:{type:Number , required:true , unique:true},
        role:{type:String , enum:[systemRoles.USER,systemRoles.COMPANY_HR,systemRoles.ADMIN] , default:systemRoles.USER },
        status:{type:String ,enum:[userStatus.OFFLINE , userStatus.ONLINE] ,default:userStatus.OFFLINE},
        OTP:{type:Number}
    },
    {timestamps:true}
)

const UserModel = model('User' , userSchema)
export default UserModel