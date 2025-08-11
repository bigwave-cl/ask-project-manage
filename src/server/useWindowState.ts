import * as vscode from "vscode";
import { getPanel, getPanelVisible, postMessage } from "./panel";
import { EventTypes } from "../types";
export const useWindowState = () => {
    vscode.window.onDidChangeWindowState(e => {
        // vscode.window.showInformationMessage("VS Code 窗口焦点" + e.focused + "==" + getPanelVisible() + !!getPanel());
        if (e.focused && getPanelVisible() && getPanel()) {
            postMessage(getPanel()!, {
                command: EventTypes.updateConfigPanel,
                data: true,
            });
        }
    });
};
