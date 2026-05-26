import * as vscode from "vscode";

const DEBUG_PREFIX = "[APM_DEBUG]";

const getWorkspaceLabel = () => {
    const workspaceFile = vscode.workspace.workspaceFile?.fsPath;
    const folders = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath) || [];
    return {
        workspaceFile: workspaceFile || "",
        folders,
        windowState: vscode.window.state,
    };
};

export const debugLog = (scope: string, message: string, data?: Record<string, unknown>) => {
    console.log(DEBUG_PREFIX, new Date().toISOString(), scope, message, {
        ...getWorkspaceLabel(),
        ...(data || {}),
    });
};
