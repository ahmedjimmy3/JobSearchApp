import systemRoles from "../../utils/systemRoles.js";

const companyRoutesRoles = {
    GENERAL_USAGE_COMPANY_HR: [systemRoles.COMPANY_HR],
    GENERAL_USAGE_COMPANY_HR_AND_USER: [systemRoles.COMPANY_HR, systemRoles.USER]
}

export default companyRoutesRoles