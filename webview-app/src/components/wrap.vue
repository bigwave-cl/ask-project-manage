<template>
    <div class="ask-project-manage-wrap">
        <ProjectManageBackground />
        <div class="apm-shell">
            <header class="apm-command">
                <div class="apm-command__identity">
                    <div class="apm-command__sigil">
                        <v-icon icon="mdi-creation-outline"></v-icon>
                    </div>
                    <div>
                        <div class="apm-command__eyebrow">Ling Shu Console</div>
                        <h1>灵枢项目台</h1>
                    </div>
                </div>
                <div class="apm-command__search">
                    <v-text-field
                        v-model="searchKeyword"
                        density="compact"
                        variant="solo-filled"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        hide-details
                        label="搜索项目、路径、分组"
                    ></v-text-field>
                </div>
                <div class="apm-command__actions">
                    <v-btn
                        variant="tonal"
                        color="cyan-lighten-2"
                        prepend-icon="mdi-folder-plus-outline"
                        @click="handleToolbarClick('chooseFolder')"
                    >文件夹</v-btn>
                    <v-btn
                        variant="tonal"
                        color="deep-purple-lighten-2"
                        prepend-icon="mdi-book-plus-multiple-outline"
                        @click="handleToolbarClick('chooseWorkspace')"
                    >工作区</v-btn>
                    <v-menu location="bottom end">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-dots-grid" variant="text"></v-btn>
                        </template>
                        <v-list density="compact" class="apm-menu">
                            <v-list-item prepend-icon="mdi-view-grid-plus-outline" title="添加分组" @click="handleToolbarClick('addGroup')"></v-list-item>
                            <v-list-item prepend-icon="mdi-cog-outline" title="批量管理" @click="handleToolbarClick('setting')"></v-list-item>
                            <v-list-item prepend-icon="mdi-trash-can-outline" title="删除当前分组" @click="handleToolbarClick('removeGroup')"></v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </header>

            <ProjectTab v-model="groupActiveType" :list="groupList" />

            <div class="apm-list">
                <EmptyText v-if="groupList.length === 0">
                    <template #text>
                        <div>当前还没有分组数据，可以先添加分组，也可以直接从顶部导入项目</div>
                    </template>
                    <v-btn size="60" v-tooltip:top="toolBarRule.addGroup.tip" :icon="toolBarRule.addGroup.icon"
                        @click="handleToolbarClick('addGroup')"></v-btn>
                </EmptyText>
                <EmptyText
                    v-if="groupList.length > 0 && groupActiveType && list.length === 0"
                    text="当前没有匹配的项目符牌，试试换个关键词或导入一个项目"
                ></EmptyText>
                <ProjectList
                    v-show="list.length > 0"
                    :list="list"
                    @item-click="handleItemClick"
                    @item-copy="copyProjectPath"
                    @item-edit="editProject"
                    @item-remove="removeProject"
                ></ProjectList>
            </div>

            <ProjectHudDashboard
                :current-group-label="currentGroupLabel"
                :total-project-count="totalProjectCount"
                :folder-count="folderCount"
                :workspace-count="workspaceCount"
                :group-count="groupList.length"
            />
        </div>
    </div>
    <ProjectSetting v-model="isSettingState" :list="sourceList" @save-setting="onSaveSetting" />

    <InfoDialog ref="infoDialogRef" @sure="onInfoDialogSure"></InfoDialog>
</template>
<script setup lang="ts">
import ProjectTab from "./tab.vue";
import ProjectList from "./list.vue";
import ProjectSetting from "./setting.vue"
import InfoDialog from "./infoDialog.vue"
import EmptyText from "./empty.vue"
import ProjectManageBackground from "./background.vue";
import ProjectHudDashboard from "./projectHudDashboard.vue";
import { useWrap } from "./useWrap"
defineOptions({
    name: "ProjectManageWrap"
})
const {
    sourceList,
    list,
    searchKeyword,
    handleItemClick,
    copyProjectPath,
    removeProject,
    editProject,
    handleToolbarClick,
    groupActiveType,
    groupList,
    currentGroupLabel,
    totalProjectCount,
    workspaceCount,
    folderCount,
    isSettingState,
    onSaveSetting,
    infoDialogRef,
    onInfoDialogSure,
    toolBarRule
} = useWrap();

</script>
<style lang="scss" scoped>
.ask-project-manage-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    color: var(--apm-text-main);
    background:
        radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--apm-radio-silence) 12%, transparent), transparent 26%),
        radial-gradient(circle at 86% 8%, color-mix(in srgb, var(--apm-mamas-new-bag) 12%, transparent), transparent 24%),
        linear-gradient(135deg, var(--apm-bg-deep) 0%, color-mix(in srgb, var(--apm-dinner-party) 24%, #090f10) 42%, #070b0e 100%);

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-image:
            linear-gradient(color-mix(in srgb, var(--apm-radio-silence) 7%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--apm-radio-silence) 6%, transparent) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: radial-gradient(circle at center, black, transparent 78%);
    }

    .apm-shell {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 22px 24px 0;
        gap: 16px;
    }

    .apm-command {
        display: grid;
        grid-template-columns: minmax(220px, 320px) minmax(260px, 1fr) auto;
        gap: 16px;
        align-items: center;
    }

    .apm-command__identity {
        display: flex;
        align-items: center;
        gap: 14px;

        h1 {
            margin: 0;
            font-size: 22px;
            line-height: 1.1;
            letter-spacing: 0;
            font-weight: 650;
        }
    }

    .apm-command__eyebrow {
        color: var(--apm-text-muted);
        font-size: 11px;
        text-transform: uppercase;
    }

    .apm-command__sigil {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 42%, transparent);
        border-radius: 14px;
        background: linear-gradient(145deg, color-mix(in srgb, var(--apm-radio-silence) 22%, transparent), color-mix(in srgb, var(--apm-mamas-new-bag) 16%, transparent));
        box-shadow: 0 0 28px color-mix(in srgb, var(--apm-radio-silence) 20%, transparent), inset 0 0 22px rgba(255, 255, 255, .06);
        color: var(--apm-radio-silence);
        font-size: 24px;
    }

    .apm-command__search {
        :deep(.v-field) {
            border: 1px solid var(--apm-border-subtle);
            border-radius: 14px;
            background: rgba(5, 12, 14, .58);
            box-shadow: inset 0 0 24px color-mix(in srgb, var(--apm-radio-silence) 7%, transparent);
        }
    }

    .apm-command__actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;

        .v-btn {
            border-radius: 12px;
        }
    }

    .apm-list {
        width: 100%;
        flex: 1;
        min-width: 300px;
        position: relative;
        overflow-y: auto;
        padding-bottom: 420px;
    }
}

.apm-menu {
    border: 1px solid var(--apm-border-subtle);
    background: rgba(18, 23, 25, .96);
}

@media (max-width: 860px) {
    .ask-project-manage-wrap {
        .apm-command {
            grid-template-columns: 1fr;
        }

        .apm-command__actions {
            justify-content: flex-start;
            flex-wrap: wrap;
        }

        .apm-list {
            padding-bottom: 168px;
        }

    }
}





</style>
