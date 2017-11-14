module Dynamics.Crm.Data {

    "use strict";

    export class LogEntryRepository implements ILogEntryRepository {

        private _prefix: string;

        constructor(prefix: string) {

            this._prefix = prefix;
        }

        Create(entry: Core.ILogEntry): void {

            OData.createEntity(entry, Schema.LogEntryEntity.setName(this._prefix), [], false);
        }
    }

    export class UnitOfWork implements IUnitOfWork {

        GetLogEntryRepository(prefix: string): ILogEntryRepository {

            return new LogEntryRepository(prefix);
        }
    }

    export var unitOfWork: IUnitOfWork = new UnitOfWork();
}

module Dynamics.Crm.Data.Schema {

    "use strict";

    export class LogEntryEntity {

        static type: (prefix: string) => string = (prefix: string) => componentName(prefix, "logentry");
        static setName: (prefix: string) => string = (prefix: string) => componentName(prefix,"logentries");
        static idField: (prefix: string) => string = (prefix: string) => componentName(prefix,"logentryid");
        static nameField: (prefix: string) => string = (prefix: string) => componentName(prefix,"name");
        static messageField: (prefix: string) => string = (prefix: string) => componentName(prefix,"message");
        static descriptionField: (prefix: string) => string = (prefix: string) => componentName(prefix,"description");
        static sourceField: (prefix: string) => string = (prefix: string) => componentName(prefix,"source");
        static typeField: (prefix: string) => string = (prefix: string) => componentName(prefix,"type");
    }
}