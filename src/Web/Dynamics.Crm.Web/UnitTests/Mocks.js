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
                var VisibleObject = (function () {
                    function VisibleObject() {
                    }
                    VisibleObject.prototype.getVisible = function () {
                        return this._visible;
                    };
                    VisibleObject.prototype.setVisible = function (value) {
                        this._visible = value;
                    };
                    return VisibleObject;
                }());
                var PageMock = (function () {
                    function PageMock() {
                        this.ageAttribute = new AttributeMock("age", true);
                        this.attributes = {};
                        this.attributes[this.ageAttribute.name] = this.ageAttribute;
                        this.controls = this.ageAttribute.controls;
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
                    PageMock.prototype.getControl = function (name) {
                        return this.controls[name];
                    };
                    return PageMock;
                }());
                Mocks.PageMock = PageMock;
                var AttributeMock = (function () {
                    function AttributeMock(name, header, footer) {
                        this.controls = {
                            forEach: this.forEach.bind(this)
                        };
                        this.controls[name] = new ControlMock(name);
                        if (header) {
                            this.controls[name + "_header"] = new ControlMock(name + "_header");
                        }
                        if (footer) {
                            this.controls[name + "_footer"] = new ControlMock(name + "_footer");
                        }
                        this.name = name;
                    }
                    AttributeMock.prototype.forEach = function (func) {
                        var keys = [this.name, this.name + "_header", this.name + "_footer"];
                        for (var i = 0; i < keys.length; i++) {
                            var control = this.controls[keys[i]];
                            if (control) {
                                debugger;
                                func(control);
                            }
                        }
                    };
                    return AttributeMock;
                }());
                Mocks.AttributeMock = AttributeMock;
                var ControlMock = (function (_super) {
                    __extends(ControlMock, _super);
                    function ControlMock(name) {
                        _super.call(this);
                        this.name = name;
                    }
                    ControlMock.prototype.getDisabled = function () {
                        return this._disabled;
                    };
                    ControlMock.prototype.setDisabled = function (value) {
                        this._disabled = value;
                    };
                    return ControlMock;
                }(VisibleObject));
                Mocks.ControlMock = ControlMock;
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
                }(VisibleObject));
                Mocks.TabMock = TabMock;
                var SectionMock = (function (_super) {
                    __extends(SectionMock, _super);
                    function SectionMock() {
                        _super.apply(this, arguments);
                    }
                    return SectionMock;
                }(VisibleObject));
                Mocks.SectionMock = SectionMock;
            })(Mocks = UnitTests.Mocks || (UnitTests.Mocks = {}));
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
//# sourceMappingURL=Mocks.js.map