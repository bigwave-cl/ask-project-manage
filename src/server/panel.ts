import * as vscode from "vscode";
import { getRenderContent, buildStaticDist } from "./renderPage";
import { useMessage } from "./useMessage";
import { updateStatusBar } from "./statusBar";
import { CommandTypes, EventTypes, MessageParams } from "../types";
let panel: vscode.WebviewPanel | undefined;
let panelVisible: boolean = false;
const PANEL_VIEW_TYPE = "ask-project-manage.panel";
const PANEL_TITLE = "Ask Project Manage";

const isProjectManageTab = (tab: vscode.Tab) => {
    if (tab.input instanceof vscode.TabInputWebview) {
        return tab.input.viewType === PANEL_VIEW_TYPE;
    }
    return false;
};

const closeProjectManageTabs = async () => {
    const tabs = vscode.window.tabGroups.all.flatMap(group => group.tabs.filter(isProjectManageTab));

    if (tabs.length === 0) {
        return false;
    }

    return vscode.window.tabGroups.close(tabs, true);
};

export const createPanel = async (context: vscode.ExtensionContext) => {
    if (panel) {
        panel.reveal(); // 如果面板已经打开，聚焦到该面板
    } else {
        const { distPath, distUriFile, iconUriFile } = buildStaticDist(context);
        panel = vscode.window.createWebviewPanel(PANEL_VIEW_TYPE, PANEL_TITLE, vscode.ViewColumn.One, {
            enableScripts: true, // 允许运行 JS
            retainContextWhenHidden: true, // 隐藏时保留上下文
            localResourceRoots: [distUriFile],
        });

        // 设置图标
        panel.iconPath = {
            light: iconUriFile, // 浅色主题图标
            dark: iconUriFile, // 深色主题图标
        };
        panel.webview.html = await getRenderContent({
            panel,
            distPath,
            distUriFile,
        });
        useMessage({
            panel,
            context,
        });
        panel.onDidChangeViewState(e => {
            updateStatusBar(e.webviewPanel.visible);
            panelVisible = e.webviewPanel.visible;
        });
        panelVisible = true;

        // 监听 Webview 的关闭事件
        panel.onDidDispose(() => {
            panel = undefined; // 清理引用
            updateStatusBar(false);
            panelVisible = false;
        });
    }
};
const notifyWindowInfo = ()=> {

    const workspaceFile = vscode.workspace.workspaceFile;
    const isWorkSpace = !!workspaceFile;
    const fsPath = vscode.workspace.workspaceFolders;
    const windowPath = isWorkSpace ? workspaceFile : fsPath ? fsPath[0].uri.fsPath : '';
    postMessage(panel!, {
        command: EventTypes.updateWindowInfo,
        data: {
            path: windowPath,
        },
    });
}
export const destroyPanel = async () => {
    const currentPanel = panel;

    if (!currentPanel) {
        await closeProjectManageTabs();
        return;
    }

    await closeProjectManageTabs();
    currentPanel.dispose();
    panel = undefined; // 清理引用
    panelVisible = false;
    updateStatusBar(false);
    await closeProjectManageTabs();
};
export const getPanelVisible = () => {
    return panelVisible;
};
export const getPanel = () => {
    return panel;
};

// command目前只有useMessage带了command后缀的方法以及../types.ts定义的EventTypes
export const postMessage = (currentPanel: vscode.WebviewPanel, msg: MessageParams<any>) => {
    return currentPanel.webview.postMessage({
        command: msg.command,
        data: msg.data,
        from: "vscode",
        to: "webview",
    });
};

export const openPanel = () => {
    vscode.commands.executeCommand(CommandTypes.open);
};
