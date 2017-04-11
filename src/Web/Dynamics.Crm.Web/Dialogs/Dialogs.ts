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

    export interface IDialogConfig<TResult> {
        Done: () => TResult;
        Init?: (dialog: JQuery) => void;
        Template?: string;
        Title?: string;
        Width?: string;
    }

    export interface IDialogProvider {
        Alert(message: string, title: string): JQueryPromise<IDialog<void>>;
        Confirm(message: string, title: string): JQueryPromise<IDialog<boolean>>;
        Create<TResult>(config: IDialogConfig<TResult>): JQueryPromise<IDialog<TResult>>;
    }

    var provider: IDialogProvider;

    function getProvider(): IDialogProvider {

        if (!provider) {
            provider = new BootstrapDialogProvider(<IXrmWindow>window.top);
        }

        return provider;
    }

    export function alert(message: string, title: string): JQueryPromise<void> {

        var deferred: JQueryDeferred<void> = $.Deferred<void>();

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

        var deferred: JQueryDeferred<boolean> = $.Deferred<boolean>();

        getProvider()
            .Confirm(message, title)
            .done((d: IDialog<void>) => d
                .Show()
                .done(() => deferred.resolve(true))
                .fail(() => deferred.reject()))
            .fail(() => deferred.reject());

        return deferred;
    }

    export function create<TResult>(config: IDialogConfig<TResult>): JQueryPromise<TResult> {

        var deferred: JQueryDeferred<TResult> = $.Deferred<TResult>();

        getProvider()
            .Create(config)
            .done((d: IDialog<TResult>) => d
                .Show()
                .done(() => {

                    var result: TResult = config.Done();

                    deferred.resolve(result);
                })
                .fail(() => deferred.reject()))
            .fail(() => deferred.reject());

        return deferred;
    }

    export function init(): void {

        getProvider();
    }
}