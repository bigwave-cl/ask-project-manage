<template>
    <div class="ask-project-manage-wrap">

        <ProjectTab v-model="groupActiveType" :list="groupList" />
        <div class="apm-list">
            <EmptyText v-if="groupList.length === 0">
                <template #text>
                    <div>当前还没有分组数据，点击下方按钮或者右下角功能按钮添加一个吧</div>
                    <div>只有一个分组的时候，不会展示分组信息哦！！！</div>
                </template>
                <v-btn size="60" v-tooltip:top="toolBarRule.addGroup.tip" :icon="toolBarRule.addGroup.icon"
                    @click="handleToolbarClick('addGroup')"></v-btn>
            </EmptyText>
            <EmptyText v-if="groupActiveType && list.length === 0" text="当前还没有项目数据，点击右下角功能按钮添加一个吧"></EmptyText>
            <ProjectList v-show="list.length > 0" :list="list" @item-click="handleItemClick"></ProjectList>
        </div>
        <div class="apm-fat-btn">
            <ToolBar :list="toolBarList" @item-click="handleToolbarClick"></ToolBar>
        </div>
    </div>
    <ProjectSetting v-model="isSettingState" :list="sourceList" @save-setting="onSaveSetting" />

    <InfoDialog ref="infoDialogRef" @sure="onInfoDialogSure"></InfoDialog>
</template>
<script setup lang="ts">
import ProjectTab from "./tab.vue";
import ProjectList from "./list.vue";
import ToolBar from "./toolbar.vue"
import ProjectSetting from "./setting.vue"
import InfoDialog from "./infoDialog.vue"
import EmptyText from "./empty.vue"
import { useWrap } from "./useWrap"
defineOptions({
    name: "ProjectManageWrap"
})
const {
    sourceList,
    list,
    handleItemClick,
    handleToolbarClick,
    toolBarList,
    groupActiveType,
    groupList,
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
    display: flex;
    flex-flow: row nowrap;

    .apm-fat-btn {

        position: absolute;
        bottom: 20px;
        right: 80px;
        z-index: 1;
    }

    .ask-project-manage-tab {
        width: 15vw;
        min-width: 180px;
        height: 100%;
    }

    .apm-list {
        width: 100%;
    }
}
</style>
