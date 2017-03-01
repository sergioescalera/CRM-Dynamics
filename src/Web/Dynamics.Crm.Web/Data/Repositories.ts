module Dynamics.Crm.Data {

    export class LogEntryRepository implements ILogEntryRepository {

        Create(logEntry: Core.IEntity): void {

            OData.createEntity(logEntry);
        }
    }

    export class UnitOfWork implements IUnitOfWork {

        GetLogEntryRepository(): ILogEntryRepository {

            return new LogEntryRepository();
        }
    }

    export var unitOfWork: IUnitOfWork = new UnitOfWork();
}