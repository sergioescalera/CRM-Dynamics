var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            var Mocks;
            (function (Mocks) {
                "use strict";
                var PageMock = (function () {
                    function PageMock() {
                        this.ageAttribute = new AttributeMock();
                        this.attributes = { "age": this.ageAttribute };
                        this.mainTab = new TabMock();
                        this.tabs = { "mainTab": this.mainTab };
                        this.ui = {
                            tabs: {
                                get: this.getTab.bind(this)
                            }
                        };
                    }
                    PageMock.prototype.getTab = function (param) {
                        if (typeof param === "string") {
                            return this.tabs[param];
                        }
                        return null;
                    };
                    PageMock.prototype.getAttribute = function (name) {
                        return this.attributes[name];
                    };
                    return PageMock;
                }());
                Mocks.PageMock = PageMock;
                var AttributeMock = (function () {
                    function AttributeMock() {
                    }
                    return AttributeMock;
                }());
                Mocks.AttributeMock = AttributeMock;
                var TabMock = (function () {
                    function TabMock() {
                    }
                    TabMock.prototype.getVisible = function () {
                        return this._visible;
                    };
                    TabMock.prototype.setVisible = function (value) {
                        this._visible = value;
                    };
                    TabMock.prototype.getDisplayState = function () {
                        return this._displayState;
                    };
                    TabMock.prototype.setDisplayState = function (value) {
                        this._displayState = value;
                    };
                    return TabMock;
                }());
                Mocks.TabMock = TabMock;
            })(Mocks = UnitTests.Mocks || (UnitTests.Mocks = {}));
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=Mocks.js.map