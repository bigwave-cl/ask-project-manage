import * as vscode from "vscode";
import { getRenderContent, buildStaticDist } from "./renderPage";
import { useMessage } from "./useMessage";
import { CommandTypes } from "../types";
let panel: vscode.WebviewPanel | undefined;
export const createPanel = (context: vscode.ExtensionContext) => {
    if (panel) {
        panel.reveal(); // 如果面板已经打开，聚焦到该面板
    } else {
        const { distPath, distUriFile, iconUriFile } = buildStaticDist(context);
        panel = vscode.window.createWebviewPanel("vueApp", "Ask Project Manage", vscode.ViewColumn.One, {
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

        // 监听 Webview 的关闭事件
        panel.onDidDispose(() => {
            panel = undefined; // 清理引用
        });
    }
};
export const destroyPanel = () => {
    panel?.dispose();
    panel = undefined; // 清理引用
};
export const getPanel = () => {
    return panel;
};

export const openPanel = () => {
    vscode.commands.executeCommand(CommandTypes.open).then(() => {
        console.log("ask-project-manage.showPanel executed on activation");
    });
};
