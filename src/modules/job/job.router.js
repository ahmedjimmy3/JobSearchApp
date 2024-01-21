import { Router } from "express";
import * as jobController from './job.controller.js'
import asyncWrapper from '../../utils/asyncWrapper.js'
import auth from '../../middlewares/auth.middleware.js'
import jobRoutesRoles from "./jobRoutesRoles.js";
import checkOwnerOfJob from "../../middlewares/checkOwnerOfJob.js";
import multerMiddleware from "../../middlewares/multer.middleware.js";
import allowedExtensions from "../../utils/allowedExtensions.js";

const router = Router()

router.post('/',
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(jobController.addJob)
)
router.put('/:jobId',
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkOwnerOfJob()),
    asyncWrapper(jobController.updateJob)
)
router.delete('/:jobId',
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkOwnerOfJob()),
    asyncWrapper(jobController.deleteJob)
)
router.get('/jobsAndCompaniesInfo',
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(jobController.jobsWithCompaniesInfo)
)
router.get('/companyJobs',
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(jobController.allJobsSpecificCompany)
)
router.get('/filterJobs',
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_ALL_ROLES)),
    asyncWrapper(jobController.filterJobs)
)
router.post('/applyJob/:jobId',
    asyncWrapper(auth(jobRoutesRoles.GENERAL_USAGE_USER)),
    multerMiddleware({extension:allowedExtensions.RESUME_FORMAT}).single('Resume'),
    asyncWrapper(jobController.applyJob)
)

export default router