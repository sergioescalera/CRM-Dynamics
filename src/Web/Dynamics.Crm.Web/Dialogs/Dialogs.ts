module Dynamics.Crm.Dialogs {

    "use strict";

    export enum DialogType {
        Alert = 0,
        Confirm = 1,
        Custom = 2
    }

    export interface IDialog<TResult> {
        Destroy(): void;
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

    let provider: IDialogProvider;

    function getProvider(): IDialogProvider {

        if (!provider) {
            throw new Error("Dialog provider hasn't been initialized");
        }

        return provider;
    }

    export function alert(message: string, title: string): JQueryPromise<void> {

        let win = <JQueryWindow>window.top;
        let deferred: JQueryDeferred<void> = win.$.Deferred<void>();

        getProvider()
            .Alert(message, title)
            .done((d: IDialog<void>) => d
                .Show()
                .done(() => deferred.resolve())
                .fail(() => deferred.reject())
                .always(() => d.Destroy()))
            .fail(() => deferred.reject());

        return deferred;
    }

    export function confirm(message: string, title: string): JQueryPromise<boolean> {

        let win = <JQueryWindow>window.top;
        let deferred: JQueryDeferred<boolean> = win.$.Deferred<boolean>();

        getProvider()
            .Confirm(message, title)
            .done((d: IDialog<void>) => d
                .Show()
                .done(() => deferred.resolve(true))
                .fail(() => deferred.reject())
                .always(() => d.Destroy()))
            .fail(() => deferred.reject());

        return deferred;
    }

    export function create<TResult>(config: IDialogConfig<TResult>): JQueryPromise<TResult> {

        let win = <JQueryWindow>window.top;
        let deferred: JQueryDeferred<TResult> = win.$.Deferred<TResult>();

        getProvider()
            .Create(config)
            .done((d: IDialog<TResult>) => d
                .Show()
                .done(() => {

                    let result: TResult = config.Done();

                    deferred.resolve(result);
                })
                .fail(() => deferred.reject()))
            .fail(() => deferred.reject());

        return deferred;
    }

    export var bootstrapEnabled: boolean = true;

    export function init(prefix: string): void {

        let win = <JQueryWindow>window.top;

        prefix = prefix || Publishers.bootstrap;

        provider = bootstrapEnabled ?
            new BootstrapDialogProvider(win, prefix) :
            new CrmDialogProvider(win);
    }
}