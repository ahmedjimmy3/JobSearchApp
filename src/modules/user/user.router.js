import { Router } from "express";
import asyncWrapper from '../../utils/asyncWrapper.js'
import * as userController from './user.controller.js'
import auth from "../../middlewares/auth.middleware.js";
import userRoutesRoles from "./userRoutesRoles.js";
import checkOwnerAccount from "../../middlewares/checkOwnerAccount.js";
import * as userValidationSchemas from './userValidationSchemas.js'
import validationMiddleware from '../../middlewares/validation.middleware.js'

const router = Router()

router.post('/signUp' ,
    asyncWrapper(validationMiddleware(userValidationSchemas.signUpSchema)),
    asyncWrapper(userController.signUp)
)
router.post('/login' ,
    asyncWrapper(validationMiddleware(userValidationSchemas.loginSchema)),
    asyncWrapper(userController.login)
)
router.delete('/:accountId' ,
    asyncWrapper(validationMiddleware(userValidationSchemas.deleteAccountSchema)),
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(checkOwnerAccount()),
    asyncWrapper(userController.deleteAccount)
)
router.get('/account/:accountId' ,
    asyncWrapper(validationMiddleware(userValidationSchemas.accountDataSchema)),
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(checkOwnerAccount()),
    asyncWrapper(userController.accountData)
)
router.put('/updateAccount/:accountId',
    asyncWrapper(validationMiddleware(userValidationSchemas.updateAccountSchema)),
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(checkOwnerAccount()),
    asyncWrapper(userController.updateAccount)
)
router.get('/profile/:accountId' ,
    asyncWrapper(validationMiddleware(userValidationSchemas.accountDataSchema)),
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(userController.getProfileAnotherUser)
)
router.patch('/updatePassword' , 
    asyncWrapper(validationMiddleware(userValidationSchemas.updatePasswordSchema)),
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(userController.updatePassword)
)
router.get('/' ,
    asyncWrapper(validationMiddleware(userValidationSchemas.recoveryEmailSchema)),
    asyncWrapper(auth(userRoutesRoles.GENERAL_USAGE_ADMIN)),
    asyncWrapper(userController.accountsWithSameRecoveryEmail)
)
router.patch('/sendOTP' ,
    asyncWrapper(validationMiddleware(userValidationSchemas.sendOTPSchema)),
    asyncWrapper(userController.sendOTP)
)
router.put('/setPasswordUsingOTP',
    asyncWrapper(validationMiddleware(userValidationSchemas.setPasswordAfterSendingOTPSchema)),
    asyncWrapper(userController.setPasswordAfterSendingOTP)
)

export default router