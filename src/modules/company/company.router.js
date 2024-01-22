import { Router } from "express";
import * as companyController from './company.controller.js'
import asyncWrapper from '../../utils/asyncWrapper.js'
import auth from '../../middlewares/auth.middleware.js'
import companyRoutesRoles from "./companyRoutesRoles.js";
import checkCompanyOwner from "../../middlewares/checkCompanyOwner.js";

const router = Router()

router.post('/',
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(companyController.addCompany)
)
router.put('/:companyId',
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(companyController.updateCompany)
)
router.delete('/:companyId',
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(companyController.deleteCompany)
)
router.get('/data/:companyId',
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(companyController.getCompanyData)
)
router.get('/searchCompany',
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(companyController.searchForCompany)
)
router.get('/applications/:companyId/:jobId',
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(companyController.allApplicationsForJob)
)
router.get('/excel/:companyId',
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(companyController.collectAllApplicationsForCompany)
)

export default router