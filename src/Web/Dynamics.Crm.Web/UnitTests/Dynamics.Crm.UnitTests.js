Dynamics.Crm.Diagnostics.debug = false;
Dynamics.Crm.Diagnostics.useConsoleLogger();

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

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Attributes.get", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Returns null for missing attribute when not required", function () {
                    var attribute = Crm.Forms.Attributes.get("notAge", false);
                    expect(attribute).toBeNull();
                });
                it("Throws error for missing attribute when required", function () {
                    expect(function () { return Crm.Forms.Attributes.get("notAge", true); }).toThrowError(Error);
                });
                it("Throws error for missing attribute when required by default", function () {
                    expect(function () { return Crm.Forms.Attributes.get("notAge"); }).toThrowError(Error);
                });
                it("Returns attribute", function () {
                    var attribute = Crm.Forms.Attributes.get("age", false);
                    var expected = window["Xrm"].Page.ageAttribute;
                    expect(attribute).toBeDefined();
                    expect(attribute).not.toBeNull();
                    expect(attribute).toBe(expected);
                });
            });
            describe("Attributes.setRequiredLevel", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for null or undefined array", function () {
                    expect(function () { return Crm.Forms.Attributes.setRequired(null); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRequired(undefined); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRequired([]); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setOptional(null); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setOptional(undefined); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setOptional([]); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRecommended(null); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRecommended(undefined); }).not.toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.setRecommended([]); }).not.toThrowError(Error);
                });
                it("Sets attribute required level to required", function () {
                    var expected = window["Xrm"].Page.ageAttribute;
                    Crm.Forms.Attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                    Crm.Forms.Attributes.setOptional(["age"]);
                    Crm.Forms.Attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    Crm.Forms.Attributes.setRequired(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("required");
                });
                it("Sets attribute required level to optional", function () {
                    var expected = window["Xrm"].Page.ageAttribute;
                    Crm.Forms.Attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                    Crm.Forms.Attributes.setRequired(["age"]);
                    Crm.Forms.Attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    Crm.Forms.Attributes.setOptional(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("none");
                });
                it("Sets attribute required level to recommended", function () {
                    var expected = window["Xrm"].Page.ageAttribute;
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                    Crm.Forms.Attributes.setOptional(["age"]);
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                    Crm.Forms.Attributes.setRequired(["age"]);
                    Crm.Forms.Attributes.setRecommended(["age"]);
                    expect((expected.getRequiredLevel() || "").toLocaleLowerCase()).toBe("recommended");
                });
            });
            describe("Attributes.notifications", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Throws error for null or undefined attribute", function () {
                    expect(function () { return Crm.Forms.Attributes.showNotification(null, "", ""); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.showNotification(null, "", ""); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.showNotification(undefined, "", ""); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Attributes.showNotification(undefined, "", ""); }).toThrowError(Error);
                });
                it("Shows/hides control notification", function () {
                    var age = window["Xrm"].Page.ageAttribute;
                    var controls = [
                        age.controls["age"],
                        age.controls["age_header"],
                        age.controls["age_footer"]
                    ].filter(function (c) { return !!c; });
                    var msg = "Hello world!";
                    var id = "notif";
                    Crm.Forms.Attributes.showNotification(age, msg, id);
                    for (var i = 0; i < controls.length; i++) {
                        var control = controls[i];
                        expect(control.notifications[id]).toBe(msg);
                    }
                    Crm.Forms.Attributes.hideNotification(age, id);
                    for (var i = 0; i < controls.length; i++) {
                        var control = controls[i];
                        expect(control.notifications[id]).toBeNull();
                    }
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("CacheService.get", function () {
                it("Throws error for null key", function () {
                    var cache = new Caching.CacheService();
                    expect(function () { return cache.get(null); }).toThrowError(Error);
                });
                it("Throws error for undefined key", function () {
                    var cache = new Caching.CacheService();
                    expect(function () { return cache.get(undefined); }).toThrowError(Error);
                });
                it("Returns null for missing key", function () {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var cached = cache.get(key);
                    expect(cached).toBeDefined();
                    expect(cached).toBeNull();
                });
            });
            describe("CacheService.set", function () {
                it("Throws error for null key", function () {
                    var cache = new Caching.CacheService();
                    expect(function () { return cache.set(null, {}); }).toThrowError(Error);
                });
                it("Throws error for undefined key", function () {
                    var cache = new Caching.CacheService();
                    expect(function () { return cache.set(undefined, {}); }).toThrowError(Error);
                });
            });
            describe("CacheService.get/CacheService.set", function () {
                it("Returns null if expired", function (done) {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var value = { name: "This is a test object" };
                    var sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(function () {
                        var cached = cache.get(key);
                        expect(cached).toBeDefined();
                        expect(cached).toBeNull();
                        done();
                    }, 1500);
                });
                it("Returns new item if expired when a factory function is provided", function (done) {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var counter = 0;
                    var factory = function () { return { n: ++counter }; };
                    var value = factory();
                    var sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(function () {
                        var cached = cache.get(key, factory);
                        expect(cached).toBeDefined();
                        expect(cached).not.toBeNull();
                        expect(cached.n).not.toBe(value.n);
                        expect(cached.n).toBe(counter);
                        done();
                    }, 1500);
                });
                it("Returns cached item", function (done) {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var value = { name: "This is a test object" };
                    var sec = 1;
                    cache.set(key, value, sec);
                    setTimeout(function () {
                        var cached = cache.get(key);
                        expect(cached).toBeDefined();
                        expect(cached).not.toBeNull();
                        expect(cached.name).toBeDefined();
                        expect(cached.name).not.toBeNull();
                        expect(cached.name).toBe(value.name);
                        done();
                    }, 500);
                });
                it("Overrides cached item", function () {
                    var cache = new Caching.CacheService();
                    var key = "key";
                    var sec = 1;
                    cache.set(key, 1, sec);
                    cache.set(key, 2, sec);
                    var cached = cache.get(key);
                    expect(cached).toBeDefined();
                    expect(cached).not.toBeNull();
                    expect(cached).not.toBe(1);
                    expect(cached).toBe(2);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Controls.get", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Returns null for missing control when not required", function () {
                    var control = Crm.Forms.Controls.get("notAge", false);
                    expect(control).toBeNull();
                });
                it("Throws error for missing control when required", function () {
                    expect(function () { return Crm.Forms.Controls.get("notAge", true); }).toThrowError(Error);
                });
                it("Throws error for missing control when required by default", function () {
                    expect(function () { return Crm.Forms.Controls.get("notAge"); }).toThrowError(Error);
                });
            });
            describe("Controls.setDisabled", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing control", function () {
                    expect(function () { return Crm.Forms.Controls.setDisabled(["notAge"], true, true); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setDisabled(["notAge"], false, true); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setDisabled(["notAge"], true, false); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setDisabled(["notAge"], false, false); }).not.toThrowError();
                });
                it("Sets all disabled", function () {
                    var control = window["Xrm"].Page.controls.age;
                    var header = window["Xrm"].Page.controls.age_header;
                    Crm.Forms.Controls.setDisabled(["age"], false, true);
                    Crm.Forms.Controls.setDisabled(["age"], true, true);
                    expect(control.getDisabled()).toBe(true);
                    expect(header.getDisabled()).toBe(true);
                });
                it("Sets control in body disabled", function () {
                    var control = window["Xrm"].Page.controls.age;
                    var header = window["Xrm"].Page.controls.age_header;
                    Crm.Forms.Controls.setDisabled(["age"], false, true);
                    Crm.Forms.Controls.setDisabled(["age"], true, false);
                    expect(control.getDisabled()).toBe(true);
                    expect(header.getDisabled()).toBe(false);
                });
            });
            describe("Controls.setVisible", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing control", function () {
                    expect(function () { return Crm.Forms.Controls.setVisible(["notAge"], true, true); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setVisible(["notAge"], false, true); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setVisible(["notAge"], true, false); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Controls.setVisible(["notAge"], false, false); }).not.toThrowError();
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Sections.get", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Returns null for missing section when not required", function () {
                    var tab = Crm.Forms.Sections.get("invalidTab", "invalidSection", false);
                    expect(tab).toBeNull();
                    var tab = Crm.Forms.Sections.get("mainTab", "invalidSection", false);
                    expect(tab).toBeNull();
                });
                it("Throws error for missing section when required", function () {
                    expect(function () { return Crm.Forms.Sections.get("invalidTab", "invalidSection", true); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Sections.get("mainTab", "invalidSection", true); }).toThrowError(Error);
                });
                it("Throws error for missing section when required by default", function () {
                    expect(function () { return Crm.Forms.Sections.get("invalidTab", "invalidSection"); }).toThrowError(Error);
                    expect(function () { return Crm.Forms.Sections.get("mainTab", "invalidSection", true); }).toThrowError(Error);
                });
                it("Returns existing section", function () {
                    var tab = Crm.Forms.Sections.get("mainTab", "mainSection");
                    expect(tab).toBeDefined();
                    expect(tab).not.toBeNull();
                });
            });
            describe("Sections.setVisible", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing section", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    expect(function () { return Crm.Forms.Sections.show(["invalidTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Sections.hide(["invalidTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Sections.show(["mainTab|invalidSection"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Sections.hide(["mainTab|invalidSection"]); }).not.toThrowError();
                });
                it("Sets section visibility to true", function () {
                    var mainSection = window["Xrm"].Page.mainTab.mainSection;
                    Crm.Forms.Sections.hide(["mainTab|mainSection"]);
                    Crm.Forms.Sections.show(["mainTab|mainSection"]);
                    expect(mainSection.getVisible()).toBe(true);
                    Crm.Forms.Sections.hide(["mainTab|mainSection"]);
                    Crm.Forms.Sections.show(["mainTab|mainSection"], true);
                    expect(mainSection.getVisible()).toBe(true);
                });
                it("Sets section visibility to false", function () {
                    var mainSection = window["Xrm"].Page.mainTab.mainSection;
                    Crm.Forms.Sections.show(["mainTab|mainSection"]);
                    Crm.Forms.Sections.hide(["mainTab|mainSection"]);
                    expect(mainSection.getVisible()).toBe(false);
                    Crm.Forms.Sections.show(["mainTab|mainSection"]);
                    Crm.Forms.Sections.hide(["mainTab|mainSection"], true);
                    expect(mainSection.getVisible()).toBe(false);
                });
                it("Does not change section visibility when condition is not satisfied", function () {
                    var mainSection = window["Xrm"].Page.mainTab.mainSection;
                    Crm.Forms.Sections.hide(["mainTab|mainSection"]);
                    Crm.Forms.Sections.show(["mainTab|mainSection"], false);
                    expect(mainSection.getVisible()).toBe(false);
                    Crm.Forms.Sections.show(["mainTab|mainSection"]);
                    Crm.Forms.Sections.hide(["mainTab|mainSection"], false);
                    expect(mainSection.getVisible()).toBe(true);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Tabs.get", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Returns null for missing tab when not required", function () {
                    var tab = Crm.Forms.Tabs.get("invalidTab", false);
                    expect(tab).toBeNull();
                });
                it("Throws error for missing tab when required", function () {
                    expect(function () { return Crm.Forms.Tabs.get("invalidTab", true); }).toThrowError(Error);
                });
                it("Throws error for missing tab when required by default", function () {
                    expect(function () { return Crm.Forms.Tabs.get("invalidTab"); }).toThrowError(Error);
                });
                it("Returns existing tab", function () {
                    var tab = Crm.Forms.Tabs.get("mainTab");
                    expect(tab).toBeDefined();
                    expect(tab).not.toBeNull();
                });
            });
            describe("Tabs.setVisible", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing tab", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    expect(function () { return Crm.Forms.Tabs.show(["invalidTab"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Tabs.hide(["invalidTab"]); }).not.toThrowError();
                });
                it("Sets tab visibility to true", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.hide(["mainTab"]);
                    Crm.Forms.Tabs.show(["mainTab"]);
                    expect(mainTab.getVisible()).toBe(true);
                    Crm.Forms.Tabs.hide(["mainTab"]);
                    Crm.Forms.Tabs.show(["mainTab"], true);
                    expect(mainTab.getVisible()).toBe(true);
                });
                it("Sets tab visibility to false", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.show(["mainTab"]);
                    Crm.Forms.Tabs.hide(["mainTab"]);
                    expect(mainTab.getVisible()).toBe(false);
                    Crm.Forms.Tabs.show(["mainTab"]);
                    Crm.Forms.Tabs.hide(["mainTab"], true);
                    expect(mainTab.getVisible()).toBe(false);
                });
                it("Does not change tab visibility when condition is not satisfied", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.hide(["mainTab"]);
                    Crm.Forms.Tabs.show(["mainTab"], false);
                    expect(mainTab.getVisible()).toBe(false);
                    Crm.Forms.Tabs.show(["mainTab"]);
                    Crm.Forms.Tabs.hide(["mainTab"], false);
                    expect(mainTab.getVisible()).toBe(true);
                });
            });
            describe("Tabs.collapseExpand", function () {
                beforeEach(function () {
                    window["Xrm"] = { Page: new UnitTests.Mocks.PageMock() };
                });
                afterEach(function () {
                    window["Xrm"] = undefined;
                });
                it("Does not throw error for missing tab", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    expect(function () { return Crm.Forms.Tabs.expand(["invalidTab"]); }).not.toThrowError();
                    expect(function () { return Crm.Forms.Tabs.collpase(["invalidTab"]); }).not.toThrowError();
                });
                it("Sets tab to be expanded", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.collpase(["mainTab"]);
                    Crm.Forms.Tabs.expand(["mainTab"]);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                    Crm.Forms.Tabs.collpase(["mainTab"]);
                    Crm.Forms.Tabs.expand(["mainTab"], true);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                });
                it("Sets tab to be collapsed", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.expand(["mainTab"]);
                    Crm.Forms.Tabs.collpase(["mainTab"]);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                    Crm.Forms.Tabs.expand(["mainTab"]);
                    Crm.Forms.Tabs.collpase(["mainTab"], true);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                });
                it("Does not change tab state when condition is not satisfied", function () {
                    var mainTab = window["Xrm"].Page.mainTab;
                    Crm.Forms.Tabs.expand(["mainTab"]);
                    Crm.Forms.Tabs.collpase(["mainTab"], false);
                    expect(mainTab.getDisplayState()).toBe("expanded");
                    Crm.Forms.Tabs.collpase(["mainTab"]);
                    Crm.Forms.Tabs.expand(["mainTab"], false);
                    expect(mainTab.getDisplayState()).toBe("collapsed");
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Tasks.execute", function () {
                it("Returns empty array with null tasks", function () {
                    var results = Dynamics.Crm.Tasks.execute(null);
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(0);
                });
                it("Returns empty array with undefined tasks", function () {
                    var results = Dynamics.Crm.Tasks.execute(undefined);
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(0);
                });
                it("Force execute on all tasks", function () {
                    var counter = 0;
                    var tasks = [
                        function () { counter++; return false; },
                        function () { counter++; },
                        function () { counter++; return true; },
                        function () { counter++; throw new Error("Dummy error"); },
                        function () { counter++; return false; }
                    ];
                    var results = Dynamics.Crm.Tasks.execute(tasks, { executeAll: true, continueOnError: true });
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(tasks.length);
                    expect(counter).toEqual(tasks.length);
                });
                it("Stops on third tasks", function () {
                    var counter = 0;
                    var tasks = [
                        function () { counter++; return false; },
                        function () { counter++; },
                        function () { counter++; return true; },
                        function () { counter++; return false; }
                    ];
                    var results = Dynamics.Crm.Tasks.execute(tasks);
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(3);
                    expect(counter).toEqual(3);
                });
                it("Stops on first error", function () {
                    var counter = 0;
                    var tasks = [
                        function () { counter++; return false; },
                        function () { counter++; throw new Error("Dummy error"); },
                        function () { counter++; return false; }
                    ];
                    var results = Dynamics.Crm.Tasks.execute(tasks);
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(2);
                    expect(counter).toEqual(2);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));

var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Validation.ensureNotNullOrUndefined", function () {
                it("Throws error for undefined argument", function () {
                    expect(function () { return Validation.ensureNotNullOrUndefined(undefined, undefined); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined(undefined, null); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined(undefined, ""); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined(undefined, "abc"); }).toThrowError(Error);
                });
                it("Throws error for null argument", function () {
                    expect(function () { return Validation.ensureNotNullOrUndefined(null, undefined); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined(null, null); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined(null, ""); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined(null, "abc"); }).toThrowError(Error);
                });
                it("Passes validation for non null or undefined values", function () {
                    expect(function () { return Validation.ensureNotNullOrUndefined("", undefined); }).not.toThrowError();
                    expect(function () { return Validation.ensureNotNullOrUndefined(0, null); }).not.toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined(new Date(), ""); }).not.toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined([], "abc"); }).not.toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrUndefined({}, "abc"); }).not.toThrowError(Error);
                });
            });
            describe("Validation.ensureNotNullOrEmpty", function () {
                it("Throws error for undefined argument", function () {
                    expect(function () { return Validation.ensureNotNullOrEmpty(undefined, undefined); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty(undefined, null); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty(undefined, ""); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty(undefined, "abc"); }).toThrowError(Error);
                });
                it("Throws error for null argument", function () {
                    expect(function () { return Validation.ensureNotNullOrEmpty(null, undefined); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty(null, null); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty(null, ""); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty(null, "abc"); }).toThrowError(Error);
                });
                it("Throws error for empty string argument", function () {
                    expect(function () { return Validation.ensureNotNullOrEmpty("", undefined); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty("", null); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty("", ""); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNotNullOrEmpty("", "abc"); }).toThrowError(Error);
                });
                it("Passes validation for non null or empty string values", function () {
                    expect(function () { return Validation.ensureNotNullOrEmpty("x", undefined); }).not.toThrowError();
                    expect(function () { return Validation.ensureNotNullOrEmpty("xyz", null); }).not.toThrowError();
                    expect(function () { return Validation.ensureNotNullOrEmpty("xyz", ""); }).not.toThrowError();
                    expect(function () { return Validation.ensureNotNullOrEmpty("xyz", "abc"); }).not.toThrowError();
                });
            });
            describe("Validation.ensureNumberInRange", function () {
                it("Throws error for undefined value", function () {
                    expect(function () { return Validation.ensureNumberInRange(undefined); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(undefined, 1); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(undefined, null, 1); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(undefined, 1, 1); }).toThrowError(Error);
                });
                it("Throws error for null value", function () {
                    expect(function () { return Validation.ensureNumberInRange(null); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(null, 1); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(null, null, 1); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(null, 1, 1); }).toThrowError(Error);
                });
                it("Throws error for non-numeric value", function () {
                    var func = Validation.ensureNumberInRange;
                    expect(function () { return func({}); }).toThrowError(Error);
                    expect(function () { return func("", 1); }).toThrowError(Error);
                    expect(function () { return func([], null, 1); }).toThrowError(Error);
                });
                it("Throws error for out of range numeric value", function () {
                    expect(function () { return Validation.ensureNumberInRange(0, 1); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(0, null, -1); }).toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(0, 1, 2); }).toThrowError(Error);
                });
                it("Passes validation for in range numeric value", function () {
                    expect(function () { return Validation.ensureNumberInRange(1.5, 1, 2); }).not.toThrowError(Error);
                    expect(function () { return Validation.ensureNumberInRange(0, -1, 1); }).not.toThrowError(Error);
                });
            });
            describe("Validation.Strings.left", function () {
                it("Does not throw error for null or undefined value", function () {
                    expect(function () { return Validation.Strings.left(undefined, 5); }).not.toThrowError(Error);
                    expect(function () { return Validation.Strings.left(null, 5); }).not.toThrowError(Error);
                });
                it("Returns specified number of chars from left side", function () {
                    expect(Validation.Strings.left("", 0)).toEqual("");
                    expect(Validation.Strings.left("", 5)).toEqual("");
                    expect(Validation.Strings.left("abc", 0)).toEqual("");
                    expect(Validation.Strings.left("abc", 1)).toEqual("a");
                    expect(Validation.Strings.left("abc", 2)).toEqual("ab");
                    expect(Validation.Strings.left("abc", 3)).toEqual("abc");
                    expect(Validation.Strings.left("abc", 5)).toEqual("abc");
                });
            });
            describe("Validation.Strings.right", function () {
                it("Does not throw error for null or undefined value", function () {
                    expect(function () { return Validation.Strings.right(undefined, 5); }).not.toThrowError(Error);
                    expect(function () { return Validation.Strings.right(null, 5); }).not.toThrowError(Error);
                });
                it("Returns specified number of chars from right side", function () {
                    expect(Validation.Strings.right("", 0)).toEqual("");
                    expect(Validation.Strings.right("", 5)).toEqual("");
                    expect(Validation.Strings.right("abc", 0)).toEqual("");
                    expect(Validation.Strings.right("abc", 1)).toEqual("c");
                    expect(Validation.Strings.right("abc", 2)).toEqual("bc");
                    expect(Validation.Strings.right("abc", 3)).toEqual("abc");
                    expect(Validation.Strings.right("abc", 5)).toEqual("abc");
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));