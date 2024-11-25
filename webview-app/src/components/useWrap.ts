import { ref, watch } from "vue";
import { ProjectItemModel, ProjectGroupItemModel, ProjectConfigItemModel, FormDataModel } from "./types";
import {
    openWindow,
    chooseFolder,
    chooseWorkspace,
    getConfigList,
    updateProjectList,
    updateProjectListAll,
    removeProjectList,
} from "./postMessage";
import { buildConfigChildrenNode, buildConfigNode } from "./utils";
import InfoDialog from "./infoDialog.vue";
import { useToast } from "./toast";
export const useWrap = () => {
    const sourceList = ref<ProjectConfigItemModel[]>([]);
    const list = ref<ProjectItemModel[]>([]);
    const groupActiveType = ref("");
    const groupList = ref<ProjectGroupItemModel[]>([]);
    const initData = async () => {
        const response = await getConfigList();
        sourceList.value = response.data;
        buildGroupList();
        groupActiveType.value = groupActiveType.value || (groupList.value[0] ? groupList.value[0].key : "");
    };
    const buildGroupList = () => {
        groupList.value = sourceList.value.map(cur => {
            return {
                key: cur.key,
                label: cur.label,
            };
        });
    };
    const buildListByGroupActive = () => {
        list.value = [];
        const index = sourceList.value.findIndex(cur => cur.key === groupActiveType.value);
        if (index === -1) {
            return;
        }
        list.value = sourceList.value[index].children.map((cur, i) => {
            return {
                ...cur,
                // source: cur.source,
                sort: i,
            };
        });
        // list.value = Array.from({ length: 10 }).map((cur, i) => {
        //     const res: ProjectItemModel = {
        //         type: "folder",
        //         name: "我是name" + i + groupActiveType.value,
        //         key: "我是key" + i + groupActiveType.value,
        //         source: "我是source" + i + groupActiveType.value,
        //         path: "我是path" + i + groupActiveType.value,
        //         sort: i,
        //     };
        //     return res;
        // });
    };
    const onGroupChange = () => {
        buildListByGroupActive();
    };
    const handleItemClick = (item: ProjectItemModel) => {
        openWindow(item.type, item.path);
    };
    const addProjectByGroup = async (data: string[], type: ProjectItemModel["type"]) => {
        const currentIndex = sourceList.value.findIndex(cur => cur.key === groupActiveType.value);
        if (currentIndex === -1) {
            return;
        }
        const currentGroup = sourceList.value[currentIndex];
        const newChildren = data
            .map(item => {
                return buildConfigChildrenNode({
                    url: item,
                    type: type,
                });
            })
            .filter(cur => currentGroup.children.findIndex(subCur => subCur.path === cur.path) === -1);
        const item: ProjectConfigItemModel = {
            label: currentGroup.label,
            key: currentGroup.key,
            children: newChildren,
        };
        currentGroup.children.push(...newChildren);
        buildListByGroupActive();
        await updateProjectList(item);
    };
    const handleChooseFolderClick = async () => {
        const files = await chooseFolder();
        addProjectByGroup(files.data, "folder");
    };
    const handleChooseWorkspaceClick = async () => {
        const files = await chooseWorkspace();
        addProjectByGroup(files.data, "workspace");
    };
    const addGroup = async (name: string) => {
        const item: ProjectConfigItemModel = buildConfigNode(name);
        // 源数据添加内容
        sourceList.value.push(item);
        // 显示源数据添加内容
        groupList.value.push({
            label: item.label,
            key: item.key,
        });
        // 更改显示的分组内容区域
        groupActiveType.value = item.key;
        // 更新缓存配置信息
        updateProjectList(item);
    };
    const removeGroup = async (key: string) => {
        await removeProjectList(key);
        const index = sourceList.value.findIndex(cur => cur.key === key);
        if (index !== -1) {
            const proIndex = index === 0 ? index + 1 : index - 1;
            groupActiveType.value = sourceList.value[proIndex] ? sourceList.value[proIndex].key : "";
            sourceList.value.splice(index, 1);
            buildGroupList();
        }
    };
    const removeProjectByGroup = async (key: string, keys: string[]) => {
        await removeProjectList(key, keys);
        const index = sourceList.value.findIndex(cur => cur.key === key);
        if (index !== -1) {
            sourceList.value[index].children = sourceList.value[index].children.filter(cur => !keys.includes(cur.key));
            buildListByGroupActive();
        }
    };
    const infoDialogRef = ref<InstanceType<typeof InfoDialog> | null>(null);
    const onInfoDialogSure = (formData: FormDataModel) => {
        addGroup(formData.name || "");
        infoDialogRef.value?.resetEditForm();
    };

    const isSettingState = ref(false);
    const toolBarRule: {
        [key: string]: {
            action: Function;
            icon: string;
            tip: string;
        };
    } = {
        chooseFolder: {
            action: () => {
                handleChooseFolderClick();
            },
            icon: "mdi-file-document-plus-outline",
            tip: "导入文件夹（可多选）",
        },
        chooseWorkspace: {
            action: () => {
                handleChooseWorkspaceClick();
            },
            icon: "mdi-book-plus-multiple-outline",
            tip: "导入工作区（可多选）",
        },
        // 'removeProjectByGroup': {
        // action: () => {
        //     removeProjectByGroup(groupActiveType, [list[0].key]);
        // },
        // tip: "";
        // },
        addGroup: {
            action: () => {
                infoDialogRef.value?.openEdit({
                    title: "添加分组",
                    nameLabel: "分组名称",
                });
            },
            icon: "mdi-view-grid-plus-outline",
            tip: "添加分组",
        },
        removeGroup: {
            action: () => {
                removeGroup(groupActiveType.value);
            },
            icon: "mdi-trash-can-outline",
            tip: "删除当前分组",
        },
        setting: {
            action: () => {
                isSettingState.value = true;
            },
            icon: "mdi-cog-outline",
            tip: "进入管理模式",
        },
    };
    const toolBarList = Object.entries(toolBarRule).map(([key, value]) => {
        return {
            key,
            icon: value.icon,
            tip: value.tip,
        };
    });
    const handleToolbarClick = (type: string) => {
        const current = toolBarRule[type];
        if (!current) {
            return;
        }
        const rule = [
            'chooseFolder',
            'chooseWorkspace',
            'removeGroup',
        ]
        if (rule.includes(type) && groupList.value.length === 0) {
            useToast("请先添加一个分组信息！！！");
            return;
        }
        current.action();
    };
    const onSaveSetting = async (newList: ProjectConfigItemModel[]) => {
        await updateProjectListAll(newList);
        await initData();
        buildListByGroupActive();
    };
    watch(groupActiveType, () => {
        onGroupChange();
    });
    initData();
    return {
        sourceList,
        list,
        groupActiveType,
        groupList,
        onGroupChange,
        handleItemClick,
        handleChooseFolderClick,
        handleChooseWorkspaceClick,
        removeProjectByGroup,
        addGroup,
        removeGroup,
        handleToolbarClick,
        toolBarList,
        isSettingState,
        onSaveSetting,
        infoDialogRef,
        onInfoDialogSure,
        toolBarRule,
    };
};
