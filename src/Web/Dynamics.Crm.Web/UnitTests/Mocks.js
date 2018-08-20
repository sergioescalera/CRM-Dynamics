var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            var Mocks;
            (function (Mocks) {
                "use strict";
                var VisibleObject = /** @class */ (function () {
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
                var PageMock = /** @class */ (function () {
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
                var AttributeMock = /** @class */ (function () {
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
                                func(control);
                            }
                        }
                    };
                    AttributeMock.prototype.getRequiredLevel = function () {
                        return this._requiredLevel;
                    };
                    AttributeMock.prototype.setRequiredLevel = function (value) {
                        this._requiredLevel = value;
                    };
                    return AttributeMock;
                }());
                Mocks.AttributeMock = AttributeMock;
                var ControlMock = /** @class */ (function (_super) {
                    __extends(ControlMock, _super);
                    function ControlMock(name) {
                        var _this = _super.call(this) || this;
                        _this.name = name;
                        _this.notifications = {};
                        return _this;
                    }
                    ControlMock.prototype.getDisabled = function () {
                        return this._disabled;
                    };
                    ControlMock.prototype.setDisabled = function (value) {
                        this._disabled = value;
                    };
                    ControlMock.prototype.clearNotification = function (id) {
                        this.setNotification(null, id);
                    };
                    ControlMock.prototype.setNotification = function (msg, id) {
                        this.notifications[id] = msg;
                    };
                    return ControlMock;
                }(VisibleObject));
                Mocks.ControlMock = ControlMock;
                var TabMock = /** @class */ (function (_super) {
                    __extends(TabMock, _super);
                    function TabMock() {
                        var _this = _super.call(this) || this;
                        _this.mainSection = new SectionMock();
                        _this._sections = { "mainSection": _this.mainSection };
                        _this.sections = {
                            get: _this.getSection.bind(_this)
                        };
                        return _this;
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
                var SectionMock = /** @class */ (function (_super) {
                    __extends(SectionMock, _super);
                    function SectionMock() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return SectionMock;
                }(VisibleObject));
                Mocks.SectionMock = SectionMock;
            })(Mocks = UnitTests.Mocks || (UnitTests.Mocks = {}));
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
