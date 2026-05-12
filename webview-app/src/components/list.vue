<template>
    <div class="ask-project-manage-list">
        <template v-for="item in list" :key="item.key">
            <ProjectCard
                :item="item"
                @item-click="handleItemClick"
                @item-copy="handleItemCopy"
                @item-edit="handleItemEdit"
                @item-remove="handleItemRemove"
            ></ProjectCard>
        </template>
    </div>
</template>
<script setup lang="ts">
import ProjectCard from "./card.vue";
import { ProjectRenderItemModel } from "./types"
defineOptions({
    name: "ProjectManageList"
})
withDefaults(defineProps<{
    list: ProjectRenderItemModel[]
}>(), {
    list: ()=> {
        return [] as ProjectRenderItemModel[]
    }
})

const emits = defineEmits<{
    'item-click': [item: ProjectRenderItemModel]
    'item-copy': [item: ProjectRenderItemModel]
    'item-edit': [item: ProjectRenderItemModel]
    'item-remove': [item: ProjectRenderItemModel]
}>()
const handleItemClick = (item: ProjectRenderItemModel) => {
    emits("item-click", item)
}
const handleItemCopy = (item: ProjectRenderItemModel) => {
    emits("item-copy", item)
}
const handleItemEdit = (item: ProjectRenderItemModel) => {
    emits("item-edit", item)
}
const handleItemRemove = (item: ProjectRenderItemModel) => {
    emits("item-remove", item)
}
</script>
<style lang="scss" scoped>
.ask-project-manage-list{
    padding: 4px 0 24px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 18px;
    .ask-project-manage-card{
        aspect-ratio: 1 / 1;
        min-width: 120px;
        max-width: 160px;
        width: 100%;
        cursor: pointer;
        will-change: transform, border-color, box-shadow;
        transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        :deep() .ask-project-manage-card__box{
            width: 100%;
            height: 100%;
        }
    }
}
</style>
