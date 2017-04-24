module Dynamics.Crm.Dialogs {

    "use strict";

    class BootstrapDialogTemplates {

        static alert = (message: string, title: string) => `
            <div class='modal fade' tabindex='-1' role='dialog'>
            <div class='modal-dialog' role='document'>
               <div class='modal-content'>
                   <div class='modal-header'>
                       <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                           <span aria-hidden='true' >&times;</span></button>
                       <h4 class='modal-title'>${title}</h4>
                   </div>
                   <div class='modal-body'>${message}</div>
                   <div class='modal-footer'>
                       <button type='button' class='btn btn-primary' data-dismiss='modal'>OK</button>
                   </div>
               </div>
            </div>
            </div>`;

        static confirm = (message: string, title: string) => `
            <div class='modal fade' tabindex='-1' role='dialog'>
            <div class='modal-dialog' role='document'>
               <div class='modal-content'>
                   <div class='modal-header'>
                       <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                           <span aria-hidden='true' >&times;</span></button>
                       <h4 class='modal-title'>${title}</h4>
                   </div>
                   <div class='modal-body'>${message}</div>
                   <div class='modal-footer'>
                       <button type='button' class='btn btn-primary' data-dismiss='modal'>OK</button>
                       <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>
                   </div>
               </div>
            </div>
            </div>`;
    }

    export class BootstrapDialog<TResult> implements IDialog<TResult> {

        private _content: string;
        private _window: IJQueryWindow;
        private _dialog: Bootstrap;
        private _deferred: JQueryDeferred<TResult>;
        private _init: (dialog: JQuery) => void;

        constructor(window: IJQueryWindow, content: string, init?: (dialog: JQuery) => void) {

            this._content = content;
            this._window = window;
            this._init = init;
        }

        private Resolve(): void {

            this.deferred.resolve();
        }

        private Reject(): void {

            this.deferred.reject();
        }

        Show(): JQueryPromise<TResult> {

            this.dialog.modal("show");

            return this.deferred;
        }

        Destroy(): void {
            if (this._dialog) {
                this._dialog.remove();
            }
        }

        get dialog(): Bootstrap {

            if (!this._dialog) {

                this._dialog = <Bootstrap>this._window.$(this._content);

                this._dialog.appendTo(this._window.$("body"));
                this._dialog.modal({
                    backdrop: false,
                    show: false
                });

                this._window.$("button.btn-primary", this._dialog).click(this.Resolve.bind(this));
                this._window.$("button.close", this._dialog).click(this.Reject.bind(this));
                this._window.$("button.btn-default", this._dialog).click(this.Reject.bind(this));

                if (this._init) {
                    this._init(this._dialog);
                }
            }

            return this._dialog;
        }

        get deferred(): JQueryDeferred<TResult> {

            if (!this._deferred) {

                this._deferred = $.Deferred<TResult>();
            }

            return this._deferred;
        }
    }

    export class BootstrapDialogProvider implements IDialogProvider {

        private _window: IJQueryWindow;
        private _loading: JQueryPromise<any>;

        constructor(window: IJQueryWindow) {

            this._window = window;

            this.Init();
        }

        private Init(): void {

            var baseUrl: string = `../WebResources/${Dynamics.Crm.publisherPrefix}/Libs/bootstrap/`;

            this._loading = ScriptManager.loadScript(baseUrl + "js/bootstrap.min.js", this._window);

            ScriptManager.loadStylesheet(baseUrl + "css/bootstrap.min.css", this._window);
        }

        Alert(message: string, title: string): JQueryPromise<IDialog<void>> {

            return this
                ._loading
                .then(() => new BootstrapDialog<void>(this._window, BootstrapDialogTemplates.alert(message, title)));
        }

        Confirm(message: string, title: string): JQueryPromise<IDialog<boolean>> {

            return this
                ._loading
                .then(() => new BootstrapDialog<boolean>(this._window, BootstrapDialogTemplates.confirm(message, title)));
        }

        Create<TResult>(config: IDialogConfig<TResult>): JQueryPromise<IDialog<TResult>> {

            return this
                ._loading
                .then(() => new BootstrapDialog<TResult>(this._window, config.Template, config.Init));
        }
    }
}