module Dynamics.Crm.User {

    export function getId(): string {

        var userId = Xrm.Page.context.getUserId();

        return Core.parseIdentifier(userId);
    }
}