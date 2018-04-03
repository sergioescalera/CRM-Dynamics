module Dynamics.Crm.User {

    "use strict";

    export function getId(): string {

        let userId = Xrm.Utility.getGlobalContext().userSettings.userId;

        return Core.parseIdentifier(userId);
    }

    export function hasRole(roleId: string): boolean {

        let roles: string[] = Xrm.Utility.getGlobalContext().userSettings.securityRoles;

        return roles.filter((r: string) => Core.identifiersAreEqual(r, roleId)).length > 0;
    }
}