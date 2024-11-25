import * as vscode from "vscode";
import { destroyPanel, createPanel, getPanel } from "./panel";
import { CommandTypes } from "../types";
let statusBarItem: vscode.StatusBarItem | undefined;
export const crateStatusBar = (context: vscode.ExtensionContext) => {
    if (statusBarItem) {
        return statusBarItem;
    }
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = CommandTypes.toggleWebview;
    updateStatusBar(true);
    statusBarItem.show();

    const toggleCommand = vscode.commands.registerCommand(CommandTypes.toggleWebview, () => {
        const panel = getPanel();
        if (panel) {
            if (panel.visible) {
                destroyPanel();
                updateStatusBar(false);
            } else {
                panel.reveal(vscode.ViewColumn.One); // 如果 Webview 未显示，重新显示
                updateStatusBar(true);
            }
        } else {
            createPanel(context);
            updateStatusBar(true);
        }
    });

    context.subscriptions.push(statusBarItem, toggleCommand);
};

// 更新状态栏图标和文字
function updateStatusBar(isWebviewOpen: boolean) {
    if (!statusBarItem) {
        return;
    }
    if (isWebviewOpen) {
        statusBarItem.text = "$(broadcast) Ask Project Manage";
        statusBarItem.tooltip = "Click to hide the Ask Project Manage";
    } else {
        statusBarItem.text = "$(broadcast) Ask Project Manage";
        statusBarItem.tooltip = "Click to show the Ask Project Manage";
    }
}
