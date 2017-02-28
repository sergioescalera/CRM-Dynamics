interface Bootstrap extends JQuery {
    modal(config?: IBootstrapDialogConfig): Bootstrap;
    modal(action?: string): Bootstrap;
}

interface IBootstrapDialogConfig {
    backdrop?: boolean;
    keyboard?: boolean;
    show?: boolean;
}