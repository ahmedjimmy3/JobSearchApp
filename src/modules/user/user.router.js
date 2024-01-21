import { Router } from "express";
import asyncWrapper from '../../utils/asyncWrapper.js'
import * as userController from './user.controller.js'
import auth from "../../middlewares/auth.middleware.js";
import userRoutesRoles from "./userRoutesRoles.js";
import checkOwnerAccount from "../../middlewares/checkOwnerAccount.js";


const router = Router()

router.post('/signUp' ,
    asyncWrapper(userController.signUp)
)
router.post('/login' ,
    asyncWrapper(userController.login)
)
router.delete('/:accountId' ,
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(checkOwnerAccount()),
    asyncWrapper(userController.deleteAccount)
)
router.get('/account/:accountId' ,
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(checkOwnerAccount()),
    asyncWrapper(userController.accountData)
)
router.put('/updateAccount/:accountId',
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(checkOwnerAccount()),
    asyncWrapper(userController.updateAccount)
)
router.get('/profile/:accountId' , 
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(userController.getProfileAnotherUser)
)
router.patch('/updatePassword' , 
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(userController.updatePassword)
)
router.get('/' ,
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ADMIN)),
    asyncWrapper(userController.accountsWithSameRecoveryEmail)
)
router.patch('/sendOTP' , 
    asyncWrapper(userController.sendOTP)
)
router.put('/setPasswordUsingOTP',
    asyncWrapper(userController.setPasswordAfterSendingOTP)
)

export default router