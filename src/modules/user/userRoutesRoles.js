import systemRoles from "../../utils/systemRoles.js";

const userRoutesRoles = {
    GENERAL_USAGE_ALL_ROLES: [systemRoles.USER , systemRoles.COMPANY_HR],
    GENERAL_USAGE_ADMIN: [systemRoles.ADMIN]
}

export default userRoutesRoles