<template>
    <v-bottom-sheet fullscreen v-model="isSettingState">
        <div class="setting-box">
            <div class="setting-header">
                <div class="setting-header__title">编辑模式</div>
                <div class="setting-header__btns">
                    <v-btn color="indigo-darken-1" text="保存" @click="saveSetting"></v-btn>
                    <v-btn color="pink-lighten-1" text="关闭" @click="closeSetting"></v-btn>
                </div>
            </div>
            <div class="setting-content">
                <EmptyText v-if="renderList.length === 0">
                    <template #text>
                        <div>当前还没有分组数据，退出管理模式然后点击下方按钮或者右下角功能按钮添加一个吧</div>
                    </template>
                </EmptyText>

                <div class="setting-list">
                    <template v-for="item in renderList">
                        <SettingItem :item="item" @item-click="handleItemClick"></SettingItem>
                        <div class="setting-wrap">
                            <div class="setting-list">
                                <template v-for="subItem in item.children">
                                    <SettingItem :item="subItem"
                                        @item-click="(_item, type) => handleItemClick(_item, type, item.key)">
                                    </SettingItem>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <InfoDialog ref="infoDialogRef" @sure="sureEdit"></InfoDialog>
    </v-bottom-sheet>
</template>
<script setup lang="ts">
import { watch, ref, toRaw } from "vue";
import SettingItem from "./settingItem.vue";
import InfoDialog from "./infoDialog.vue";
import EmptyText from "./empty.vue";
import { ProjectConfigItemModel, FormDataModel } from "./types";
defineOptions({
    name: "ProjectManageSetting",
});

const isSettingState = defineModel({ type: Boolean });
const props = withDefaults(
    defineProps<{
        list: ProjectConfigItemModel[];
    }>(),
    {
        list: () => {
            return [];
        },
    }
);
const emits = defineEmits<{
    "save-setting": [list: ProjectConfigItemModel[]];
}>();
const handleItemClick = (item: { [key: string]: any }, type: string, parentId?: string) => {
    let _item = item as ProjectConfigItemModel | ProjectConfigItemModel["children"][number];
    if (type === "edit") {
        openEdit(_item, parentId);
    } else if (type === 'sort') {
        openSort(_item, parentId);
    } else {
        removeItem(_item, parentId);
    }
};
const infoDialogRef = ref<InstanceType<typeof InfoDialog> | null>(null);
const sureEdit = (formData: FormDataModel) => {
    if (formData.groupKey) {
        if (formData.subInfo && formData.subInfo === 'sort'){
            sureSort(formData);
            return;
        }
        const currentIndex = renderList.value.findIndex(cur => cur.key === formData.groupKey);
        if (currentIndex === -1) {
            return;
        }
        const current = renderList.value[currentIndex];
        if (formData.listKey) {
            const subIndex = current.children.findIndex(cur => cur.key === formData.listKey);

            if (subIndex === -1) {
                return;
            }
            current.children[subIndex].name = formData.name || "";
        } else {
            current.label = formData.name || "";
        }
    }
    infoDialogRef.value?.resetEditForm();
};
const sureSort = (formData: FormDataModel) => {
    if (formData.groupKey) {
        if (formData.subInfo && formData.subInfo !== 'sort'){
            return;
        }
        const currentIndex = renderList.value.findIndex(cur => cur.key === formData.groupKey);
        let newIndex = Number(formData.name);
        if (currentIndex === -1 || isNaN(newIndex)) {
            return;
        }
        newIndex = Math.max(0, newIndex);
        const current = renderList.value[currentIndex];
        if (formData.listKey) {
            const subIndex = current.children.findIndex(cur => cur.key === formData.listKey);

            if (subIndex === -1) {
                return;
            }
            newIndex = Math.min(newIndex, current.children.length - 1);
            const [movedItem] = current.children.splice(subIndex, 1);
            current.children.splice(newIndex, 0, movedItem);
        } else {
            newIndex = Math.min(newIndex, renderList.value.length - 1);
            const [movedItem] = renderList.value.splice(currentIndex, 1);
            renderList.value.splice(newIndex, 0, movedItem);
        }
    }
    infoDialogRef.value?.resetEditForm();
};
const openEdit = (item: ProjectConfigItemModel | ProjectConfigItemModel["children"][number], parentId?: string) => {
    const formData = {
        title: "",
        nameLabel: "",
        name: "",
        groupKey: "",
        listKey: "",
    };
    if (parentId) {
        let _item = item as ProjectConfigItemModel["children"][number];
        formData.title = "编辑项目";
        formData.nameLabel = "项目名称";
        formData.name = _item.name;
        formData.groupKey = parentId;
        formData.listKey = _item.key;
    } else {
        let _item = item as ProjectConfigItemModel;
        formData.title = "编辑分组";
        formData.nameLabel = "分组名称";
        formData.name = _item.label;
        formData.groupKey = _item.key;
        formData.listKey = "";
    }
    infoDialogRef.value?.openEdit(formData);
};
const openSort = (item: ProjectConfigItemModel | ProjectConfigItemModel["children"][number], parentId?: string) => {
    const formData = {
        title: "",
        nameLabel: "",
        name: "",
        groupKey: "",
        listKey: "",
        subInfo: "",
    };
    if (parentId) {
        let _item = item as ProjectConfigItemModel["children"][number];
        const parentItem = renderList.value.find(cur => cur.key === parentId)!;
        const index = parentItem.children.findIndex(cur => cur.key === _item.key);
        formData.title = "修改项目排序";
        formData.nameLabel = "排序";
        formData.name = index + '';
        formData.groupKey = parentId;
        formData.listKey = _item.key;
        formData.subInfo = "sort";
    } else {
        let _item = item as ProjectConfigItemModel;
        const index = renderList.value.findIndex(cur => cur.key === _item.key);
        formData.title = "修改分组排序";
        formData.nameLabel = "排序";
        formData.name = index + '';
        formData.groupKey = _item.key;
        formData.listKey = "";
        formData.subInfo = "sort";
    }
    infoDialogRef.value?.openEdit(formData);
};

const removeItem = (
    item: ProjectConfigItemModel | ProjectConfigItemModel["children"][number],
    parentId?: string
) => {
    if (parentId) {
        const currentIndex = renderList.value.findIndex(cur => cur.key === parentId);
        if (currentIndex === -1) {
            return;
        }
        const current = renderList.value[currentIndex];
        const subIndex = current.children.findIndex(cur => cur.key === item.key);

        if (subIndex === -1) {
            return;
        }
        current.children.splice(subIndex, 1);
    } else {
        const currentIndex = renderList.value.findIndex(cur => cur.key === item.key);
        if (currentIndex === -1) {
            return;
        }
        renderList.value.splice(currentIndex, 1);
    }
};
const renderList = ref<ProjectConfigItemModel[]>([]);
watch(
    [() => props.list, isSettingState],
    () => {
        if (isSettingState.value) {
            renderList.value = JSON.parse(JSON.stringify(props.list));
        }
    },
    {
        immediate: true,
    }
);
const saveSetting = () => {
    emits("save-setting", toRaw(renderList.value));
    closeSetting();
};
const closeSetting = () => {
    isSettingState.value = false;
};
</script>
<style lang="scss" scoped>
.setting-box {
    width: 100%;
    height: 100%;
    background: rgb(33, 33, 33);
    padding: 24px;
    min-width: 472px;

    .flip-list-move {
        transition: transform 0.5s;
    }

    .setting-header {
        display: flex;
        align-items: center;

        .setting-header__title {
            flex: 1;
            text-align: center;
        }

        .setting-header__btns {
            margin-left: auto;

            .v-btn+.v-btn {
                margin-left: 12px;
            }
        }
    }

    .setting-content {
        height: calc(100% - 36px);
        overflow: auto;
        padding-top: 24px;

        :deep() .setting-list {
            .setting-wrap {
                padding-left: 24px;

                .setting-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                }

                .setting-item {
                    border: none;

                    &:not(:hover) {
                        background: transparent;
                    }

                    // padding-bottom: 0;
                }
            }

            .setting-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 14px;
                cursor: pointer;
                transition-property: background;
                transition-timing-function: cubic-bezier(0, 0.55, 0.45, 1);
                transition-duration: 300ms;
                background: #424242;

                &:hover {
                    background: #616161;
                }

                .setting-item__btns {
                    .v-btn {
                        --v-btn-height: 18px;
                        font-size: 10px;
                    }

                    .v-btn+.v-btn {
                        margin-left: 12px;
                    }
                }
            }
        }
    }
}
</style>
