<template>
    <div class="ask-project-manage-card" @click="handleClick(item)">
        <div class="ask-project-manage-card__box">
            <div class="ask-project-manage-card__type">
                <v-icon :icon="item.type === 'folder' ? 'mdi-alpha-f' : 'mdi-alpha-w'"></v-icon>
            </div>
            {{ item.name }}

            <v-tooltip location="top">
                <div class="ask-project-manage-card__tip">
                    <p> name: {{ item.name }} </p>
                    <p> source: {{ item.source }} </p>
                </div>
                <template v-slot:activator="{ props }">
                    <div class="ask-project-manage-card__tip--body" v-bind="props">
                        <v-icon icon="mdi-help-circle-outline"></v-icon>
                    </div>
                </template>
            </v-tooltip>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ProjectItemModel } from "./types"
defineOptions({
    name: "ProjectManageCard"
})
withDefaults(defineProps<{
    item: ProjectItemModel
}>(), {
    item: () => {
        return {} as ProjectItemModel
    }
})
const emits = defineEmits<{
    'item-click': [item: ProjectItemModel]
}>()
const handleClick = (item: ProjectItemModel) => {
    emits("item-click", item)
}
</script>