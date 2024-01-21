import systemRoles from "../../utils/systemRoles.js";

const jobRoutesRoles = {
    GENERAL_USAGE_USER: [systemRoles.USER],
    GENERAL_USAGE_ALL_ROLES: [systemRoles.USER , systemRoles.COMPANY_HR],
    GENERAL_USAGE_COMPANY_HR: [systemRoles.COMPANY_HR]
}

export default jobRoutesRoles