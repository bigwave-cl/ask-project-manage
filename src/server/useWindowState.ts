import * as vscode from "vscode";
import { getPanel, getPanelVisible, postMessage } from "./panel";
import { EventTypes } from "../types";
import { debugLog } from "./debug";
export const useWindowState = () => {
    debugLog("windowState.register", "register window state listener");
    vscode.window.onDidChangeWindowState(e => {
        // vscode.window.showInformationMessage("VS Code 窗口焦点" + e.focused + "==" + getPanelVisible() + !!getPanel());
        debugLog("windowState.change", "window state changed", {
            focused: e.focused,
            panelVisible: getPanelVisible(),
            hasPanel: !!getPanel(),
        });
        if (e.focused && getPanelVisible() && getPanel()) {
            debugLog("windowState.change", "post updateConfigPanel");
            postMessage(getPanel()!, {
                command: EventTypes.updateConfigPanel,
                data: true,
            });
        }
    });
};
