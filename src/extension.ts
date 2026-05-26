// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { createPanel, openPanel } from "./server/panel";
import { useWindowState } from "./server/useWindowState";
import { crateStatusBar } from "./server/statusBar";
import { CommandTypes } from "./types";
import { debugLog } from "./server/debug";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ask-project-manage" is now active!');
    debugLog("extension.activate", "activate called", {
        extensionPath: context.extensionPath,
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    crateStatusBar(context);
    useWindowState();
    const disposable = vscode.commands.registerCommand(CommandTypes.open, () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        debugLog("extension.command", "open command received");
        createPanel(context);
    });
    context.subscriptions.push(disposable);
    setTimeout(() => {
        debugLog("extension.activate", "auto open panel scheduled callback");
        openPanel();
    }, 0);
}
// This method is called when your extension is deactivated
export function deactivate() {
    debugLog("extension.deactivate", "deactivate called");
}
