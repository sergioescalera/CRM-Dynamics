declare var Xrm: Xrm;

declare var GetGlobalContext: () => GlobalContext;

interface GlobalContext {
    client: XrmClient; // Returns information about the client
    organizationSettings: OrganizationSettings; // Returns information about the current organization settings
    userSettings: UserSettings; // Returns information about the current user settings
    getAdvancedConfigSetting(
        settingName: string): any; // Returns information about the advanced configuration settings for the organization
    getClientUrl(): string; // Returns the base URL that was used to access the application
    getCurrentAppName(): XrmPromise<string>; // Returns the name of the current business app in model - driven apps
    getCurrentAppProperties(): XrmPromise<AppProperties>; // Returns the properties of the current business app in model - driven apps
    getCurrentAppUrl(): string; // Returns the URL of the current business app in model - driven apps
    getVersion(): string; // Returns the version number of the model - driven apps instance
    isOnPremises(): boolean; //Returns a boolean value indicating if the model - driven apps instance is hosted on - premises or online
    prependOrgName(sPath: string): string; // Prefixes the current organization's unique name to a string, typically a URL path
}

interface ExecutionContext {
    getDepth(): number; // The order in which this handler is executed. The order begins with 0
    getEventArgs(): SaveEventArgs; // Returns an object with methods to manage the Save event
    getEventSource(): Attribute; // Returns a reference to the object that the event occurred on

    getFormContext(): FormContext; // Returns a reference to the form or an item on the form depending on where the method was called
    getSharedVariable(key: string): any; // Retrieves a variable set using the setSharedVariable method
    setSharedVariable(key: string, value: any): void; // Sets the value of a variable to be used by a handler after the current handler completes
}

interface SaveEventArgs {
    getSaveMode(): number;
    isDefaultPrevented(): number;
    preventDefault(): void;
}

interface FormContext {
    data: XFormData;
    ui: FormUi;
    process: FormProcessData;
    getAttribute(name: string): Attribute;
    getControl(name: string): Control;
}

interface XFormData {
    entity: XrmEntity;
    process: any; // TODO
    addOnLoad(handler: (cxt: ExecutionContext) => void): void;
    removeOnLoad(handler: (cxt: ExecutionContext) => void): void;
    getIsDirty(): boolean;
    isValid(): boolean;
    refresh(save?: boolean): XrmPromise<{}>;
    save(saveOptions?: { saveMode: number }): XrmPromise<{}>;
}

interface XrmEntity {
    attributes: FormCollection<Attribute>;
    getEntityName(): string;
    getEntityReference(): LookupControlItem;
    getId(): string;
    getIsDirty(): boolean;
    getPrimaryAttributeValue(): string;
    isValid(): boolean;
    save(saveOption?: "saveandclose" | "saveandnew"): void;
}

interface FormProcessData {

}

interface FormUi {
    controls: FormCollection<Control>;
    formSelector: FormSelector;
    navigation: FormNavigation;
    process: FormProcessControl;
    tabs: FormCollection<Tab>;
    quickForms: FormCollection<QuickForm>;
    addOnLoad(handler: (ctx: ExecutionContext) => void): void;
    clearFormNotification(uniqueId: string): void;
    close(): void;
    getFormType(): number;
    getViewPortHeight(): number;
    getViewPortWidth(): number;
    refreshRibbon(refreshAll?: boolean): void;
    removeOnLoad(handler: (ctx: ExecutionContext) => void): void;
    setFormEntityName(arg: string): void;
    setFormNotification(
        message: string,
        level: FormNotificationType,
        uniqueId: string): void;
    setFormHtmlNotification(
        message: string,
        level: FormNotificationType,
        uniqueId: string): void;
}

declare type FormNotificationType = "ERROR" | "INFO" | "WARNING";

interface FormCollection<T> {
    forEach(action: (item: T, index) => void): void;
    get(): T[];
    get(index: number): T;
    get(name: string): T;
    get(predicate: (item: T, index) => boolean): T[];
    getLength(): number;
}

interface Attribute {
    addOnChange(handler: (ctx: ExecutionContext) => void): void;
    removeOnChange(handler: (ctx: ExecutionContext) => void): void;
    controls: FormCollection<Control>;
    fireOnChange(): void;
    getAttributeType(): AttributeType;
    getFormat?(): null | AttributeFormat;
    getInitialValue?(): boolean | number | number[];
    getIsDirty(): boolean;
    getIsPartyList?(): boolean;
    getMax?(): number;
    getMaxLength?(): number;
    getMin?(): number;
    getName(): string;
    getOption?(value): OptionSetItem;
    getOptions?(): OptionSetItem[];
    getParent(): XrmEntity;
    getPrecision?(): number;
    getRequiredLevel(): AttributeRequiredLevel;
    getSelectedOption?(): OptionSetItem | OptionSetItem[];
    getSubmitMode(): AttributeSubmitMode;
    getText?(): string;
    getUserPrivilege(): AttributeUserPrivilege;
    getValue(): any;
    isValid(): boolean;
    setIsValid(value: boolean, message: string): void;
    setPrecision?(value: number): void;
    setRequiredLevel(value: AttributeRequiredLevel): void;
    setSubmitMode(mode: AttributeSubmitMode): void;
    setValue(value: AttributeValue): void;
}

declare type AttributeValue = boolean | Date | number | LookupControlItem[] | string | number[] | null;

declare type AttributeType = "boolean"
    | "datetime"
    | "decimal"
    | "double"
    | "integer"
    | "lookup"
    | "memo"
    | "money"
    | "multiselectoptionset"
    | "optionset"
    | "string";

declare type AttributeFormat = "date"
    | "datetime"
    | "duration"
    | "email"
    | "language"
    | "none"
    | "phone"
    | "text"
    | "textarea"
    | "tickersymbol"
    | "timezone"
    | "url";

declare type AttributeRequiredLevel = "none" | "required" | "recommended";

declare type AttributeSubmitMode = "always" | "never" | "dirty";

interface OptionSetItem {
    text: string;
    value: number;
}

interface AttributeUserPrivilege {
    canRead: boolean;
    canUpdate: boolean;
    canCreate: boolean;
}

interface Control {
    addCustomFilter(filter: string, entityLogicaName: string): void;
    addCustomView(
        viewId: string,
        entityName: string,
        viewDisplayName: string,
        fetchXml: string,
        layoutXml: string,
        isDefault: boolean): void;
    addNotification(notification: ControlNotificationOptions): boolean;
    addOption(option: OptionSetItem, index: number): void;
    addPreSearch(handler: Function): void;
    clearNotification(uniqueId): void;
    clearOptions(): void;
    getAttribute(): Attribute;
    getControlType(): ControlType;
    getData(): string;
    getDefaultView(): string;
    getDisabled(): boolean;
    getEntityTypes(): string;
    getGrid(): XGrid;
    getInitialUrl(): string;
    getLabel(): string;
    getName(): string;
    getObject(): HTMLIFrameElement;
    getOptions(): OptionSetItem[];
    getParent(): Section;
    getShowTime(): boolean;
    getSrc(): string;
    getState(): number;
    getValue(): AttributeValue;
    getVisible(): boolean;
    refresh(): void;
    removeOption(value: number): void;
    removePreSearch(handler: Function): void;
    setData(data: string): void;
    setDefaultView(viewId: string): void;
    setDisabled(value: boolean): void;
    setEntityTypes(entityLogicalNames: string[]): void;
    setFocus(): void;
    setLabel(label: string): void;
    setNotification(message: string, uniqueId: string): void;
    setSearchQuery(searchString: string): void;
    setShowTime(value: boolean);
    setSrc(url: string): void;
    setVisible(value: boolean): void;
}

declare type ControlType = "standard"
    | "iframe"
    | "kbsearch"
    | "lookup"
    | "multiselectoptionset"
    | "notes"
    | "optionset"
    | "quickform"
    | "subgrid"
    | "timercontrol"
    | "timelinewall"
    | "webresource"
    | "customcontrol"
    | "customsubgrid";

interface ControlNotificationOptions {
    actions: {
        message: string,
        actions: Function[];
    }[];
    messages?: string[];
    notificationLevel: "ERROR" | "RECOMMENDATION";
    uniqueId: string;
}

interface GridControl {
    addOnLoad(handler: (ctx: ExecutionContext) => void): void;
    getEntityName(): string;
    getfetchXml(): string;
    getGrid(): XGrid;
    getGridType(): 1 | 2;
    refresh(): void;
    removeOnLoad(handler: (ctx: ExecutionContext) => void): void;
}

interface XGrid {
    getRows(): FormCollection<XGridRow>;
    getSelectedRows(): FormCollection<XGridRow>;
    getTotalRecordCount(): number;
}

interface XGridRow {
    getData(): XGridRowData;
}

interface XGridRowData {
    getEntity(): XGridRowEntity;
}

interface XGridRowEntity {
    attributes: FormCollection<Attribute>;
    getEntityName(): string;
    getEntityReference(): LookupControlItem;
    getId(): string;
    getPrimaryAttributeValue(): string;
}

interface FormSelector {
    items: FormCollection<FormSelectorItem>;
    getCurrentItem(): FormSelectorItem;
}

interface FormSelectorItem {
    getId(): string;
    getLabel(): string;
    navigate(): void;
}

interface FormNavigation {
    items: FormCollection<FormNavigationItem>;
}

interface FormNavigationItem {
    getId(): string;
    getLabel(): string;
    getVisible(): boolean;
    setFocus(): void;
    setLabel(label: string): void;
    setVisible(value: boolean): void;
}

interface FormProcessControl {
    getDisplayState(): "expanded" | "collapsed" | "floating";
    getVisible(): boolean;
    setetDisplayState(value: "expanded" | "collapsed" | "floating"): void;
    setVisible(value: boolean): void;
    reflow(updateUI: boolean, parentStage: "string", nextStage: string): void;
}

interface Tab {
    sections: FormCollection<Section>;
    addTabStateChange(handler: (ctx: ExecutionContext) => void): void;
    removeTabStateChange(handler: (ctx: ExecutionContext) => void): void;
    getDisplayState(): "expanded" | "collapsed";
    getLabel(): string;
    getName(): string;
    getParent(): FormUi;
    getVisible(): boolean;
    setDisplayState(value: "expanded" | "collapsed"): void;
    setFocus(): void;
    setLabel(label: string): void;
    setVisible(value: boolean): void;
}

interface Section {
    controls: FormCollection<Control>;
    getLabel(): string;
    getName(): string;
    getParent(): Tab;
    getVisible(): boolean;
    setLabel(label: string): void;
    setVisible(value: boolean): void;
}

interface QuickForm {
    data: XFormData;
    getControl(): FormCollection<Control>;
    getControl(name: string): Control;
    getControl(index: number): Control;
    getControlType(): "quickform";
    getDisabled(): boolean;
    getLabel(): string;
    getName(): string;
    getParent(): FormUi;
    getVisible(): boolean;
    isLoaded(): boolean;
    refresh(): void;
    setDisabled(value: boolean): void;
    setFocus(): void;
    setLabel(label: string): void;
    setVisible(value: boolean): void;
}

interface XrmClient {
    getClient(): "Web" | "Outlook" | "Mobile";
    getClientState(): "Online" | "Offline";
    getFormFactor(): number; // 0 Unknown 1 Desktop 2 Tablet 3 Phone
    isOffline(): boolean;
}

interface OrganizationSettings {
    baseCurrencyId: string;
    defaultCountryCode: string;
    isAutoSaveEnabled: boolean;
    languageId: number;
    organizationId: string;
    uniqueName: string;
    useSkypeProtocol: boolean;
}

interface UserSettings {
    dateFormattingInfo: Object;
    defaultDashboardId: string;
    isGuidedHelpEnabled: boolean;
    isHighContrastEnabled: boolean;
    isRTL: boolean;
    languageId: number;
    securityRolePrivileges: string[];
    securityRoles: string[];
    transactionCurrencyId: string;
    userId: string;
    userName: string;
    getTimeZoneOffsetMinutes(): number;
}

interface AppProperties {
    appId: string;
    displayName: string;
    uniqueName: string;
    url: string;
    webResourceId: string;
    webResourceName: string;
    welcomePageId: string;
    welcomePageName: string;
}

interface Xrm {
    Device: Device;
    Encoding: Encoding;
    Navigation: Navigation;
    Panel: Panel;
    Utility: Utility;
    WebApi: WebApi;
    Internal: any;
    DialogOptions: any;
}

interface Device {
    captureAudio(): XrmPromise<FileResult>;
    captureImage(imageOptions?: CaptureImageOptions): XrmPromise<FileResult>;
    captureVideo(): XrmPromise<FileResult>;
    getBarcodeValue(): XrmPromise<string>;
    getCurrentPosition(): XrmPromise<PositionResult>;
    pickFile(pickFileOptions?: PickFileOptions): XrmPromise<FileResult>;
}

interface FileResult {
    fileContent: string; // Contents of the file
    fileName: string; // Name of the file
    fileSize: number; // Size of the file in KB
    mimeType: string; // File MIME type
}

interface CaptureImageOptions {
    allowEdit?: boolean; // Indicates whether to edit the image before saving
    height?: number; // Height of the image to capture
    preferFrontCamera?: Boolean; //  Indicates whether to capture image using the front camera of the device
    quality?: number; // Quality of the image file in percentage
    width?: number; // Width of the image to capture
}

interface PositionResult {
    coords: Coordinates; // Contains a set of geographic coordinates along with associated accuracy as well as a set of other optional attributes such as altitude and speed
    timestamp: DOMTimeStamp; // Represents the time when the object was acquired and is represented as DOMTimeStamp
}

interface PickFileOptions {
    accept: "audio" | "video" | "image"; // Image file types to select. Valid values are "audio", "video", or "image"
    allowMultipleFiles: boolean; // Indicates whether to allow selecting multiple files
    maximumAllowedFileSize: number; // Maximum size of the files(s) to be selected
}

interface Encoding {
    htmlAttributeEncode(arg: string): string; // Encodes the specified string so that it can be used in an HTML attribute
    htmlDecode(arg: string): string; // Converts a string that has been HTML-encoded into a decoded string
    htmlEncode(arg: string): string; // Converts a string to an HTML-encoded string
    xmlAttributeEncode(arg: string): string; // Encodes the specified string so that it can be used in an XML attribute
    xmlEncode(arg: string): string; // Converts a string to an XML-encoded string
}

interface Navigation {
    navigateTo(
        pageInput: NavigateToPageOptions): XrmPromise<void>; // This method is supported only on the Unified Interface
    openAlertDialog(
        strings: AlertDialogStrings,
        options?: DialogOptions): XrmPromise<{}>; // Displays an alert dialog containing a message and a button
    openConfirmDialog(
        strings: ConfirmDialogStrings,
        options?: DialogOptions): XrmPromise<{ confirmed: boolean }>; // Displays a confirmation dialog box containing a message and two buttons
    openErrorDialog(
        options?: ErrorDialogOptions): XrmPromise<{}>; // Displays an error dialog
    openFile(
        file: FileResult,
        options?: 1 | 2); // Opens a file. Specify 1 to open; 2 to save
    openForm(
        options: EntityFormOptions,
        formParameters?: any): XrmPromise<{
            savedEntityReference?: LookupControlItem[]
        }>; // Opens an entity form or a quick create form
    openUrl(
        url: string,
        options?: DialogOptions): void; // Opens a URL, including file URLs
    openWebResource(
        webResourceName: string,
        options?: OpenWindowOptions,
        data?: string);
}

interface NavigateToPageOptions {
    pageType: "entitylist";
    entityName: string; // The logical name of the entity to load in the list control
    viewId?: string; // The ID of the view to load.If you don't specify it, navigates to the default main view for the entity
    viewType?: "savedquery" | "userquery"; // Type of view to load
}

interface AlertDialogStrings {
    confirmButtonLabel?: string;
    text: string;
    title?: string;
}

interface DialogOptions {
    height?: number;
    width?: number;
}

interface OpenWindowOptions extends DialogOptions {
    openInNewWindow?: boolean;
}

interface ConfirmDialogStrings {
    cancelButtonLabel?: string;
    confirmButtonLabel?: string;
    subtitle?: string;
    text: string;
    title?: string;
}

interface ErrorDialogOptions {
    details?: string;
    errorCode?: number;
    message?: string;
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

interface Panel {
    loadPanel(url: string, title: string): void; // Displays the web page represented by a URL in the static area in the side pane, which appears on all pages in the model-driven apps web client. This method is supported only for the web client
}

interface Utility {
    closeProgressIndicator(): void; // Closes a progress dialog box
    getAllowedStatusTransitions(
        entityName: string,
        statusCode: number): XrmPromise<number[]>; // Returns the valid state transitions for the specified entity type and status code. Returns an object with .then() function. The parameter to the delegate is an array of numbers representing the valid status transitions
    getEntityMetadata(
        entityName: string,
        attributes: string[]): XrmPromise<EntityMetadata>; // Returns the entity metadata for the specified entity
    getEntitySetName(entityName: string): string;
    getGlobalContext(): GlobalContext;
    getLearningPathAttributeName(): string;
    getResourceString(
        webResourceName: string,
        key: string): string; // Returns the localized string for a given key associated with the specified web resource
    invokeProcessAction(
        name: string,
        parameters: _.Dictionary<any>): XrmPromise<any>; // Invokes an action based on the specified parameters
    lookupObjects(options: LookupOptions): XrmPromise<LookupControlItem>; // Opens a lookup control to select one or more items
    refreshParentGrid(options: LookupControlItem): void; // Refreshes the parent grid containing the specified record
    showProgressIndicator(message: string): void; // Displays a progress dialog with the specified message
}

interface LookupOptions {
    allowMultiSelect?: boolean; // Indicates whether the lookup allows more than one item to be selected
    defaultEntityType?: string; // The default entity type to use
    defaultViewId?: string; // The default view to use
    disableMru?: boolean; // Decides whether to display the most recently used(MRU) item. Available only for Unified Interface
    entityTypes?: string[]; // The entity types to display
    filters?: {
        filterXml: string,
        entityLogicalName: string
    }[]; // Used to filter the results.Each object in the array contains the following attributes
    filterXml: string // The FetchXML filter element to apply
    entityLogicalName: string; // The entity type to which to apply this filter
    showBarcodeScanner: boolean; // Indicates whether the lookup control should show the barcode scanner in mobile clients
    viewIds: string[]; // The views to be available in the view picker.Only system views are supported
}

// TODO
interface EntityMetadata {

}

interface WebApi extends WebApiObj {
    online: WebApi;
    offline: WebApi;
}

interface WebApiObj {

    createRecord(
        entityLogicalName: string,
        data: any): XrmPromise<EntityReference>;

    deleteRecord(
        entityLogicalName: string,
        id: string): XrmPromise<EntityReference>;

    updateRecord(entityLogicalName: string, id: string, data: any): XrmPromise<EntityReference>;

    retrieveRecord(entityLogicalName: string, id: string, query?: string): XrmPromise<Entity>;

    retrieveMultipleRecords(
        entityLogicalName: string,
        query?: string,
        maxPageSize?: number): XrmPromise<WebApiRetrieveMultipleResponse>;

    execute(request: WebApiExecuteRequest): XrmPromise<WebApiExecuteResponse>;
}

interface WebApiRetrieveMultipleResponse {
    entities?: Entity[];
    nextLink?: string;
}

interface WebApiExecuteRequest {
    getMetadata(): WebApiExecuteRequestMetadata;
}

interface WebApiExecuteRequestMetadata {
    boundParameter?: string;
    operationName?: string;
    operationType?: number; // 0: Action, 1: Function, 2: CRUD
    parameterTypes: WebApiExecuteRequestParameters;
}

interface WebApiExecuteRequestParameters {
    [key: string]: WebApiExecuteRequestParameter;
}

interface WebApiExecuteRequestParameter {
    enumProperties?;
    structuralProperty: number;
    typeName: string;
}

interface WebApiExecuteResponse {
    body?; // Deprecated
    headers;
    ok: boolean;
    status: number;
    statusText: string;
    type: "" | "arraybuffer" | "blob" | "document" | "json" | "text"; // Deprecated
    url: string;
    responseText?: string;
    json: Promise<any>;
    text: Promise<string>;
}

interface EntityReference {
    entityType?: string; // The logical name of the entity
    id?: string // A string representation of a GUID value for the record
    name?: string // The primary attribute value of the record displayed or created
}

interface Entity extends EntityReference {
    [index: string]: any;
}

interface LookupControlItem {
    entityType: string; // The logical name of the entity
    id: string // A string representation of a GUID value for the record
    name?: string // The primary attribute value of the record displayed or created
}

interface XrmPromise<T> {
    then(
        successCallback: (result: T) => void,
        errorCallback?: (error: { message: string, code?: number, errorCode?: number }) => void
    )
}