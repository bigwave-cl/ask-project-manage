import { computed, onUnmounted, ref, watch } from "vue";
import {
    ProjectItemModel,
    ProjectGroupItemModel,
    ProjectConfigItemModel,
    ProjectRenderItemModel,
    FormDataModel,
    ProjectHudMetricKey,
    ProjectPreferencesModel,
    EventTypes,
} from "./types";
import {
    openWindow,
    chooseFolder,
    chooseWorkspace,
    getConfigList,
    getPreferences,
    shouldShowOnboarding,
    markOnboardingSeen,
    updatePreferences,
    updateProjectList,
    updateProjectListAll,
    removeProjectList,
    clearProjectList,
    importConfig,
    exportConfig,
    useMessageObserver,
} from "./postMessage";
import { buildConfigChildrenNode, buildConfigNode } from "./utils";
import InfoDialog from "./infoDialog.vue";
import ConfirmDialog from "./confirmDialog.vue";
import { useToast } from "./toast";
export const useWrap = () => {
    const defaultPreferences: ProjectPreferencesModel = {
        autoOpenPanel: true,
        hud: {
            visible: true,
            metrics: {
                project: true,
                folder: true,
                workspace: true,
                group: true,
            },
        },
        onboarding: {
            seen: false,
        },
    };
    const sourceList = ref<ProjectConfigItemModel[]>([]);
    const list = ref<ProjectRenderItemModel[]>([]);
    const preferences = ref<ProjectPreferencesModel>(defaultPreferences);
    const isOnboardingState = ref(false);
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
    const visibleHudMetricKeys = computed<ProjectHudMetricKey[]>(() => {
        if (!preferences.value.hud.visible) {
            return [];
        }
        return (Object.entries(preferences.value.hud.metrics) as [ProjectHudMetricKey, boolean][])
            .filter(([, visible]) => visible)
            .map(([key]) => key);
    });
    const shouldShowHud = computed(() => preferences.value.hud.visible && visibleHudMetricKeys.value.length > 0);
    const initPreferences = async () => {
        const response = await getPreferences();
        preferences.value = response.data;
        const onboardingResponse = await shouldShowOnboarding();
        if (onboardingResponse.data) {
            isOnboardingState.value = true;
        }
    };
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
    const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
    const confirmDanger = async (options: { title: string; content: string; confirmText?: string }) => {
        return await confirmDialogRef.value?.openConfirm(options);
    };
    const removeProject = async (item: ProjectRenderItemModel) => {
        const confirmed = await confirmDanger({
            title: "删除项目",
            content: `确认删除「${item.name}」吗？\n该项目会从「${item.groupLabel}」分组移除。`,
            confirmText: "删除项目",
        });
        if (!confirmed) {
            return;
        }
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
        await addProjectByGroup(files.data, "folder");
    };
    const handleChooseWorkspaceClick = async () => {
        const files = await chooseWorkspace();
        await addProjectByGroup(files.data, "workspace");
    };
    const getResponseMessage = (response: { code?: number; data?: string | { message?: string; cancelled?: boolean } }) => {
        if (typeof response.data === "string") {
            return response.data;
        }
        return response.data?.message || "执行完成";
    };
    const handleImportConfigClick = async () => {
        const response = await importConfig();
        useToast(getResponseMessage(response));
        if (response.code !== 200 || response.data.cancelled) {
            return;
        }
        await initData();
    };
    const handleExportConfigClick = async (format: "json" | "yml") => {
        const response = await exportConfig(format);
        useToast(getResponseMessage(response));
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
        if (sourceList.value.length === 0) {
            useToast("请先添加一个分组信息！！！");
            return;
        }
        if (key === "all") {
            const confirmed = await confirmDanger({
                title: "删除全部分组",
                content: `确认删除全部 ${sourceList.value.length} 个分组和 ${totalProjectCount.value} 个项目吗？\n这个操作会清空当前所有项目配置。`,
                confirmText: "删除全部",
            });
            if (!confirmed) {
                return;
            }
            await clearProjectList();
            sourceList.value = [];
            groupActiveType.value = "all";
            buildGroupList();
            buildListByGroupActive();
            useToast("全部分组已删除");
            return;
        }
        const index = sourceList.value.findIndex(cur => cur.key === key);
        if (index === -1) {
            return;
        }
        const currentGroup = sourceList.value[index];
        const confirmed = await confirmDanger({
            title: "删除分组",
            content: `确认删除「${currentGroup.label}」分组吗？\n分组内 ${currentGroup.children.length} 个项目也会一起移除。`,
            confirmText: "删除分组",
        });
        if (!confirmed) {
            return;
        }
        await removeProjectList(key);
        if (index !== -1) {
            const proIndex = index === 0 ? index + 1 : index - 1;
            groupActiveType.value = sourceList.value[proIndex] ? sourceList.value[proIndex].key : "all";
            sourceList.value.splice(index, 1);
            buildGroupList();
            buildListByGroupActive();
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
    const isPreferenceState = ref(false);
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
        importConfig: {
            action: () => {
                handleImportConfigClick();
            },
            icon: "mdi-database-import-outline",
            tip: "导入配置（JSON / YML）",
        },
        exportConfigJson: {
            action: () => {
                handleExportConfigClick("json");
            },
            icon: "mdi-code-json",
            tip: "导出 JSON 配置",
        },
        exportConfigYml: {
            action: () => {
                handleExportConfigClick("yml");
            },
            icon: "mdi-file-code-outline",
            tip: "导出 YML 配置",
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
        preferences: {
            action: () => {
                isPreferenceState.value = true;
            },
            icon: "mdi-tune-variant",
            tip: "设置",
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
        current.action();
    };
    const onSaveSetting = async (newList: ProjectConfigItemModel[]) => {
        await updateProjectListAll(newList);
        await initData();
        buildListByGroupActive();
    };
    const onSavePreferences = async (newPreferences: ProjectPreferencesModel) => {
        const response = await updatePreferences(newPreferences);
        preferences.value = response.data;
        useToast("设置已保存");
    };
    const openOnboardingGuide = () => {
        isOnboardingState.value = true;
    };
    const onFinishOnboardingGuide = async () => {
        const nextPreferences: ProjectPreferencesModel = {
            ...preferences.value,
            onboarding: {
                seen: true,
            },
        };
        preferences.value = nextPreferences;
        try {
            const response = await markOnboardingSeen();
            preferences.value = response.data;
        } catch (error) {
            useToast("新手引导状态保存失败，请稍后重试");
        }
    };
    watch(groupActiveType, () => {
        onGroupChange();
    });
    watch(searchKeyword, () => {
        buildListByGroupActive();
    });
    initPreferences();
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
        preferences,
        shouldShowHud,
        visibleHudMetricKeys,
        isOnboardingState,
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
        isPreferenceState,
        onSaveSetting,
        onSavePreferences,
        openOnboardingGuide,
        onFinishOnboardingGuide,
        infoDialogRef,
        confirmDialogRef,
        onInfoDialogSure,
        toolBarRule,
    };
};
