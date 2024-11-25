<template>
    <div class="setting-item">
        <div class="setting-item__label">{{ item.label || item.name }}</div>
        <div class="setting-item__btns">
            <!-- <v-btn icon="mdi-drag" class="handle" @click="handleClick(item, 'sort')"></v-btn> -->
            <v-btn icon="mdi-order-numeric-ascending" class="handle" @click="handleClick(item, 'sort')"></v-btn>
            <v-btn icon="mdi-clipboard-edit-outline" @click="handleClick(item, 'edit')"></v-btn>
            <v-btn icon="mdi-trash-can-outline" color="pink-lighten-1" @click="handleClick(item, 'remove')"></v-btn>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ProjectItemModel } from "./types"
defineOptions({
    name: "ProjectSettingItem"
})
interface ProjectSettingItemModel extends Pick<ProjectItemModel, "key">{
    name?: string;
    label?: string;
    [key:string]: any
}
withDefaults(defineProps<{
    item: ProjectSettingItemModel
}>(), {
    item: () => {
        return {} as ProjectSettingItemModel
    }
})
const emits = defineEmits<{
    'item-click': [item: ProjectSettingItemModel, type: string]
}>()
const handleClick = (item: ProjectSettingItemModel, type: string) => {
    emits("item-click", item, type)
}
</script>