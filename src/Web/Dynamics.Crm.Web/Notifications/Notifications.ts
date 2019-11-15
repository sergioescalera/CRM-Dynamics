module Notifications {

    "use strict";

    export var forms: CrmFormNotificationService;
    export var web: WebNotificationService;
    export var toast: ToastrNotificationService;
    export var boostrap: BoostrapAlert;
    export var basic: DefaultNotifications;

    export var toastProviders: NotificationService[] = [
        //web = new WebNotificationService(),
        toast = new ToastrNotificationService(),
        forms = new CrmFormNotificationService(),
        basic = new DefaultNotifications()
    ];

    export var providers: NotificationService[] = [
        forms = new CrmFormNotificationService(),
        boostrap = new BoostrapAlert(),
        basic = new DefaultNotifications()
    ];

    let provider: NotificationService;
    let toastProvider: NotificationService;

    export function show(options: NotificationServiceOptions): void {

        console.log("Notifications.show()", options);

        if (!provider) {
            provider = resolve();
            provider.init();
        }

        provider.show(options || {
            message: ""
        });
    }

    export function hide(id ?: string): void {

        if (!provider) {
            provider = resolve();
            provider.init();
        }

        provider.hide();
    }

    export function showToast(options: NotificationServiceOptions): void {

        console.log("Notifications.show()", options);

        if (!toastProvider) {
            toastProvider = resolveToast();
            toastProvider.init();
        }

        toastProvider.show(options || {
            message: ""
        });
    }

    export function hideToast(id?: string): void {

        if (!toastProvider) {
            toastProvider = resolve();
            toastProvider.init();
        }

        toastProvider.hide();
    }

    function resolve(): NotificationService {

        for (let i: number = 0; i < providers.length; i++) {
            let service: NotificationService = providers[i];
            if (service && service.test()) {
                return service;
            }
        }
        throw new Error("Unable to resolve notification provider");
    }

    function resolveToast(): NotificationService {

        for (let i: number = 0; i < toastProviders.length; i++) {
            let service: NotificationService = toastProviders[i];
            if (service && service.test()) {
                return service;
            }
        }
        throw new Error("Unable to resolve notification provider");
    }
}

interface NotificationService {
    init(): void;
    hide(id?: string): void;
    show(options: NotificationServiceOptions): void;
    test(): boolean;
}

interface NotificationServiceOptions {
    id?: string;
    type?: any;
    title?: string;
    message: string;
    icon?: string;
    dismissible?: boolean;
}