module Notifications {

    "use strict";

    export interface INotificationService {
        init(): void;
        show(title: string, content: string, icon?: string): void;
    }
}