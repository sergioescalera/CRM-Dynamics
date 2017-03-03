module Dynamics.Crm.Data {

    export class LogEntryRepository implements ILogEntryRepository {

        Create(entry: Core.ILogEntry): void {

            OData.createEntity(entry, Schema.LogEntryEntity.setName);
        }
    }

    export class UnitOfWork implements IUnitOfWork {

        GetLogEntryRepository(): ILogEntryRepository {

            return new LogEntryRepository();
        }
    }

    export var unitOfWork: IUnitOfWork = new UnitOfWork();
}

module Dynamics.Crm.Data.Schema {

    export class LogEntryEntity {

        static type: string = componentName("logentry");
        static setName: string = componentName("logentries");
        static idField: string = componentName("logentryid");
        static nameField: string = componentName("name");
        static messageField: string = componentName("message");
        static descriptionField: string = componentName("description");
        static sourceField: string = componentName("source");
        static typeField: string = componentName("type");
    }
}