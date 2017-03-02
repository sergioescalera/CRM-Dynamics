module Dynamics.Crm.UnitTests.Mocks {

    "use strict";

    export class PageMock {

        ageAttribute: AttributeMock;
        attributes: any;
        mainTab: TabMock;        
        tabs: any;
        ui: any;

        constructor() {
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

        getTab(param: any): TabMock {

            if (typeof param === "string") {

                return this.tabs[param];
            }

            return null;
        }

        getAttribute(name: string): AttributeMock {

            return this.attributes[name];
        }
    }

    export class AttributeMock {


    }

    export class TabMock {

        private _visible: boolean;
        private _displayState: string;

        getVisible(): boolean {
            return this._visible;
        }
        setVisible(value: boolean): void {
            this._visible = value;
        }

        getDisplayState(): string {
            return this._displayState;
        }
        setDisplayState(value: string): void {
            this._displayState = value;
        }
    }
}