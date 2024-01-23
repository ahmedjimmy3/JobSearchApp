import { Router } from "express";
import * as companyController from './company.controller.js'
import asyncWrapper from '../../utils/asyncWrapper.js'
import auth from '../../middlewares/auth.middleware.js'
import companyRoutesRoles from "./companyRoutesRoles.js";
import checkCompanyOwner from "../../middlewares/checkCompanyOwner.js";
import validationMiddleware from '../../middlewares/validation.middleware.js'
import * as companyValidationSchemas from './companyValidationSchema.js' 

const router = Router()

router.post('/',
    asyncWrapper(validationMiddleware(companyValidationSchemas.addCompanySchema)),
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(companyController.addCompany)
)
router.put('/:companyId',
    asyncWrapper(validationMiddleware(companyValidationSchemas.updateCompanySchema)),
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(companyController.updateCompany)
)
router.delete('/:companyId',
    asyncWrapper(validationMiddleware(companyValidationSchemas.deleteAndGetCompanySchema)),
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(companyController.deleteCompany)
)
router.get('/data/:companyId',
    asyncWrapper(validationMiddleware(companyValidationSchemas.deleteAndGetCompanySchema)),
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(companyController.getCompanyData)
)
router.get('/searchCompany',
    asyncWrapper(validationMiddleware(companyValidationSchemas.searchCompanyWithName)),
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR_AND_USER)),
    asyncWrapper(companyController.searchForCompany)
)
router.get('/applications/:companyId/:jobId',
    asyncWrapper(validationMiddleware(companyValidationSchemas.getAllApplicationForJob)),
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(companyController.allApplicationsForJob)
)
router.get('/excel/:companyId',
    asyncWrapper(validationMiddleware(companyValidationSchemas.excelSheet)),
    asyncWrapper(auth(companyRoutesRoles.GENERAL_USAGE_COMPANY_HR)),
    asyncWrapper(checkCompanyOwner()),
    asyncWrapper(companyController.collectAllApplicationsForCompany)
)

export default router