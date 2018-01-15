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

interface NotificationApi {
    forms: NotificationService;
    web: NotificationService;
    toast: NotificationService;
    boostrap: NotificationService;
    basic: NotificationService;
    show(options: NotificationServiceOptions): void;
    showToast(options: NotificationServiceOptions): void;
    hide(id?: string): void;
    hideToast(id?: string): void;
}