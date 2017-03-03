var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                var VisibleMock = (function () {
                    function VisibleMock() {
                    }
                    VisibleMock.prototype.getVisible = function () {
                        return this._visible;
                    };
                    VisibleMock.prototype.setVisible = function (value) {
                        this._visible = value;
                    };
                    return VisibleMock;
                }());
                var TabMock = (function (_super) {
                    __extends(TabMock, _super);
                    function TabMock() {
                        _super.call(this);
                        this.mainSection = new SectionMock();
                        this._sections = { "mainSection": this.mainSection };
                        this.sections = {
                            get: this.getSection.bind(this)
                        };
                    }
                    TabMock.prototype.getDisplayState = function () {
                        return this._displayState;
                    };
                    TabMock.prototype.setDisplayState = function (value) {
                        this._displayState = value;
                    };
                    TabMock.prototype.getSection = function (param) {
                        if (typeof param === "string") {
                            return this._sections[param];
                        }
                        return null;
                    };
                    return TabMock;
                }(VisibleMock));
                Mocks.TabMock = TabMock;
                var SectionMock = (function (_super) {
                    __extends(SectionMock, _super);
                    function SectionMock() {
                        _super.apply(this, arguments);
                    }
                    return SectionMock;
                }(VisibleMock));
                Mocks.SectionMock = SectionMock;
            })(Mocks = UnitTests.Mocks || (UnitTests.Mocks = {}));
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
