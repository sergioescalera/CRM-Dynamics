module Dynamics.Crm.Core {

    "use strict";

    export interface IEntity extends _.Dictionary<any> {
        id?: string;
        type: string;
    }

    export interface ILogEntry extends IEntity {
    }

    export function parseIdentifier(idStr: string): string {

        if (idStr === undefined || idStr === null) {
            return "";
        }

        return idStr.replace("{", "").replace("}", "").toUpperCase();
    }

    export function identifiersAreEqual(id: string, otherId: string): boolean {

        if (!id || !otherId) {
            return false;
        }

        return parseIdentifier(id) === parseIdentifier(otherId);
    }
}