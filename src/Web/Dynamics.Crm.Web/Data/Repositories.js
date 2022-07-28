var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Data;
        (function (Data) {
            "use strict";
            class LogEntryRepository {
                constructor(prefix) {
                    this._prefix = prefix;
                }
                Create(entry) {
                    Crm.OData.createEntity(entry, Data.Schema.LogEntryEntity.setName(this._prefix), [], false);
                }
            }
            Data.LogEntryRepository = LogEntryRepository;
            class UnitOfWork {
                GetLogEntryRepository(prefix) {
                    return new LogEntryRepository(prefix);
                }
            }
            Data.UnitOfWork = UnitOfWork;
            Data.unitOfWork = new UnitOfWork();
        })(Data = Crm.Data || (Crm.Data = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Data;
        (function (Data) {
            var Schema;
            (function (Schema) {
                "use strict";
                class LogEntryEntity {
                }
                LogEntryEntity.type = (prefix) => Crm.componentName(prefix, "logentry");
                LogEntryEntity.setName = (prefix) => Crm.componentName(prefix, "logentries");
                LogEntryEntity.idField = (prefix) => Crm.componentName(prefix, "logentryid");
                LogEntryEntity.nameField = (prefix) => Crm.componentName(prefix, "name");
                LogEntryEntity.messageField = (prefix) => Crm.componentName(prefix, "message");
                LogEntryEntity.descriptionField = (prefix) => Crm.componentName(prefix, "description");
                LogEntryEntity.sourceField = (prefix) => Crm.componentName(prefix, "source");
                LogEntryEntity.typeField = (prefix) => Crm.componentName(prefix, "type");
                Schema.LogEntryEntity = LogEntryEntity;
            })(Schema = Data.Schema || (Data.Schema = {}));
        })(Data = Crm.Data || (Crm.Data = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
