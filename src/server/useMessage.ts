import * as vscode from "vscode";
import type { MessageParams, CommandHandlerData, ProjectConfigItemModel } from "../types";
import { openFolder, chooseFolder } from "./folder.hook";
import { openWorkspace, chooseWorkspace } from "./workspace.hook";
import { useConfig } from "./config";
class MessageEventHandler {
    configInstance: ReturnType<typeof useConfig> | null = null;
    constructor(options: { panel: vscode.WebviewPanel; context: vscode.ExtensionContext }) {
        const { context } = options;
        this.configInstance = useConfig(context);
    }
    async executeCommand(message: MessageParams<any>) {
        const commandName = message.command.replace(/(\-.{1,1})/gi, s => {
            return s[1].toUpperCase();
        });
        const methodName = (commandName + "Command") as keyof MessageEventHandler;
        if (this[methodName] && typeof this[methodName] === "function") {
            const response = (await this[methodName](message.data)) as unknown as CommandHandlerData<any>;
            return {
                code: response.code || 200,
                data: response.data || "执行完成",
            };
        } else {
            return {
                code: 400,
                data: 'command: "' + message.command + '" 不存在',
            };
        }
    }

    async getConfigListCommand(data: MessageParams<{}>["data"]): Promise<CommandHandlerData<ProjectConfigItemModel[]>> {
        const list = await this.configInstance?.getProjectList();
        return { data: list || [] };
    }
    async updateProjectListCommand(
        data: MessageParams<{ item: ProjectConfigItemModel }>["data"]
    ): Promise<CommandHandlerData<string>> {
        await this.configInstance?.updateProjectListByKey(data.item);
        return { data: "执行成功" };
    }
    async updateProjectListAllCommand(
        data: MessageParams<{ list: ProjectConfigItemModel[] }>["data"]
    ): Promise<CommandHandlerData<string>> {
        await this.configInstance?.updateProjectListAll(data.list);
        return { data: "执行成功" };
    }
    async removeProjectListCommand(
        data: MessageParams<{ key: string; subKey?: string[] }>["data"]
    ): Promise<CommandHandlerData<string>> {
        console.log("data.subKey", data.subKey);
        await this.configInstance?.removeProjectListByKey(data.key, data.subKey);
        return { data: "执行成功" };
    }
    async clearProjectListCommand(
        data: MessageParams<{  }>["data"]
    ): Promise<CommandHandlerData<string>> {
        await this.configInstance?.clearProjectList();
        return { data: "执行成功" };
    }
    async openFolderCommand(
        data: MessageParams<{
            path: string;
        }>["data"]
    ): Promise<CommandHandlerData<string>> {
        await openFolder(data.path);
        return { data: "执行成功" };
    }
    async chooseFolderCommand(data: MessageParams<{}>["data"]): Promise<CommandHandlerData<any[]>> {
        const files = await chooseFolder();
        return { data: files };
    }
    async openWorkspaceCommand(
        data: MessageParams<{
            path: string;
        }>["data"]
    ): Promise<CommandHandlerData<string>> {
        await openWorkspace(data.path);
        return { data: "执行成功" };
    }
    async chooseWorkspaceCommand(data: MessageParams<{}>["data"]): Promise<CommandHandlerData<any[]>> {
        const files = await chooseWorkspace();
        return { data: files };
    }
}
const useMessage = (options: { panel: vscode.WebviewPanel; context: vscode.ExtensionContext }) => {
    const { panel, context } = options;
    const messageEventHandler = new MessageEventHandler(options);
    panel.webview.onDidReceiveMessage(
        async message => {
            const response = await messageEventHandler.executeCommand(message);
            panel.webview.postMessage({
                command: message.command + "-callback",
                data: response,
                from: "vscode",
                to: "webview",
            });
        },
        undefined,
        context.subscriptions
    );
};

export { useMessage };