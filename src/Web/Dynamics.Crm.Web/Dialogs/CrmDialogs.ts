module Dynamics.Crm.Dialogs {

    "use strict";

    export class CrmAlertDialog implements IDialog<void> {

        private _window: JQueryWindow;
        private _message: string;

        constructor(window: JQueryWindow, message: string) {

            this._window = window;
            this._message = message;
        }

        Show(): JQueryPromise<void> {

            var deferred: JQueryDeferred<void> = this._window.$.Deferred<void>();

            Xrm.Utility.alertDialog(this._message, () => {
                deferred.resolve();
            });

            return deferred;
        }

        Destroy(): void {
        }
    }

    export class CrmConfirmDialog implements IDialog<boolean> {

        private _window: JQueryWindow;
        private _message: string;

        constructor(window: JQueryWindow, message: string) {

            this._window = window;
            this._message = message;
        }

        Show(): JQueryPromise<boolean> {

            var deferred: JQueryDeferred<boolean> = this._window.$.Deferred<boolean>();

            Xrm.Utility.confirmDialog(this._message, () => {
                deferred.resolve(true);
            }, () => {
                deferred.reject();
            });

            return deferred;
        }

        Destroy(): void {
        }
    }

    export class CrmDialogProvider implements IDialogProvider {

        private _window: JQueryWindow;

        constructor(window: JQueryWindow) {

            this._window = window;
        }

        Alert(message: string, title: string): JQueryPromise<IDialog<void>> {

            var deferred: JQueryDeferred<IDialog<void>> = this._window.$.Deferred<IDialog<void>>();

            deferred.resolve(new CrmAlertDialog(this._window, message));

            return deferred;
        }

        Confirm(message: string, title: string): JQueryPromise<IDialog<boolean>> {

            var deferred: JQueryDeferred<IDialog<boolean>> = this._window.$.Deferred<IDialog<boolean>>();

            deferred.resolve(new CrmConfirmDialog(this._window, message));

            return deferred;
        }

        Create<TResult>(config: IDialogConfig<TResult>): JQueryPromise<IDialog<TResult>> {

            throw Error("Not supported.");
        }
    }
}