import type { CommandHandlerData, MessageParams, ProjectConfigItemModel } from "./types";
const isDev = import.meta.env.DEV;
type PostMessageVsCodeModel = {
    postMessage: (opt: { command: string; data: any; from: "webview" | "vscode"; to: "webview" | "vscode" }) => void;
};
let PostMessageVsCode: PostMessageVsCodeModel | null = null;
const getVscode = () => {
    if (PostMessageVsCode) return PostMessageVsCode;
    if (isDev) {
        if (window && window.parent) {
            PostMessageVsCode = {
                postMessage: opt => {
                    window.parent.postMessage(opt, "*");
                },
            };
        }
    } else {
        // @ts-ignore
        if (window.acquireVsCodeApi) {
            // @ts-ignore
            PostMessageVsCode = window.acquireVsCodeApi();
        }
    }
    return PostMessageVsCode;
};
const promisePostMessage = <T extends any, K extends any>(
    options: MessageParams<T>
): Promise<CommandHandlerData<K>> => {
    return new Promise((resolve, reject) => {
        const vscode = getVscode();
        if (!vscode) {
            reject({
                code: 400,
                data: "未找到vscode对象" as K,
            });
            return;
        }
        console.log("options.data", options.data);
        vscode.postMessage({
            command: options.command,
            data: options.data,
            from: "webview",
            to: "vscode",
        });
        const handler = (event: MessageEvent<any>) => {
            const message = event.data as MessageParams<T>;
            console.log("message-receive", message);
            if (message.command === options.command + "-callback") {
                window.removeEventListener("message", handler);
                resolve(message.data as CommandHandlerData<K>);
            }
        };
        window.addEventListener("message", handler);
    });
};
const getConfigList = () => {
    return promisePostMessage<any, ProjectConfigItemModel[]>({
        command: "get-config-list",
        data: {},
    });
};
const updateProjectList = (item: ProjectConfigItemModel) => {
    return promisePostMessage({
        command: "update-project-list",
        data: {
            item: item,
        },
    });
};
const updateProjectListAll = (list: ProjectConfigItemModel[]) => {
    return promisePostMessage({
        command: "update-project-list-all",
        data: {
            list: list,
        },
    });
};
const removeProjectList = (key: string, subKey?: string[]) => {
    return promisePostMessage({
        command: "remove-project-list",
        data: {
            key,
            subKey,
        },
    });
};
const clearProjectList = () => {
    return promisePostMessage({
        command: "clear-project-list",
        data: {},
    });
};
const openFolder = (url: string) => {
    return promisePostMessage({
        command: "open-folder",
        data: {
            path: url,
        },
    });
};
const chooseFolder = () => {
    return promisePostMessage<any, any[]>({
        command: "choose-folder",
        data: {},
    });
};
const openWorkSpace = (url: string) => {
    return promisePostMessage({
        command: "open-workspace",
        data: {
            path: url,
        },
    });
};
const openWindow = (type: "workspace" | "folder", url: string) => {
    if (type === "workspace") {
        return openFolder(url);
    } else {
        return openWorkSpace(url);
    }
};

const chooseWorkspace = () => {
    return promisePostMessage<any, any[]>({
        command: "choose-workspace",
        data: {},
    });
};
export {
    openWindow,
    chooseFolder,
    chooseWorkspace,
    getConfigList,
    updateProjectList,
    updateProjectListAll,
    removeProjectList,
    clearProjectList,
};
