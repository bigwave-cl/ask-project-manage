import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import * as yaml from "js-yaml";
import type { ProjectConfigItemModel, ProjectItemModel } from "../types";

type ConfigFileFormat = "json" | "yml";

type ConfigFilePayload = {
    name: "ask-project-manage";
    version: 1;
    exportedAt: string;
    config: {
        list: ProjectConfigItemModel[];
    };
};

const backupFileName = "ask-project-manage.config";

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toText = (value: unknown, fallback = "") => {
    return typeof value === "string" ? value : fallback;
};

const toProjectType = (value: unknown): ProjectItemModel["type"] => {
    return value === "folder" ? "folder" : "workspace";
};

const buildFallbackKey = (prefix: string, index: number) => {
    return `${prefix}-${Date.now()}-${index}`;
};

const normalizeProjectItem = (value: unknown, groupIndex: number, index: number): ProjectItemModel => {
    if (!isRecord(value)) {
        throw new Error(`第 ${index + 1} 个项目配置无效`);
    }

    const pathValue = toText(value.path);
    if (!pathValue) {
        throw new Error(`第 ${index + 1} 个项目缺少 path 字段`);
    }

    const name = toText(value.name) || path.basename(pathValue).replace(/\.code-workspace$/i, "");

    return {
        name,
        key: toText(value.key, buildFallbackKey(`project-${groupIndex}`, index)),
        source: toText(value.source, pathValue),
        path: pathValue,
        type: toProjectType(value.type),
    };
};

const normalizeConfigList = (value: unknown): ProjectConfigItemModel[] => {
    const payload = isRecord(value) ? value : {};
    const config = isRecord(payload.config) ? payload.config : {};
    const legacyConfig = isRecord(payload["ask-project-manage.config"]) ? payload["ask-project-manage.config"] : {};
    const list = payload.list || config.list || legacyConfig.list;

    if (!Array.isArray(list)) {
        throw new Error("配置文件缺少 list 数组");
    }

    return list.map((item, groupIndex) => {
        if (!isRecord(item)) {
            throw new Error(`第 ${groupIndex + 1} 个分组配置无效`);
        }

        const label = toText(item.label, `分组${groupIndex + 1}`);
        const children = Array.isArray(item.children) ? item.children : [];

        return {
            key: toText(item.key, buildFallbackKey("group", groupIndex)),
            label,
            children: children.map((child, childIndex) => normalizeProjectItem(child, groupIndex, childIndex)),
        };
    });
};

const createPayload = (list: ProjectConfigItemModel[]): ConfigFilePayload => {
    return {
        name: "ask-project-manage",
        version: 1,
        exportedAt: new Date().toISOString(),
        config: {
            list,
        },
    };
};

const getFormatByPath = (filePath: string): ConfigFileFormat => {
    return /\.ya?ml$/i.test(filePath) ? "yml" : "json";
};

const getDefaultExportUri = (fileName: string) => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (workspaceUri) {
        return vscode.Uri.joinPath(workspaceUri, fileName);
    }
    return vscode.Uri.file(path.join(os.homedir(), fileName));
};

const serializeConfig = (list: ProjectConfigItemModel[], format: ConfigFileFormat) => {
    const payload = createPayload(list);
    if (format === "yml") {
        return yaml.dump(payload, {
            lineWidth: 120,
            noRefs: true,
            sortKeys: false,
        });
    }
    return JSON.stringify(payload, null, 2);
};

const parseConfig = (content: string, format: ConfigFileFormat) => {
    const payload = format === "yml" ? yaml.load(content) : JSON.parse(content);
    return normalizeConfigList(payload);
};

const exportConfigFile = async (list: ProjectConfigItemModel[], format: ConfigFileFormat) => {
    const extension = format === "yml" ? "yml" : "json";
    const uri = await vscode.window.showSaveDialog({
        defaultUri: getDefaultExportUri(`${backupFileName}.${extension}`),
        filters: format === "yml" ? { "YML 配置": ["yml"] } : { "JSON 配置": ["json"] },
        saveLabel: "导出配置",
    });

    if (!uri) {
        return {
            cancelled: true,
            message: "已取消导出配置",
        };
    }

    await vscode.workspace.fs.writeFile(uri, Buffer.from(serializeConfig(list, format), "utf8"));

    return {
        cancelled: false,
        message: `配置已导出为 ${format === "yml" ? "YML" : "JSON"}`,
    };
};

const importConfigFile = async () => {
    const uris = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        openLabel: "导入配置",
        filters: {
            "配置文件": ["json", "yml"],
        },
    });

    const uri = uris?.[0];
    if (!uri) {
        return {
            cancelled: true,
            message: "已取消导入配置",
            list: [] as ProjectConfigItemModel[],
        };
    }

    const content = Buffer.from(await vscode.workspace.fs.readFile(uri)).toString("utf8");
    const list = parseConfig(content, getFormatByPath(uri.fsPath));

    return {
        cancelled: false,
        message: `配置已导入：${list.length} 个分组，${list.reduce((total, item) => total + item.children.length, 0)} 个项目`,
        list,
    };
};

export { exportConfigFile, importConfigFile };
export type { ConfigFileFormat };
