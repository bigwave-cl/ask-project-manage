// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getRenderContent, buildStaticDist } from "./server/renderPage";
import { useMessage } from "./server/useMessage";
import { CommandTypes } from "./types";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ask-project-manage" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand(CommandTypes.open, () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        const { distPath, distUriFile, iconUriFile } = buildStaticDist(context);
        const panel = vscode.window.createWebviewPanel("vueApp", "Ask Project Manage", vscode.ViewColumn.One, {
            enableScripts: true, // 允许运行 JS
            retainContextWhenHidden: true, // 隐藏时保留上下文
            localResourceRoots: [distUriFile],
        });

        // 设置图标
        panel.iconPath = {
            light: iconUriFile, // 浅色主题图标
            dark: iconUriFile, // 深色主题图标
        };
        panel.webview.html = getRenderContent({
            panel,
            distPath,
            distUriFile,
        });
        useMessage({
            panel,
            context,
        });
    });

    context.subscriptions.push(disposable);

    openPanel();
}
const openPanel = () => {
    vscode.commands.executeCommand(CommandTypes.open).then(() => {
        console.log("ask-project-manage.showPanel executed on activation");
    });
};
// This method is called when your extension is deactivated
export function deactivate() {}
