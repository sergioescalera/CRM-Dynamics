var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            var Mocks;
            (function (Mocks) {
                "use strict";
                class VisibleObject {
                    getVisible() {
                        return this._visible;
                    }
                    setVisible(value) {
                        this._visible = value;
                    }
                }
                class PageMock {
                    constructor() {
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
                    getTab(param) {
                        if (typeof param === "string") {
                            return this.tabs[param];
                        }
                        return null;
                    }
                    getAttribute(name) {
                        return this.attributes[name];
                    }
                    getControl(name) {
                        return this.controls[name];
                    }
                }
                Mocks.PageMock = PageMock;
                class AttributeMock {
                    constructor(name, header, footer) {
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
                    forEach(func) {
                        let keys = [this.name, this.name + "_header", this.name + "_footer"];
                        for (let i = 0; i < keys.length; i++) {
                            let control = this.controls[keys[i]];
                            if (control) {
                                func(control);
                            }
                        }
                    }
                    getRequiredLevel() {
                        return this._requiredLevel;
                    }
                    setRequiredLevel(value) {
                        this._requiredLevel = value;
                    }
                    addOnChange(handler) { }
                    removeOnChange(handler) { }
                    fireOnChange() { }
                    getAttributeType() {
                        return "string";
                    }
                    getIsDirty() {
                        return true;
                    }
                    getName() {
                        return this.name;
                    }
                    getParent() {
                        return null;
                    }
                    getSubmitMode() {
                        return "dirty";
                    }
                    getUserPrivilege() {
                        return null;
                    }
                    getValue() {
                        return this.val;
                    }
                    isValid() {
                        return true;
                    }
                    setIsValid(value, message) {
                    }
                    setSubmitMode(mode) { }
                    setValue(value) {
                        this.val = value;
                    }
                }
                Mocks.AttributeMock = AttributeMock;
                class ControlMock extends VisibleObject {
                    constructor(name) {
                        super();
                        this.name = name;
                        this.notifications = {};
                    }
                    getDisabled() {
                        return this._disabled;
                    }
                    setDisabled(value) {
                        this._disabled = value;
                    }
                    clearNotification(id) {
                        this.setNotification(null, id);
                    }
                    setNotification(msg, id) {
                        this.notifications[id] = msg;
                    }
                }
                Mocks.ControlMock = ControlMock;
                class TabMock extends VisibleObject {
                    constructor() {
                        super();
                        this.mainSection = new SectionMock();
                        this._sections = { "mainSection": this.mainSection };
                        this.sections = {
                            get: this.getSection.bind(this)
                        };
                    }
                    getDisplayState() {
                        return this._displayState;
                    }
                    setDisplayState(value) {
                        this._displayState = value;
                    }
                    getSection(param) {
                        if (typeof param === "string") {
                            return this._sections[param];
                        }
                        return null;
                    }
                }
                Mocks.TabMock = TabMock;
                class SectionMock extends VisibleObject {
                }
                Mocks.SectionMock = SectionMock;
            })(Mocks = UnitTests.Mocks || (UnitTests.Mocks = {}));
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
