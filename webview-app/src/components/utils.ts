import type { ProjectChooseInfo, ProjectConfigItemModel } from "./types";
let configChildrenNodeKey = 0;
let configNodeKey = 0;
const createKeyString = (id: number) => {
    return "key-" + id + "-" + +new Date();
};
const buildConfigChildrenNode = (item: ProjectChooseInfo): ProjectConfigItemModel["children"][number] => {
    const isWorkspace = item.type === "workspace";
    const lastMatch = item.url.match(/[^\/]+$/);
    let lastInfo = lastMatch ? lastMatch[0] || "" : "";
    if (isWorkspace && lastInfo) {
        lastInfo = lastInfo.replace(/.[^\.]+$/, "");
    }
    return {
        name: lastInfo,
        key: createKeyString(configChildrenNodeKey++),
        source: item.url,
        path: item.url,
        type: item.type,
    };
};
const buildConfigNode = (label: string): ProjectConfigItemModel => {
    return {
        key: createKeyString(configNodeKey++),
        label: label,
        children: [],
    };
};

export { buildConfigChildrenNode, buildConfigNode };
