import { Router } from "express";
import * as jobController from './job.controller.js'
import asyncWrapper from '../../utils/asyncWrapper.js'
import auth from '../../middlewares/auth.middleware.js'
import jobRoutesRoles from "./jobRoutesRoles.js";
import checkOwnerOfJob from "../../middlewares/checkOwnerOfJob.js";
import multerMiddleware from "../../middlewares/multer.middleware.js";
import allowedExtensions from "../../utils/allowedExtensions.js";
import * as jobValidationSchemas from './jobValidationSchemas.js'
import validationMiddleware from '../../middlewares/validation.middleware.js'
import checkCompanyOwner from '../../middlewares/checkCompanyOwner.js'

const router = Router()

router.post('/:companyId',
    asyncWrapper(validationMiddleware(jobValidationSchemas.addJobSchema)),
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(jobController.addJob)
)
router.put('/:companyId/:jobId',
    asyncWrapper(validationMiddleware(jobValidationSchemas.updateJobSchema)),
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(jobController.updateJob)
)
router.delete('/:companyId/:jobId',
    asyncWrapper(validationMiddleware(jobValidationSchemas.deleteJobSchema)),
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(jobController.deleteJob)
)
router.get('/jobsAndCompaniesInfo',
    asyncWrapper(validationMiddleware(jobValidationSchemas.getAllJobsWithCompanyInfoSchema)),
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(jobController.jobsWithCompaniesInfo)
)
router.get('/companyJobs',
    asyncWrapper(validationMiddleware(jobValidationSchemas.getAllJobsForSpecificCompanySchema)),
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(jobController.allJobsSpecificCompany)
)
router.get('/filterJobs',
    asyncWrapper(validationMiddleware(jobValidationSchemas.filterJobsSchema)),
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(jobController.filterJobs)
)
router.post('/applyJob/:jobId',
    asyncWrapper(validationMiddleware(jobValidationSchemas.applyJobSchema)),
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_USER)),
    multerMiddleware({extension:allowedExtensions.RESUME_FORMAT}).single('Resume'),
    asyncWrapper(jobController.applyJob)
)

export default router