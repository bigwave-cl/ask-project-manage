import * as vscode from "vscode";
import { ProjectConfigItemModel } from "../types";
const configName = "ask-project-manage.config";
const useConfig = (context: vscode.ExtensionContext) => {
    const getProjectList = () => {
        const { list } = (context.globalState.get(configName) || {}) as {
            list: ProjectConfigItemModel[];
        };
        return list || [];
    };
    const updateProjectList = (list: ProjectConfigItemModel[]) => {
        context.globalState.update(configName, {
            list,
        });
    };
    // 修改和新增
    const updateProjectListByKey = (item: ProjectConfigItemModel) => {
        const list = getProjectList().slice();
        const index = list.findIndex(cur => cur.key === item.key);
        if (index !== -1) {
            const children = list[index].children;
            const addTemp: ProjectConfigItemModel["children"] = [];
            item.children.forEach(cur => {
                const cIndex = children.findIndex(subCur => subCur.path === cur.path);
                if (cIndex === -1) {
                    addTemp.push(cur);
                } else {
                    children[cIndex] = {
                        ...children[cIndex],
                        ...cur,
                    };
                }
            });
            list[index].children = children.concat(addTemp);
        } else {
            list.push({
                key: item.key,
                label: item.label,
                children: item.children,
            });
        }
        updateProjectList(list);
    };
    // 修改和新增
    const updateProjectListAll = (list: ProjectConfigItemModel[]) => {
        updateProjectList(list);
    };
    // 存在subKey就是对children 处理不处理父级group
    const removeProjectListByKey = (key: string, subKey?: string[]) => {
        const list = getProjectList().slice();
        const index = list.findIndex(cur => cur.key === key);
        if (index !== -1) {
            const currentItem = list[index];
            if(subKey && subKey.length > 0 && currentItem.children && currentItem.children.length > 0){
                currentItem.children = currentItem.children.filter(cur => !subKey.includes(cur.key));
            }else {
                list.splice(index, 1);
            }
            updateProjectList(list);
        }
    };
    const clearProjectList = () => {
        updateProjectList([]);
    };
    return {
        getProjectList,
        updateProjectListByKey,
        updateProjectListAll,
        removeProjectListByKey,
        clearProjectList,
    };
};

export { useConfig };
