import { computed, onUnmounted, ref, watch } from "vue";
import {
    ProjectItemModel,
    ProjectGroupItemModel,
    ProjectConfigItemModel,
    ProjectRenderItemModel,
    FormDataModel,
    EventTypes,
} from "./types";
import {
    openWindow,
    chooseFolder,
    chooseWorkspace,
    getConfigList,
    updateProjectList,
    updateProjectListAll,
    removeProjectList,
    useMessageObserver,
} from "./postMessage";
import { buildConfigChildrenNode, buildConfigNode } from "./utils";
import InfoDialog from "./infoDialog.vue";
import { useToast } from "./toast";
export const useWrap = () => {
    const sourceList = ref<ProjectConfigItemModel[]>([]);
    const list = ref<ProjectRenderItemModel[]>([]);
    const currentItemPath = ref("");
    const groupActiveType = ref("all");
    const searchKeyword = ref("");
    const groupList = ref<ProjectGroupItemModel[]>([]);
    const currentGroupLabel = computed(() => {
        if (groupActiveType.value === "all") {
            return "全部分组";
        }
        return groupList.value.find(cur => cur.key === groupActiveType.value)?.label || "未选择分组";
    });
    const totalProjectCount = computed(() => {
        return sourceList.value.reduce((total, group) => total + group.children.length, 0);
    });
    const workspaceCount = computed(() => {
        return sourceList.value.reduce((total, group) => {
            return total + group.children.filter(item => item.type === "workspace").length;
        }, 0);
    });
    const folderCount = computed(() => totalProjectCount.value - workspaceCount.value);
    const initData = async () => {
        const response = await getConfigList();
        sourceList.value = response.data;
        buildGroupList();
        if (groupActiveType.value !== "all" && groupList.value.findIndex(cur => cur.key === groupActiveType.value) === -1) {
            groupActiveType.value = "all";
        }
        buildListByGroupActive();
    };
    const buildGroupList = () => {
        groupList.value = [
            {
                key: "all",
                label: "全部",
            },
            ...sourceList.value.map(cur => {
                return {
                    key: cur.key,
                    label: cur.label,
                };
            }),
        ];
    };
    const normalizeText = (value: string) => value.toLocaleLowerCase().trim();
    const isSamePath = (currentPath: string, itemPath: string) => {
        if (!currentPath || !itemPath) {
            return false;
        }
        return currentPath === itemPath || currentPath.endsWith(itemPath) || itemPath.endsWith(currentPath);
    };
    const buildListByGroupActive = () => {
        const keyword = normalizeText(searchKeyword.value);
        const renderGroups =
            groupActiveType.value === "all"
                ? sourceList.value
                : sourceList.value.filter(cur => cur.key === groupActiveType.value);

        list.value = renderGroups.flatMap(group => {
            return group.children
                .map((cur, i) => {
                    return {
                        ...cur,
                        sort: i,
                        groupKey: group.key,
                        groupLabel: group.label,
                        isCurrent: isSamePath(currentItemPath.value, cur.path),
                    };
                })
                .filter(cur => {
                    if (!keyword) {
                        return true;
                    }
                    return [cur.name, cur.path, cur.source, cur.groupLabel, cur.type].some(value => {
                        return normalizeText(value || "").includes(keyword);
                    });
                });
        });
    };
    const onGroupChange = () => {
        buildListByGroupActive();
    };
    const handleItemClick = (item: ProjectItemModel) => {
        openWindow(item.type, item.path);
    };
    const copyProjectPath = async (item: ProjectItemModel) => {
        try {
            await navigator.clipboard.writeText(item.path);
            useToast("路径已复制");
        } catch (error) {
            useToast("复制失败，请在详情里手动复制");
        }
    };
    const removeProject = async (item: ProjectRenderItemModel) => {
        await removeProjectByGroup(item.groupKey, [item.key]);
        useToast("项目已删除");
    };
    const editProject = (item: ProjectRenderItemModel) => {
        infoDialogRef.value?.openEdit({
            title: "编辑项目符名",
            nameLabel: "项目名称",
            name: item.name,
            groupKey: item.groupKey,
            listKey: item.key,
            subInfo: "project-name",
        });
    };
    const addProjectByGroup = async (data: string[], type: ProjectItemModel["type"]) => {
        if (groupActiveType.value === "all" && sourceList.value.length === 0) {
            await addGroup("默认分组");
        }
        if (groupActiveType.value === "all" && sourceList.value[0]) {
            groupActiveType.value = sourceList.value[0].key;
        }
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
        if (key === "all") {
            useToast("请选择一个具体分组");
            return;
        }
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
        if (formData.subInfo === "project-name") {
            const currentIndex = sourceList.value.findIndex(cur => cur.key === formData.groupKey);
            if (currentIndex !== -1) {
                const current = sourceList.value[currentIndex];
                const subIndex = current.children.findIndex(cur => cur.key === formData.listKey);
                if (subIndex !== -1) {
                    current.children[subIndex].name = formData.name || "";
                    updateProjectListAll(sourceList.value);
                    buildListByGroupActive();
                }
            }
            infoDialogRef.value?.resetEditForm();
            return;
        }
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
        const rule = ["removeGroup"];
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
    watch(searchKeyword, () => {
        buildListByGroupActive();
    });
    initData();
    const updateGlobalData = async () => {
        await initData();
        buildListByGroupActive();
    };
    const messageObserver = useMessageObserver();
    messageObserver.add(EventTypes.updateConfigPanel, updateGlobalData);
    messageObserver.add(EventTypes.updateWindowInfo, (data: { path: string })=>{
        currentItemPath.value = data.path;
        buildListByGroupActive();
    });
    onUnmounted(() => {
        messageObserver?.destroy();
    });
    return {
        sourceList,
        list,
        searchKeyword,
        groupActiveType,
        groupList,
        currentGroupLabel,
        totalProjectCount,
        workspaceCount,
        folderCount,
        onGroupChange,
        handleItemClick,
        copyProjectPath,
        removeProject,
        editProject,
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
