module Dynamics.Crm.Dialogs {

    "use strict";

    export enum DialogType {
        Alert = 0,
        Confirm = 1,
        Custom = 2
    }

    export interface IDialog<TResult> {
        Destroy(): void;
        Show(): Promise<TResult>;
    }

    export interface IDialogConfig<TResult> {
        Done: () => TResult;
        Init?: (dialog: JQuery) => void;
        Template?: string;
        Title?: string;
        Width?: string;
    }

    export interface IDialogProvider {
        Alert(message: string, title: string): Promise<IDialog<void>>;
        Confirm(message: string, title: string): Promise<IDialog<boolean>>;
        Create<TResult>(config: IDialogConfig<TResult>): Promise<IDialog<TResult>>;
    }

    let provider: IDialogProvider;

    function getProvider(): IDialogProvider {

        if (!provider) {
            throw new Error("Dialog provider hasn't been initialized");
        }

        return provider;
    }

    export function alert(message: string, title: string): Promise<void> {

        return new Promise((resolve, reject) => {

            getProvider()
                .Alert(message, title)
                .then((d: IDialog<void>) => d
                    .Show()
                    .then(() => {
                        resolve();
                        d.Destroy();
                    })
                    .catch(() => {
                        reject();
                        d.Destroy();
                    }))
                .catch(() => reject());
        });
    }

    export function confirm(message: string, title: string): Promise<boolean> {

        return new Promise((resolve, reject) => {

            getProvider()
                .Confirm(message, title)
                .then((d: IDialog<boolean>) => d
                    .Show()
                    .then(() => {
                        resolve(true);
                        d.Destroy();
                    })
                    .catch(() => {
                        reject();
                        d.Destroy();
                    }))
                .catch(() => reject());
        });
    }

    export function create<TResult>(config: IDialogConfig<TResult>): Promise<TResult> {

        return new Promise((resolve, reject) => {

            getProvider()
                .Create(config)
                .then((d: IDialog<TResult>) => d
                    .Show()
                    .then(() => {

                        let result: TResult = config.Done();

                        resolve(result);
                    })
                    .catch(() => reject()))
                .catch(() => reject());
        });
    }

    export var bootstrapEnabled: boolean = true;

    export function init(prefix: string): void {

        let win = <JQueryWindow>window.top;

        prefix = prefix || Publishers.bootstrap;

        provider = bootstrapEnabled ?
            new BootstrapDialogProvider(win, prefix) :
            new CrmDialogProvider();
    }
}