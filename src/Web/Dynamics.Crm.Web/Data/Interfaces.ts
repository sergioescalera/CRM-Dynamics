module Dynamics.Crm.Data {

    "use strict";

    export interface ILogEntryRepository {
        Create(entry: Core.ILogEntry): void;
    }

    export interface IUnitOfWork {

        GetLogEntryRepository(prefix: string): ILogEntryRepository;
    }
}