import * as vscode from "vscode";
import * as fs from "fs";
import { debugLog } from "./debug";
const openWorkspace = async (folderPath: string) => {
    debugLog("workspace.openWorkspace", "openWorkspace called", {
        folderPath,
    });
    if (!folderPath) {
        vscode.window.showErrorMessage("No path provided. Please pass a valid system path.");
        debugLog("workspace.openWorkspace", "missing workspace path");
        return;
    }

    // 检查路径是否存在
    if (!fs.existsSync(folderPath)) {
        vscode.window.showErrorMessage(`The path "${folderPath}" does not exist.`);
        debugLog("workspace.openWorkspace", "workspace path does not exist", {
            folderPath,
        });
        return;
    }

    const folderUri = vscode.Uri.file(folderPath);

    // 检查路径是否已经在工作区打开
    const openFolders = vscode.workspace.workspaceFolders;
    if (openFolders) {
        for (const folder of openFolders) {
            if (folder.uri.fsPath === folderUri.fsPath) {
                // 定位到当前窗口，重用已有窗口
                debugLog("workspace.openWorkspace", "workspace already in folders, execute openFolder", {
                    folderPath,
                    openInNewWindow: true,
                });
                await vscode.commands.executeCommand("vscode.openFolder", folderUri, true);
                return;
            }
        }
    }

    // 打开路径，在新窗口中
    const openInNewWindow = true; // 设置为 true 在新窗口打开
    try {
        debugLog("workspace.openWorkspace", "execute vscode.openFolder", {
            folderPath,
            openInNewWindow,
        });
        await vscode.commands.executeCommand("vscode.openFolder", folderUri, openInNewWindow);
        debugLog("workspace.openWorkspace", "vscode.openFolder resolved", {
            folderPath,
            openInNewWindow,
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to open the path "${folderPath}": ${error.message}`);
        debugLog("workspace.openWorkspace", "vscode.openFolder failed", {
            folderPath,
            message: error.message,
        });
    }
};
const chooseWorkspace = async () => {
    try {
        debugLog("workspace.chooseWorkspace", "showOpenDialog called");
        const allowedExtensions = [".code-workspace"];
        // 打开文件夹选择对话框
        const folders = await vscode.window.showOpenDialog({
            canSelectFolders: false, // 允许选择文件夹
            canSelectMany: true, // 允许多选
            openLabel: "Select Workspaces", // 对话框按钮文本

            filters: { "Allowed Files": allowedExtensions }, // 设置文件类型过滤器
        });
        const folderList = (folders || []).map(cur => cur.fsPath);
        debugLog("workspace.chooseWorkspace", "workspaces selected", {
            count: folderList.length,
            folderList,
        });
        // vscode.window.showInformationMessage(`Selected workspaces:\n${folderList.join("\n")}`);
        return folderList;
        // 在新窗口打开所选文件夹
        // await vscode.commands.executeCommand("vscode.openFolder", selectedFolderUri, true);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to open folder: ${error.message}`);
        debugLog("workspace.chooseWorkspace", "showOpenDialog failed", {
            message: error.message,
        });
        return [];
    }
};

export { openWorkspace, chooseWorkspace };
