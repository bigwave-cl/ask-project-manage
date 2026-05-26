import * as vscode from "vscode";
import * as fs from "fs";
import { debugLog } from "./debug";
const openFolder = async (folderPath: string) => {
    debugLog("folder.openFolder", "openFolder called", {
        folderPath,
    });
    if (!folderPath) {
        vscode.window.showErrorMessage("No path provided. Please pass a valid system path.");
        debugLog("folder.openFolder", "missing folder path");
        return;
    }

    // 检查路径是否存在
    if (!fs.existsSync(folderPath)) {
        vscode.window.showErrorMessage(`The path "${folderPath}" does not exist.`);
        debugLog("folder.openFolder", "folder path does not exist", {
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
                debugLog("folder.openFolder", "folder already in workspace, execute openFolder", {
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
        debugLog("folder.openFolder", "execute vscode.openFolder", {
            folderPath,
            openInNewWindow,
        });
        await vscode.commands.executeCommand("vscode.openFolder", folderUri, openInNewWindow);
        debugLog("folder.openFolder", "vscode.openFolder resolved", {
            folderPath,
            openInNewWindow,
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to open the path "${folderPath}": ${error.message}`);
        debugLog("folder.openFolder", "vscode.openFolder failed", {
            folderPath,
            message: error.message,
        });
    }
};

const chooseFolder = async () => {
    try {
        debugLog("folder.chooseFolder", "showOpenDialog called");
        // 打开文件夹选择对话框
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFolders: true, // 允许选择文件夹
            canSelectFiles: false, // 禁止选择文件
            canSelectMany: true,
            openLabel: "Open Folder", // 对话框按钮的文本
        });

        // 如果没有选择任何文件夹，直接返回
        if (!folderUri || folderUri.length === 0) {
            vscode.window.showWarningMessage("No folder selected.");
            debugLog("folder.chooseFolder", "no folder selected");
            return [];
        }

        // 获取选择的文件夹 URI
        // const selectedFolderUri = folderUri[0];
        const folderList = folderUri.map(cur => cur.path);
        debugLog("folder.chooseFolder", "folders selected", {
            count: folderList.length,
            folderList,
        });
        return folderList;
        // 在新窗口打开所选文件夹
        // await vscode.commands.executeCommand("vscode.openFolder", selectedFolderUri, true);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to open folder: ${error.message}`);
        debugLog("folder.chooseFolder", "showOpenDialog failed", {
            message: error.message,
        });
        return [];
    }
};

export { openFolder, chooseFolder };
