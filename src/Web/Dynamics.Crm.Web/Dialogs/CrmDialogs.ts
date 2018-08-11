module Dynamics.Crm.Dialogs {

    "use strict";

    export class CrmAlertDialog implements IDialog<void> {

        private _message: string;

        constructor(message: string) {

            this._message = message;
        }

        Show(): Promise<void> {

            return new Promise((resolve, reject) => {

                Xrm.Navigation
                    .openAlertDialog({
                        confirmButtonLabel: "Ok",
                        text: this._message
                    }).then(() => resolve());
            });
        }

        Destroy(): void {
        }
    }

    export class CrmConfirmDialog implements IDialog<boolean> {

        private _message: string;
        private _title: string;

        constructor(message: string, title: string) {

            this._message = message;
            this._title = title;
        }

        Show(): Promise<boolean> {

            return new Promise((resolve, reject) => {

                Xrm.Navigation.openConfirmDialog({
                    text: this._message,
                    title: this._title
                }).then(() => {
                    resolve(true);
                }, () => {
                    reject();
                });
            });
        }

        Destroy(): void {
        }
    }

    export class CrmDialogProvider implements IDialogProvider {

        Alert(message: string, title: string): Promise<IDialog<void>> {

            return Promise.resolve(new CrmAlertDialog(message));
        }

        Confirm(message: string, title: string): Promise<IDialog<boolean>> {

            return Promise.resolve(new CrmConfirmDialog(message, title));
        }

        Create<TResult>(config: IDialogConfig<TResult>): Promise<IDialog<TResult>> {

            throw Error("Not supported.");
        }
    }
}