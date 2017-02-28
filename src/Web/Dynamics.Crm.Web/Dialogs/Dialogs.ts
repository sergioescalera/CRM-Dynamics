interface IXrmWindow extends Window {
    jQuery: JQueryStatic;
    $: JQueryStatic;
}

module Dynamics.Crm.Dialogs {

    "use strict";

    export enum DialogType {
        Alert = 0,
        Confirm = 1,
        Custom = 2
    }

    export interface IDialog<TResult> {        
        Show(): JQueryPromise<TResult>;
    }

    export interface IDialogConfig {
        Message?: string;
        Template?: string;
        Title?: string;
        Width?: string;
    }

    export interface IDialogProvider {
        Alert(message: string, title: string): JQueryPromise<IDialog<void>>;
        Confirm(message: string, title: string): JQueryPromise<IDialog<boolean>>;
        Create<TResult>(config: IDialogConfig): JQueryPromise<IDialog<TResult>>;
    }

    var provider: IDialogProvider;

    function getProvider(): IDialogProvider {

        if (!provider) {
            provider = new BootstrapDialogProvider(<IXrmWindow>window.top);
        }

        return provider;
    }

    export function alert(message: string, title: string): JQueryPromise<void> {

        var deferred = $.Deferred<void>();
        
        getProvider()
            .Alert(message, title)
            .done((d: IDialog<void>) => d
                .Show()
                .done(() => deferred.resolve())
                .fail(() => deferred.reject()))
            .fail(() => deferred.reject());

        return deferred;
    }

    export function confirm(message: string, title: string): JQueryPromise<boolean> {

        var deferred = $.Deferred<boolean>();
        
        getProvider()
            .Confirm(message, title)
            .done((d: IDialog<void>) => d
                .Show()
                .done((r: boolean) => deferred.resolve(r))
                .fail(() => deferred.reject()))
            .fail(() => deferred.reject());

        return deferred;
    }
}