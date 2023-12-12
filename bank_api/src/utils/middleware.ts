import { idMiddlewareInput, roleMiddlewareInput } from "../../types/middleware";

export function idAndRoleMiddleware(ids: idMiddlewareInput, self: boolean, currRole: string, roles: roleMiddlewareInput) {

    let isAuthorize = true

    if(self) {
        isAuthorize = isAuthorize && ids.id1 === ids.id2
    }

    if(roles.length > 0) {
        if(self) {
            roles.map((role) => {
                isAuthorize = isAuthorize || currRole === role
            })
        } else {
            roles.map((role) => {
                isAuthorize = isAuthorize && currRole === role
            })
        }
    }

    return isAuthorize
}