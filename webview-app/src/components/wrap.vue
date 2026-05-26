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
                >
                    <template #text>
                        <div class="apm-empty-guide">
                            <strong>当前分组还没有项目符牌</strong>
                            <span>先导入一个文件夹或工作区，项目会自动收纳到当前分组。</span>
                        </div>
                    </template>
                    <div class="apm-empty-actions">
                        <v-btn
                            v-tooltip:top="toolBarRule.chooseFolder.tip"
                            :prepend-icon="toolBarRule.chooseFolder.icon"
                            @click="handleToolbarClick('chooseFolder')"
                        >导入文件夹</v-btn>
                        <v-btn
                            v-tooltip:top="toolBarRule.chooseWorkspace.tip"
                            :prepend-icon="toolBarRule.chooseWorkspace.icon"
                            @click="handleToolbarClick('chooseWorkspace')"
                        >导入工作区</v-btn>
                    </div>
                    <div class="apm-empty-hint">
                        <span>也可以使用顶部搜索清空关键词，查看当前分组的全部项目。</span>
                    </div>
                </EmptyText>
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

.apm-empty-guide {
    display: grid;
    gap: 8px;
    justify-items: center;
    max-width: min(560px, 86vw);

    strong {
        color: var(--apm-text-main);
        font-size: 18px;
        line-height: 1.35;
        font-weight: 800;
        letter-spacing: 0;
        text-shadow: 0 0 18px color-mix(in srgb, var(--apm-radio-silence) 22%, transparent);
    }

    span {
        color: color-mix(in srgb, var(--apm-faded-letter) 78%, transparent);
        font-size: 14px;
        line-height: 1.7;
    }
}

.apm-empty-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;

    :deep(.v-btn) {
        min-width: 128px;
        min-height: 38px;
        border-radius: 16px;
        font-weight: 800;
        letter-spacing: 0;
    }

    :deep(.v-btn:first-child) {
        color: #73eaff;
    }

    :deep(.v-btn:last-child) {
        color: var(--apm-mamas-new-bag);
        border-color: color-mix(in srgb, var(--apm-mamas-new-bag) 40%, transparent);
        box-shadow:
            0 0 22px color-mix(in srgb, var(--apm-mamas-new-bag) 16%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, .08);
    }
}

.apm-empty-hint {
    margin-top: 14px;
    color: color-mix(in srgb, var(--apm-faded-letter) 56%, transparent);
    font-size: 12px;
    line-height: 1.6;
    text-align: center;
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
