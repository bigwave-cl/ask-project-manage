import type * as vscode from "vscode";
export type RenderContentParams = {
    panel: vscode.WebviewPanel;
    distPath: string;
    distUriFile: vscode.Uri;
};

export enum CommandTypes {
    open = 'ask-project-manage.openPanel',
    close = 'ask-project-manage.closePanel',
}
export enum EventTypes {
    openPanel = 'ask-project-manage.openPanel',
    closePanel = 'ask-project-manage.closePanel',
}
