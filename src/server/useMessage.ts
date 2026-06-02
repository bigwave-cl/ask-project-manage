import * as vscode from "vscode";
import type {
    MessageParams,
    CommandHandlerData,
    ProjectConfigItemModel,
    ProjectPreferencesModel,
} from "../types";
import { openFolder, chooseFolder } from "./folder.hook";
import { openWorkspace, chooseWorkspace } from "./workspace.hook";
import { useConfig } from "./config";
import { usePreferences } from "./preferences";
import { postMessage } from "./panel";
import { exportConfigFile, importConfigFile, type ConfigFileFormat } from "./configFile";
class MessageEventHandler {
    configInstance: ReturnType<typeof useConfig> | null = null;
    preferencesInstance: ReturnType<typeof usePreferences> | null = null;
    constructor(options: { panel: vscode.WebviewPanel; context: vscode.ExtensionContext }) {
        const { context } = options;
        this.configInstance = useConfig(context);
        this.preferencesInstance = usePreferences(context);
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
                data: response.data ?? "执行完成",
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
    async getPreferencesCommand(): Promise<CommandHandlerData<ProjectPreferencesModel>> {
        const preferences = this.preferencesInstance?.getPreferences();
        return { data: preferences! };
    }
    async shouldShowOnboardingCommand(): Promise<CommandHandlerData<boolean>> {
        const shouldShow = await this.preferencesInstance?.shouldShowOnboarding();
        return { data: Boolean(shouldShow) };
    }
    async markOnboardingSeenCommand(): Promise<CommandHandlerData<ProjectPreferencesModel>> {
        const preferences = await this.preferencesInstance?.markOnboardingSeen();
        return { data: preferences! };
    }
    async updatePreferencesCommand(
        data: MessageParams<{ preferences: ProjectPreferencesModel }>["data"]
    ): Promise<CommandHandlerData<ProjectPreferencesModel>> {
        await this.preferencesInstance?.updatePreferences(data.preferences);
        const preferences = this.preferencesInstance?.getPreferences();
        return { data: preferences! };
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
        await this.configInstance?.removeProjectListByKey(data.key, data.subKey);
        return { data: "执行成功" };
    }
    async clearProjectListCommand(
        data: MessageParams<{  }>["data"]
    ): Promise<CommandHandlerData<string>> {
        await this.configInstance?.clearProjectList();
        return { data: "执行成功" };
    }
    async importConfigCommand(): Promise<CommandHandlerData<{ message: string; cancelled?: boolean }>> {
        try {
            const result = await importConfigFile();
            let message = result.message;
            if (!result.cancelled) {
                const mergeResult = await this.configInstance?.mergeProjectList(result.list);
                const renameMessage = mergeResult?.renamedGroupCount
                    ? `，${mergeResult.renamedGroupCount} 个同名分组已自动重命名`
                    : "";
                message = `配置已合并导入：新增 ${mergeResult?.groupCount || 0} 个分组，${mergeResult?.projectCount || 0} 个项目${renameMessage}`;
            }
            return {
                data: {
                    message,
                    cancelled: result.cancelled,
                },
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "配置导入失败";
            return {
                code: 400,
                data: {
                    message,
                },
            };
        }
    }
    async exportConfigCommand(
        data: MessageParams<{ format?: ConfigFileFormat }>["data"]
    ): Promise<CommandHandlerData<{ message: string; cancelled?: boolean }>> {
        try {
            const format = data.format === "yml" ? "yml" : "json";
            const list = this.configInstance?.getProjectList() || [];
            const result = await exportConfigFile(list, format);
            return {
                data: {
                    message: result.message,
                    cancelled: result.cancelled,
                },
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "配置导出失败";
            return {
                code: 400,
                data: {
                    message,
                },
            };
        }
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
            postMessage(panel, {
                command: message.command + "-callback",
                data: response,
            });
        },
        undefined,
        context.subscriptions
    );
};

export { useMessage };
