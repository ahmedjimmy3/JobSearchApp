import UserModel from '../../../db/models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userStatus from '../../utils/user.status.js'
import generateUniqueString from '../../utils/generateUniqueString.js'
import moment from 'moment'


export const signUp = async(req,res,next)=>{
    // get data from body
    const {email,lastName,firstName,password,recoveryEmail,DOB,mobileNumber,role} = req.body
    //check if email or mobileNumber already used before 
    const checkValidEmailAndMobileNumber = await UserModel.findOne({
        $or:[
            {email},
            {mobileNumber}
        ]
    })
    if(checkValidEmailAndMobileNumber){
        return next(new Error('Email or mobileNumber already used before.!!', {cause:409}))
    }
    //get username
    const username = firstName+'-'+lastName
    //hash password
    const hashedPassword = bcrypt.hashSync(password , +process.env.SAULT_ROUNDS)
    // apply format of DOB
    const dobMoment = moment(DOB,'YYYY-MM-DD')
    const formatDob = dobMoment.format('YYYY-MM-DD')
    // create new user in db
    const newUser = await UserModel.create({
        firstName,lastName,email,password:hashedPassword,recoveryEmail,DOB:formatDob,mobileNumber,username,role
    })
    //check if creation failed
    if(!newUser){
        return next(new Error('Registration Failed' , {cause:400}))
    }
    // send response success to user
    res.status(201).json({message:'Registration done successfully' , newUser})
}

export const login = async(req,res,next)=>{
    // get data from body
    const {email,mobileNumber,recoveryEmail,password} = req.body
    // check if this account found
    const accountFound = await UserModel.findOne({
        $or:[
            {email},
            {mobileNumber},
            {recoveryEmail}
        ]
    })
    if(!accountFound){
        return next(new Error('This account with this info is not found',{cause:404}))
    }
    // compare password
    const validPassword = bcrypt.compareSync(password,accountFound.password)
    if(!validPassword){
        return next(new Error('This account with this info is not found',{cause:404}))
    }
    //update status to online 
    accountFound.status = userStatus.ONLINE
    await accountFound.save()
    // generate token
    const token = jwt.sign({id:accountFound._id , email:accountFound.email} , process.env.SECRET_KEY)
    // send response
    res.status(200).json({message:'You are logged successfully', token})
}

export const deleteAccount = async(req,res,next)=>{
    // get loggedIn user id
    const {_id} = req.authUser
    // delete account
    const deleteDone = await UserModel.findByIdAndDelete(_id)
    if(!deleteDone){
        return next(new(Error('Deletion failed',{cause:400})))
    }
    // send response
    res.status(200).json({message:'Account deleted done'})
}

export const accountData = async(req,res,next)=>{
    // get loggedIn User id
    const {_id} = req.authUser
    // get account data
    const userInfo = await UserModel.findById(_id).select('-_id firstName lastName email recoveryEmail phone DOB status mobileNumber username')
    // send response
    res.status(200).json({message:'This is your data' ,Data: userInfo })
}

export const updateAccount = async(req,res,next)=>{
    // ge data from body
    const {_id} = req.authUser
    const {email , mobileNumber , recoveryEmail , DOB , lastName , firstName} = req.body
    const userOldData = await UserModel.findById(_id)
    // check if email or mobileNumber used before
    if(email){
        const checkEmail = await UserModel.findOne({email})
        if(checkEmail){
            return next(new Error('This email already used',{cause:409}))
        }
    }
    if(mobileNumber){
        const checkMobileNumber = await UserModel.findOne({mobileNumber})
        if(checkMobileNumber){
            return next(new Error('This mobileNumber is already used',{cause:409}))
        }
    }
    let formatDOB
    if(DOB){
        const DOBmoment = moment(DOB , 'YYYY-MM-DD')
        formatDOB = DOBmoment.format('YYYY-MM-DD')
    }
    let username
    if(firstName||lastName){
        const [oldFirstName , oldLastName ] = userOldData.username.split('-')
        username = `${firstName||oldFirstName}-${lastName||oldLastName}`
    }
    // update data
    const updatedData = await UserModel.findByIdAndUpdate({_id},{
            email , mobileNumber , recoveryEmail , DOB:formatDOB , lastName , firstName ,username
        } , {new:true}
    )
    if(!updatedData){
        return next(new Error('Update operation failed',{cause:400}))
    }
    // send response
    res.status(200).json({message:'Updated done' , updatedData})
}

export const getProfileAnotherUser = async(req,res,next)=>{
    const {accountId} = req.params
    // get data according to accountId
    const profile = await UserModel.findById(accountId).select('-_id username email mobileNumber DOB status')
    if(!profile){
        return next(new Error('This account not found',{cause:404}))
    }
    // send response
    res.status(200).json({message:'Profile' , profile})
}

export const updatePassword = async(req,res,next)=>{
    const {_id} = req.authUser
    // get data from body
    const {oldPassword , newPassword} = req.body
    // get account
    const account = await UserModel.findById(_id)
    // check if password entered by user equal to password in db
    const checkPassword = bcrypt.compareSync(oldPassword , account.password)
    if(!checkPassword){
        return next(new Error('Old password was wrong try again..',{cause:400}))
    }
    // hash newPassword
    const hashNewPassword = bcrypt.hashSync(newPassword , +process.env.SAULT_ROUNDS)
    // update password
    account.password = hashNewPassword
    await account.save()
    // send response
    res.status(200).json({message:'Password updated done'})
}

export const accountsWithSameRecoveryEmail = async(req,res,next)=>{
    // get specific recoveryEmail
    const {recoveryEmail} = req.query
    // find all accounts with this recoveryEmail
    const allAccounts = await UserModel.find({recoveryEmail}, '-_id username email DOB mobileNumber recoveryEmail')
    if(!allAccounts.length){
        return next(new Error('No accounts with this recoveryEmail!!',{cause:404}))
    }
    // send response
    res.status(200).json({Data: allAccounts})
}

export const sendOTP = async(req,res,next)=>{
    // get email from body
    const {email} = req.body
    // found account with this email
    const accountForThisEmail = await UserModel.findOne({email})
    if(!accountForThisEmail){
        return next(new Error('This account not found yet..',{cause:404}))
    }
    // generate unique OTP 
    const OTP = generateUniqueString()
    // save OTP to this user
    accountForThisEmail.OTP = OTP
    await accountForThisEmail.save()
    // send response
    res.status(200).json({message:'This OTP to add your password' , OTP})
}

export const setPasswordAfterSendingOTP = async(req,res,next)=>{
    // get OTP and email from body
    const {OTP,email,newPassword} = req.body
    // check if this account with this email have an OTP
    const checkOTPForThisAccount = await UserModel.findOne({OTP,email})
    if(!checkOTPForThisAccount){
        return next(new Error('This account was not requested to change password',{cause:404}))
    }
    // hash new password
    const hashedPassword = bcrypt.hashSync(newPassword , +process.env.SAULT_ROUNDS)
    // save changes
    checkOTPForThisAccount.password = hashedPassword
    checkOTPForThisAccount.OTP = undefined
    await checkOTPForThisAccount.save()
    // send response
    res.status(200).json({message:"Password was reset to newPassword you added"})
}