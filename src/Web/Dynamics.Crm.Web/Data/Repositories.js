var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var Data;
        (function (Data) {
            var LogEntryRepository = (function () {
                function LogEntryRepository() {
                }
                LogEntryRepository.prototype.Create = function (logEntry) {
                    Crm.OData.createEntity(logEntry);
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
