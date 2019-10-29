
module Dynamics.Crm.UnitTests.Mocks {

    "use strict";

    class VisibleObject {

        private _visible: boolean;

        getVisible(): boolean {
            return this._visible;
        }
        setVisible(value: boolean): void {
            this._visible = value;
        }
    }

    export class PageMock implements FormContext {

        ageAttribute: AttributeMock;
        attributes: any;
        controls: any;
        mainTab: TabMock;
        tabs: any;
        ui: any;
        data: any;
        process: any;

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

        getTab(param: any): Tab {

            if (typeof param === "string") {

                return this.tabs[param];
            }

            return null;
        }

        getAttribute(name: string): Attribute {

            return this.attributes[name];
        }

        getControl(name: string): Control {

            return this.controls[name];
        }
    }

    export class AttributeMock implements Attribute {

        controls: any;
        name: string;
        val: AttributeValue;

        private _requiredLevel: AttributeRequiredLevel;

        constructor(name: string, header?: boolean, footer?: boolean) {

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

        forEach(func: (c: Control) => void): void {
            
            let keys = [this.name, this.name + "_header", this.name + "_footer"];

            for (let i = 0; i < keys.length; i++) {

                let control = this.controls[keys[i]];

                if (control) {                    
                    func(control);
                }
            }
        }

        getRequiredLevel(): AttributeRequiredLevel {

            return this._requiredLevel;
        }
        setRequiredLevel(value: AttributeRequiredLevel): void {

            this._requiredLevel = value;
        }      

        addOnChange(handler: (ctx: ExecutionContext) => void): void {}
        removeOnChange(handler: (ctx: ExecutionContext) => void): void {}

        fireOnChange(): void { }
        getAttributeType(): AttributeType {

            return "string";
        }

        getIsDirty(): boolean {

            return true;
        }
        getName(): string {

            return this.name;
        }
        getParent(): XrmEntity {
            return null;
        }
        getSubmitMode(): AttributeSubmitMode {
            return "dirty";
        }
        getUserPrivilege(): AttributeUserPrivilege {
            return null;
        }
        getValue(): any {
            return this.val;
        }
        isValid(): boolean {
            return true;
        }
        setIsValid(value: boolean, message: string): void {

        }
        setSubmitMode(mode: AttributeSubmitMode): void { }

        setValue(value: AttributeValue): void {

            this.val = value;
        }
    }

    export class ControlMock extends VisibleObject {

        private _disabled: boolean;

        notifications: any;
        name: string;

        constructor(name: string) {

            super();

            this.name = name;
            this.notifications = {};
        }

        getDisabled(): boolean {
            return this._disabled;
        }
        setDisabled(value: boolean): void {
            this._disabled = value;
        }

        clearNotification(id: string): void {
            this.setNotification(null, id);
        }
        setNotification(msg: string, id: string): void {
            this.notifications[id] = msg;
        }
    }

    export class TabMock extends VisibleObject {

        private _displayState: string;
        private _sections: any;

        mainSection: SectionMock;
        sections: any;

        constructor() {

            super();

            this.mainSection = new SectionMock();
            this._sections = { "mainSection": this.mainSection };

            this.sections = {
                get: this.getSection.bind(this)
            };
        }

        getDisplayState(): string {
            return this._displayState;
        }
        setDisplayState(value: string): void {
            this._displayState = value;
        }

        getSection(param: any): SectionMock {

            if (typeof param === "string") {

                return this._sections[param];
            }

            return null;
        }
    }

    export class SectionMock extends VisibleObject {
    }
}