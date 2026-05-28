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
        return context.globalState.update(configName, {
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
        return updateProjectList(list);
    };
    // 修改和新增
    const updateProjectListAll = (list: ProjectConfigItemModel[]) => {
        return updateProjectList(list);
    };
    const createUniqueKey = (prefix: string, usedKeys: Set<string>) => {
        let index = 0;
        let key = "";
        do {
            key = `${prefix}-${Date.now()}-${index++}`;
        } while (usedKeys.has(key));
        usedKeys.add(key);
        return key;
    };
    const createUniqueGroupLabel = (label: string, usedLabels: Set<string>) => {
        const baseLabel = label.trim() || "未命名分组";
        if (!usedLabels.has(baseLabel)) {
            usedLabels.add(baseLabel);
            return {
                label: baseLabel,
                renamed: false,
            };
        }
        let index = 1;
        let nextLabel = `${baseLabel}(${index})`;
        while (usedLabels.has(nextLabel)) {
            index += 1;
            nextLabel = `${baseLabel}(${index})`;
        }
        usedLabels.add(nextLabel);
        return {
            label: nextLabel,
            renamed: true,
        };
    };
    const mergeProjectList = async (importList: ProjectConfigItemModel[]) => {
        const list = getProjectList().slice();
        const usedLabels = new Set(list.map(cur => cur.label));
        const usedKeys = new Set<string>();
        let renamedGroupCount = 0;
        let projectCount = 0;

        list.forEach(group => {
            usedKeys.add(group.key);
            group.children.forEach(project => {
                usedKeys.add(project.key);
            });
        });

        const nextList = importList.map(group => {
            const groupLabel = createUniqueGroupLabel(group.label, usedLabels);
            if (groupLabel.renamed) {
                renamedGroupCount += 1;
            }
            const children = group.children.map(project => {
                projectCount += 1;
                return {
                    ...project,
                    key: createUniqueKey("project", usedKeys),
                };
            });
            return {
                key: createUniqueKey("group", usedKeys),
                label: groupLabel.label,
                children,
            };
        });

        await updateProjectList(list.concat(nextList));

        return {
            groupCount: nextList.length,
            projectCount,
            renamedGroupCount,
        };
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
            return updateProjectList(list);
        }
    };
    const clearProjectList = () => {
        return updateProjectList([]);
    };
    return {
        getProjectList,
        updateProjectListByKey,
        updateProjectListAll,
        mergeProjectList,
        removeProjectListByKey,
        clearProjectList,
    };
};

export { useConfig };
