var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Data;
        (function (Data) {
            var LogEntryRepository = (function () {
                function LogEntryRepository() {
                }
                LogEntryRepository.prototype.Create = function (entry) {
                    Crm.OData.createEntity(entry, Data.Schema.LogEntryEntity.setName);
                };
                return LogEntryRepository;
            }());
            Data.LogEntryRepository = LogEntryRepository;
            var UnitOfWork = (function () {
                function UnitOfWork() {
                }
                UnitOfWork.prototype.GetLogEntryRepository = function () {
                    return new LogEntryRepository();
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
                var LogEntryEntity = (function () {
                    function LogEntryEntity() {
                    }
                    LogEntryEntity.type = Crm.componentName("logentry");
                    LogEntryEntity.setName = Crm.componentName("logentries");
                    LogEntryEntity.idField = Crm.componentName("logentryid");
                    LogEntryEntity.nameField = Crm.componentName("name");
                    LogEntryEntity.messageField = Crm.componentName("message");
                    LogEntryEntity.descriptionField = Crm.componentName("description");
                    LogEntryEntity.sourceField = Crm.componentName("source");
                    LogEntryEntity.typeField = Crm.componentName("type");
                    return LogEntryEntity;
                }());
                Schema.LogEntryEntity = LogEntryEntity;
            })(Schema = Data.Schema || (Data.Schema = {}));
        })(Data = Crm.Data || (Crm.Data = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=Repositories.js.map