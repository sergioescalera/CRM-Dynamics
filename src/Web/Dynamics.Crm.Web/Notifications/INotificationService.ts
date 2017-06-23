module Notifications {

    "use strict";

    export interface INotificationService {
        init(): void;
        show(options: Options): void;
        test(): boolean;
    }

    export interface Options {
        id?: string;
        type?: any;
        title?: string;
        message: string;
        icon?: string;
    }
}