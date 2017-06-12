declare var Notification: {
    new (title: string, options: NotificationOptions);
    prototype: Notification;
    requestPermission(): PromiseLike<NotificationPermission>;
    permission: NotificationPermission;
}

interface Notification {
    permission: NotificationPermission;
    actions: any[];
    badge: string;
    body: string;
    data: any;
    dir: NotificationDirection;
    icon: string;
    image: string;
    lang: string;
    requireInteraction: boolean;
    silent: boolean;
    tag: string;
    timestamp: any;
    title: string;
    vibrate: number[];
}

declare type NotificationPermission = "granted" | "denied" | "dafault";
declare type NotificationDirection = "auto" | "ltr" | "rtl";

interface NotificationOptions {
    actions?: any[];
    badge?: string;
    body?: string;
    data?: any;
    dir?: NotificationDirection;
    icon?: string;
    image?: string;
    lang?: string;
    renotify?: boolean;
    requireInteraction?: boolean;
    tag?: string;
    vibrate?: number[];
}