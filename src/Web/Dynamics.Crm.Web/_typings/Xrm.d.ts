declare var Xrm: Xrm;
declare var ExecutionObj: ExecutionContext;
declare var GetGlobalContext: GetGlobalContext;

interface GetGlobalContext {
    (): Context;
}

interface Xrm {
    Page: Page;
    Utility: Utility;
    Navigation: Navigation;
}

interface Utility {
    getGlobalContext(): Context;
}

interface Navigation {
    openAlertDialog(strings: AlertDialogStrings, options?: OpenOptions): DialogResult;
    openConfirmDialog(strings: ConfirmDialogStrings, options?: OpenOptions): DialogResult;
    openErrorDialog(options?: ErrorOptions): DialogResult;
    openFile(file: FileProperties, options?: number); /* 1: Open, 2: Save */
    openForm(options: EntityFormOptions, formParameters?: any): void;
    openUrl(url: string, options?: OpenOptions): void;
    openWebResource(name: string, options?: OpenWindowOptions, data?: string);
}

interface AlertDialogStrings {
    confirmButtonLabel?: string;
    text: string;
}

interface OpenOptions {
    height?: number;
    width?: number;
}

interface OpenWindowOptions extends OpenOptions {
    openInNewWindow?: boolean;
}

interface ConfirmDialogStrings {
    cancelButtonLabel?: string;
    confirmButtonLabel?: string;
    subtitle?: string;
    text: string;
    title?: string;
}

interface ErrorOptions {
    details?: string;
    errorCode?: number;
    message?: string;
}

interface DialogResult {
    then(successCallback?: Function, errorCallback?: Function): void;
}

interface FileProperties {
    fileContent: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
}

interface EntityFormOptions extends OpenWindowOptions {
    cmdbar?: boolean;
    createFromEntity?: LookupControlItem;
    entityId?: string;
    entityName?: string;
    formId?: string;
    navBar?: "on" | "off" | "entity";
    windowPosition?: number; // 1: Center, 2: Side
    useQuickCreateForm?: boolean;
}

interface Page {
    data: data;
    ui: ui;
    getAttribute(): Attribute[]; 
    getAttribute(argument: string): Attribute;
    getAttribute(argument: number): Attribute;
    getAttribute(argument: AttributeFunctionCallback): Attribute[];
    getControl(): Control[];
    getControl(argument: string): Control;
    getControl(argument: number): Control;
    getControl(argument: AttributeFunctionCallback): Control[];
}

interface ui {
    clearFormNotification(uniqueId: string): boolean;
    setFormNotification(message: string, level: string, uniqueId: string): boolean;
    setFormHtmlNotification(message: string, level: string, uniqueId: string): boolean;
    close(): void;
    getCurrentControl(): Object;
    getFormType(): number;
    getViewPortHeight(): number;
    getViewPortWidth(): number;
    refreshRibbon(): void;
    controls: Collection<Control>;
    navigation: Navigation;
    formSelector: FormSelector;
    tabs: TabsCollection;
    process: ProcessUI;
}

interface FormSelector {
    items: Collection<FormSelectorItem>;
    getCurrentItem(): FormSelectorItem;
}

interface FormSelectorItem {
    getId(): string;
    getLabel(): string;
    navigate(): void;
}

interface Navigation {
    items: NavigationItemCollection;
}

interface TabsCollection {
    forEach(argument: TabFunctionCallback): void;
    get(): Tab[];
    get(argument: string): Tab;
    get(argument: number): Tab;
    get(argument: TabFunctionCallback): Tab[];
    getLength(): number;
}

interface DialogCallback {
    (): any;
}

interface TabFunctionCallback {
    (tab: Tab, index: number): any;
}

interface NavigationFunctionCallback {
    (navigationItem: NavigationItem, index: number): any;
}

interface SectionFunctionCallback {
    (section: Section, index: number): any;
}

interface ControlFunctionCallback {
    (control: Control, index: number): any;
}

interface AttributeFunctionCallback {
    (attribute: Attribute, index: number): any;
}
interface Tab {
    getDisplayState(): string;
    getLabel(): string;
    getParent();
    getVisible();
    setDisplayState(state: string);
    setFocus();
    setLabel();
    setVisible(isVisible: boolean);
    sections: TabSections;
}
interface Section {
    getLabel(): string;
    getName(): string;
    getParent(): Object;
    getVisible(): boolean;
    setLabel(arg: string): void;
    setVisible(arg: boolean): void;
    controls: Collection<Control>;

}
interface TabSections {
    forEach(argument: SectionFunctionCallback);
    get(): Section[];
    get(argument: string): Section;
    get(argument: number): Section;
    get(argument: AttributeFunctionCallback): Section[];
    getLength(): number;
}

interface NavigationArray {
    [index: number]: NavigationItem;
    [index: string]: NavigationItem;
    (index: string): NavigationItem;
    (index: number): NavigationItem;
}
interface NavigationItemCollection {
    forEach(argument: NavigationFunctionCallback): void;
    get(): NavigationArray;
    get(argument: string): NavigationItem;
    get(argument: number): NavigationItem;
    get(argument: AttributeFunctionCallback): NavigationArray;
    getLength(): number;
}

interface Context {
    client: Client;
    organizationSettings: OrganizationSettings;
    userSettings: UserSettings;
    getClientUrl(): string;
    getCurrentAppUrl(): string;
    getVersion(): string;
    prependOrgName(path: string): string;
}

interface Client {
    getFormFactor(): number;
    getClient(): ClientType;
    getClientState(): ClientState;
    isOffline(): boolean;
}

declare type ClientType = "Web" | "Outlook" | "Mobile";
declare type ClientState = "Online" | "Offline";

interface OrganizationSettings {
    attributes: any;
    baseCurrencyId: string;
    defaultCountryCode: string;
    isAutoSaveEnabled: boolean;
    languageId: number;
    organizationId: string;
    uniqueName: string;
    useSkypeProtocol: boolean;
}

interface UserSettings {
    defaultCountryCode: string;
    isGuidedHelpEnabled: boolean;
    isHighContrastEnabled: boolean;
    isRTL: boolean;
    languageId: number;
    securityRoles: string[];
    transactionCurrencyId: string;
    userId: string;
    userName: string;
}

interface data {
    addOnLoad(callback): void;
    removeOnLoad(callback): void;
    refresh(save: boolean): DataRefreshResult;
    save(): DataRefreshResult;
    entity: Entity;
    process: ProcessData;
}

interface DataRefreshError {
    errorCode: number;
    message: string;
}
interface DataRefreshResult {
    then(successCallback: () => void, errorCallback: (error: DataRefreshError) => void);
}

interface Entity {
    attributes: AttributeCollection;
    addOnSave(ev: any): void;
    getDataXml(): string;
    getEntityName(): string;
    getEntitySetName(): string;
    getId(): string;
    getIsDirty(): boolean;
    getPrimaryAttributeValue(): string;
    removeOnSave();
    save(): void;
    save(param: string): void;
}
interface AttributeCollection {
    length: number;
    item(index: number): Attribute;
    forEach(argument: AttributeFunctionCallback): void;
    get(): Attribute[];
    get(argument: string): Attribute;
    get(argument: number): Attribute;
    get(argument: AttributeFunctionCallback): Attribute[];
    getLength(): number;
}

interface Attribute {
    addOnChange(ev: any): void;
    fireOnChange(): void;
    controls: Collection<Control>;
    getAttributeType(): string;
    getFormat(): string;
    getInitialValue(): number;
    getIsDirty(): boolean;
    getMax(): number;
    getMaxLength(): number;
    getMin(): number;
    getName(): string;
    getOption(value: string): Object;
    getOption(value: number): Object;
    getOptions(): Option[];
    getParent(): Entity;
    getPrecision(): number;
    getRequiredLevel(): string;
    getSelectedOption(): Option;
    getSubmitMode(): string;
    getText(): string;
    getUserPrivilege(): UserPrivilege;
    getValue(): any;
    removeOnChange(ev: any): void;
    setRequiredLevel(requirementLevel: string): void;
    setSubmitMode(SubmitMode: string): void;
    setValue(value: any);
}
interface UserPrivilege {
    canRead: boolean;
    canUpdate: boolean;
    canCreate: boolean;
}

interface Lookup {
    Name: string;
    Id: string;
    EntityType: string;
}

interface ExecutionContext {
    getContext(): Context;
    getDepth(): number;
    getEventArgs(): SaveEventArgs;
    getEventSource(): Attribute;
    getSharedVariable(key: string): Object;
    setSharedVariable(key: string, value: Object);
}

interface SaveEventArgs {
    getSaveMode(): number;
    isDefaultPrevented(): boolean;
    preventDefault(): void;
}

interface Option {
    text: string;
    value: string;
}

interface Control {
    addCustomView(viewId: string, entityName: string, viewDisplayName: string, fetchXml: string, layoutXml: string, isDefault: boolean): void;
    addOption(option: Object, index?: number): void;
    clearNotification(uniqueId: string): void;
    clearOptions(): void;
    getAttribute(): Attribute;
    getControlType(): "standard" | "iframe" | "lookup" | "optionset" | "subgrid" | "webresource" | "notes" | "timercontrol" | "kbsearch" | "customcontrol" | "customsubgrid";
    getData(): string;
    getDefaultView(): string;
    getDisabled(): boolean;
    getLabel(): string;
    getName(): string;
    getParent(): Object;
    getSrc(): string;
    getInitialUrl(): string;
    getObject(): HTMLFrameElement;
    getVisible(): boolean;
    refresh(): void;
    removeOption(value: number): void;
    setData(value: string): void;
    setDefaultView(viewGuid: string): void;
    setDisabled(value: boolean): void;
    setFocus(): void;
    setLabel(label: string): void;
    setNotification(message: string, uniqueId: string): void;
    setSrc(value: string): void;
    setVisible(value: boolean): void;
    addNotification(options: ControlNotificationOptions): void;
    addOnLoad(func: Function): void;
    removeOnLoad(func: Function): void;
    getGrid(): Grid;
    getEntityName(): string;
    getValue(): any;
}

interface Grid {
    getRows(): Collection<GridRow>;
    getSelectedRows(): Collection<GridRow>;
    getTotalRecordCount(): number;
}

interface GridRow {
    getData(): GridRowData;
}

interface GridRowData {
    getEntity(): GridEntity;
}

interface GridEntity {
    getEntityName(): string;
    getEntityReference(): Lookup;
    getId(): string;
    getPrimaryAttributeValue(): string;
}

interface ControlNotificationOptions {
    messages: string[];
    notificationLevel?: "ERROR" | "RECOMMENDATION";
    uniqueId?: string;
    actions?: NotificationAction[];
}

interface NotificationAction {
    message: string;
    actions: (() => void)[];
}

interface NavigationItem {
    getId(): string;
    getLabel(): string;
    getVisible(): boolean;
    setFocus(): void;
    setLabel(label: string): void;
    setVisible(value: boolean): void;
}

interface LookupControlItem {
    entityType: string;
    id: string;
    name: string;
    type: string;
}

interface ProcessData {
    getActiveProcess(): ProcessFlow;
    setActiveProcess(processId: string, callbackFunction: (result: "success" | "invalid") => void): void;

    getProcessInstances(callbackFunction: (processInstances) => void): void;
    setActiveProcessInstance(
        processId: string,
        callbackFunction: (result: "success" | "invalid") => void): void;

    getActiveStage(): ProcessFlowStage;
    setActiveStage(
        stageId: string,
        callbackFunction: (result: "success" | "crossEntity" | "invalid" | "unreachable" | "dirtyForm") => void): void;

    getActivePath(): Collection<ProcessFlowStage>;
    getEnabledProcesses(callbackFunction: (enabledProcesses) => void): void;
    getSelectedStage(): ProcessFlowStage;

    addOnStageChange(handler: (ctx: StageChangedContext) => void): void;
    removeOnStageChange(handler: (ctx: StageChangedContext) => void): void;

    addOnStageSelected(handler: (ctx: StageSelectedContext) => void): void;
    removeOnStageSelected(handler: (ctx: StageSelectedContext) => void): void;

    addOnProcessStatusChange(handler: (ctx: ProcessStatusChangeContext) => void): void;
    removeOnProcessStatusChange(handler: (ctx: ProcessStatusChangeContext) => void): void;

    moveNext(callbackFunction: (result: "success" | "crossEntity" | "end" | "invalid" | "dirtyForm") => void): void;
    movePrevious(callbackFunction: (result: "success" | "crossEntity" | "beginning" | "invalid" | "dirtyForm") => void): void;
}

interface ProcessFlow {
    getId(): string;
    getName(): string;
    getStages(): Collection<ProcessFlowStage>;
    isRendered(): boolean;
}

interface ProcessFlowStage {
    getCategory(): ProcessFlowStageCategory;
    getEntityName(): string;
    getId(): string;
    getName(): string;
    getStatus(): "active" | "inactive";
    getSteps(): ProcessFlowStageStep[];
}

interface ProcessFlowStageCategory {
    getValue(): ProcessFlowStageCategoryValue;    
}

declare enum ProcessFlowStageCategoryValue {
    Qualify = 0,
    Develop = 1,
    Propose = 2,
    Close = 3,
    Identify = 4,
    Research = 5,
    Resolve = 6
}

interface ProcessFlowInstance {
    getInstanceId(): string;
    getInstanceName(): string;
    getStatus(): "active" | "abandoned" | "finish";
    setStatus(
        status: "active" | "abandoned" | "finish",
        callbackFunction: (newStatus: "active" | "abandoned" | "finish") => void): void;
}

interface ProcessFlowStageStep {
    getAttribute(): string;
    getName(): string;
    isRequired(): boolean;
}

interface StageChangedContext {
    getEventArgs(): StageChangedEventArgs;
}

interface StageChangedEventArgs {
    getDirection(): "next" | "previous";
    getStage(): ProcessFlowStage;
}

interface StageSelectedContext {
    getEventArgs(): StageSelectedEventArgs;
}

interface StageSelectedEventArgs {
    getStage(): ProcessFlowStage;
}

interface ProcessStatusChangeContext {
}

interface Collection<T> {
    forEach(handler: CollectionForEachFunctionCallback<T>): void;
    get(): T[];
    get(argument: string): T;
    get(argument: number): T;
    getByIndex(argument: string): T;
    getByName(argument: number): T;
    getAll(): T[];
    getLength(): number;
}

interface CollectionForEachFunctionCallback<T> {
    (item: T, index: number): any;
}

interface ProcessUI {
    getDisplayState(): "expanded" | "collapsed";
    setDisplayState(state: "expanded" | "collapsed"): void;

    getVisible(): boolean;
    setVisible(visible: boolean): void;
}

interface AutoCompleteOptions {
    results?: AutoCompleteResult[];
    commands?: AutoCompleteCommand;
}

interface AutoCompleteResult {
    id?: any;
    icon?: string;
    fields?: string[];
}

interface AutoCompleteCommand {
    id: any;
    label: string;
    action: () => void;
}