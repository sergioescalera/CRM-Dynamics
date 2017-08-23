module Dynamics.Crm.User {

    "use strict";

    export function getId(): string {

        var userId = Xrm.Page.context.getUserId();

        return Core.parseIdentifier(userId);
    }

    export function hasRole(roleId: string): boolean {

        var roles: string[] = Xrm.Page.context.getUserRoles();

        return roles.filter((r: string) => Core.identifiersAreEqual(r, roleId)).length > 0;
    }
}