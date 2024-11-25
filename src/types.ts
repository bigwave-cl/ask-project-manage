import type * as vscode from "vscode";
export type RenderContentParams = {
    panel: vscode.WebviewPanel;
    distPath: string;
    distUriFile: vscode.Uri;
    injectJsUri?: vscode.Uri;
};
export interface CommandHandlerData<T extends any> {
    data: T;
    code?: 200 | 400;
}
export interface MessageParams<T extends any> {
    // 'open-folder' | 'open-workspace'
    command: string;
    data: T;
}
export type ProjectItemModel = {
    name: string;
    key: string;
    source: string;
    path: string;
    type: "workspace" | "folder";
};
export type ProjectConfigItemModel = {
    key: string;
    label: string;
    children: ProjectItemModel[];
};
export enum CommandTypes {
    open = 'ask-project-manage.openPanel',
    close = 'ask-project-manage.closePanel',
}
export enum EventTypes {
    openPanel = 'ask-project-manage.openPanel',
    closePanel = 'ask-project-manage.closePanel',
}
