Dynamics.Crm.Diagnostics.useConsoleLogger();

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
                    expect(function () { return Crm.Forms.Tabs.get("notAge", true); }).toThrowError(Error);
                });
                it("Throws error for missing attribute when required by default", function () {
                    expect(function () { return Crm.Forms.Tabs.get("notAge"); }).toThrowError(Error);
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