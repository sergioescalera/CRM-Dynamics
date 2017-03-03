module Dynamics.Crm.Data {

    export interface ILogEntryRepository {
        Create(entry: Core.ILogEntry): void;
    }

    export interface IUnitOfWork {

        GetLogEntryRepository(): ILogEntryRepository;
    }
}