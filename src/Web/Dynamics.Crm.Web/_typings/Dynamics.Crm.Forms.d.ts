declare interface IDynamics {
    Crm: ICrmDynamics
}

declare interface ICrmDynamics {
    Core: ICrmCore;
    Diagnostics: ICrmDiagnostics;
    Dialogs: ICrmDialogs;
    Forms: ICrmForms;
    OData: ICrmOData;
    Reports: ICrmReports;
    ScriptManager: IScriptManager;
    Tasks: ITasks;
    User: ICrmUser;
}

declare interface ICrmCore {
    parseIdentifier(idStr: string): string;
    identifiersAreEqual(id: string, otherId: string): boolean;
}

declare interface ICrmForms {
    Attributes: ICrmAttributes;
    Controls: ICrmControls;
    Navigation: ICrmNavigation;
    Tabs: ICrmTabs;
    Sections: ICrmSections;
    getClientType(): string;
    getFormType(): number;
    getFormFactor(): number;
    getIsDesktop(): boolean;
    getIsDirty(): boolean;
    isCreateForm(): boolean;
    isUpdateForm(): boolean;
    supportsIFrames(): boolean;
}

declare interface ICrmAttributes {
    get(attributeName: string, required?: boolean): Attribute;

    setOptional(attributeNames: string[]): void;
    setRequired(attributeNames: string[]): void;
    setRecommended(attributeNames: string[]): void;
    setRequiredLevel(attributeNames: string[], requirementLevel: string): void;
    setRequiredOrOptional(attributeName: string, required: boolean, attributeRequired?: boolean): void;

    hideOptions(attribute: Attribute, hide?: (o: number) => boolean);

    getLookupValue(attributeName: string, required?: boolean): LookupControlItem;
    setLookupValue(attributeName: string, entityType: string, name: string, id: string, required?: boolean): void;

    showNotification(attribute: Attribute, message: string, messageId: string): void;
    hideNotification(attribute: Attribute, messageId: string): void;
}

declare interface ICrmControls {
    get(controlName: string, required?: boolean): Control;

    disable(attributeNames: string[], applyToAll?: boolean): void;
    enable(attributeNames: string[], applyToAll?: boolean): void;
    setDisabled(attributeNames: string[], disabled: boolean, applyToAll?: boolean): void;

    show(attributeNames: string[], condition?: boolean, applyToAll?: boolean): void;
    hide(attributeNames: string[], condition?: boolean, applyToAll?: boolean): void
    setVisible(attributeNames: string[], value: boolean, applyToAll?: boolean);
}

declare interface ICrmNavigation {
    get(itemName: string, required?: boolean): NavigationItem;
    show(items: Array<string>): void;
    hide(items: Array<string>): void;
    setVisible(items: Array<string>, visible: boolean): void;
}

declare interface ICrmTabs {
    get(tabName: string, required?: boolean): Tab;
    show(tabNames: string[], condition?: boolean): void;
    hide(tabNames: string[], condition?: boolean): void;
    setVisible(tabNames: string[], value: boolean): void;
    expand(tabNames: string[], condition?: boolean): void;
    collpase(tabNames: string[], condition?: boolean): void;
    expandCollapse(tabNames: string[], value: boolean): void;
}

declare interface ICrmSections {
    get(tabName: string, sectionName: string, required?: boolean): Section;
    show(names: string[], condition?: boolean): void;
    hide(names: string[], condition?: boolean): void;
    setVisible(names: string[], value: boolean): void;
}

declare interface ICrmDialogs {
    open(
        dialogId: string,
        entityName?: string,
        entityId?: string,
        width?: number,
        height?: number,
        modal?: string): void;
    getUrl(
        dialogId: string,
        entityName?: string,
        entityId?: string): string;
    alert(message: string, title: string): JQueryPromise<void>;
    confirm(message: string, title: string): JQueryPromise<boolean>;
}

declare interface ICrmOData {
    retrieve(
        entityName: string,
        entitySetName: string,
        entityId: string,
        attributes: string[],
        expand?: string[]): JQueryPromise<IEntity>
    retrieveMultiple(
        entityName: string,
        entitySetName: string,
        attributes: string[],
        filters: string[]): JQueryPromise<IEntity[]>
}

declare interface IEntity {
    id?: string;
    type: string;    
}

declare interface ICrmUser {
    getId(): string;
}

declare interface ICrmDiagnostics {
    log: ILogger;
    debug: boolean;
    trace: boolean;
}

declare interface ICrmReports {
    getUrl(
        reportName: string,
        reportId: string,
        entityId?: string,
        entityCode?: string,
        action?: string): string;
}

declare interface IScriptManager {
    loadScripts(
        scripts: string[],
        document?: Document): JQueryPromise<JQueryPromise<void>[]>;
    loadScript(
        script: string,
        document?: Document): JQueryPromise<void>;
    loadStylesheets(
        stylesheets: string[],
        document?: Document): void;
    loadStylesheet(
        stylesheet: string,
        document?: Document): void
}

declare interface ITasks {
    execute(tasks: (() => any)[], config?: ITasksConfig): any[];
}

declare interface ITasksConfig {
    continueOnError?: boolean;
    executeAll?: boolean;
}

declare interface IError extends Error {
    description?: string;
    stack?: string;
}

declare interface ILogger {
    Error(message: string, error: IError): void;
    Message(message: string): void;
    Warning(message: string): void;
}
