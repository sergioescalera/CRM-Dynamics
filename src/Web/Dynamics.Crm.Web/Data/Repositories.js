var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Data;
        (function (Data) {
            "use strict";
            var LogEntryRepository = (function () {
                function LogEntryRepository(prefix) {
                    this._prefix = prefix;
                }
                LogEntryRepository.prototype.Create = function (entry) {
                    Crm.OData.createEntity(entry, Data.Schema.LogEntryEntity.setName(this._prefix), [], false);
                };
                return LogEntryRepository;
            }());
            Data.LogEntryRepository = LogEntryRepository;
            var UnitOfWork = (function () {
                function UnitOfWork() {
                }
                UnitOfWork.prototype.GetLogEntryRepository = function (prefix) {
                    return new LogEntryRepository(prefix);
                };
                return UnitOfWork;
            }());
            Data.UnitOfWork = UnitOfWork;
            Data.unitOfWork = new UnitOfWork();
        })(Data = Crm.Data || (Crm.Data = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Data;
        (function (Data) {
            var Schema;
            (function (Schema) {
                "use strict";
                var LogEntryEntity = (function () {
                    function LogEntryEntity() {
                    }
                    LogEntryEntity.type = function (prefix) { return Crm.componentName(prefix, "logentry"); };
                    LogEntryEntity.setName = function (prefix) { return Crm.componentName(prefix, "logentries"); };
                    LogEntryEntity.idField = function (prefix) { return Crm.componentName(prefix, "logentryid"); };
                    LogEntryEntity.nameField = function (prefix) { return Crm.componentName(prefix, "name"); };
                    LogEntryEntity.messageField = function (prefix) { return Crm.componentName(prefix, "message"); };
                    LogEntryEntity.descriptionField = function (prefix) { return Crm.componentName(prefix, "description"); };
                    LogEntryEntity.sourceField = function (prefix) { return Crm.componentName(prefix, "source"); };
                    LogEntryEntity.typeField = function (prefix) { return Crm.componentName(prefix, "type"); };
                    return LogEntryEntity;
                }());
                Schema.LogEntryEntity = LogEntryEntity;
            })(Schema = Data.Schema || (Data.Schema = {}));
        })(Data = Crm.Data || (Crm.Data = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
