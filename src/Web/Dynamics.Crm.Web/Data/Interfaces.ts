module Dynamics.Crm.Data {

    export interface ILogEntryRepository {
        Create(logEntry: Core.IEntity): void;
    }

    export interface IUnitOfWork {

        GetLogEntryRepository(): ILogEntryRepository;
    }
}