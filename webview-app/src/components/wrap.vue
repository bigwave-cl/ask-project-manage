<template>
    <div class="ask-project-manage-wrap">
        <ProjectManageBackground />
        <div class="apm-shell">
            <ProjectCommandHeader
                v-model:search-keyword="searchKeyword"
                @toolbar-click="handleToolbarClick"
            />

            <ProjectTab v-model="groupActiveType" :list="groupList" />

            <div class="apm-list" :class="{ 'apm-list--empty': list.length === 0 }">
                <EmptyText v-if="groupList.length === 0">
                    <template #text>
                        <div>当前还没有分组数据，可以先添加分组，也可以直接从顶部导入项目</div>
                    </template>
                    <v-btn
                        v-tooltip:top="toolBarRule.addGroup.tip"
                        :prepend-icon="toolBarRule.addGroup.icon"
                        @click="handleToolbarClick('addGroup')"
                    >添加分组</v-btn>
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
import ProjectCommandHeader from "./commandHeader.vue";
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

    .apm-list {
        width: 100%;
        flex: 1;
        min-width: 300px;
        position: relative;
        overflow-y: auto;
        padding-bottom: 420px;
        scrollbar-width: thin;
        scrollbar-color: color-mix(in srgb, var(--apm-radio-silence) 26%, transparent) transparent;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 999px;
            background:
                linear-gradient(180deg, transparent, color-mix(in srgb, var(--apm-radio-silence) 32%, transparent), color-mix(in srgb, var(--apm-riviera) 18%, transparent), transparent);
            box-shadow: 0 0 10px color-mix(in srgb, var(--apm-radio-silence) 16%, transparent);
        }

        &.apm-list--empty {
            display: grid;
            place-items: center;
            overflow: hidden;
            padding-bottom: 280px;
        }
    }
}

@media (max-width: 860px) {
    .ask-project-manage-wrap {
        .apm-list {
            padding-bottom: 168px;
        }

        .apm-list--empty {
            padding-bottom: 168px;
        }

    }
}





</style>
