<template>
    <div class="ask-project-manage-list">
        <template v-for="item in list">
            <ProjectCard :item="item" @item-click="handleItemClick"></ProjectCard>
        </template>
    </div>
</template>
<script setup lang="ts">
import ProjectCard from "./card.vue";
import { ProjectItemModel } from "./types"
defineOptions({
    name: "ProjectManageList"
})
withDefaults(defineProps<{
    list: ProjectItemModel[]
}>(), {
    list: ()=> {
        return [] as ProjectItemModel[]
    }
})

const emits = defineEmits<{
    'item-click': [item: ProjectItemModel]
}>()
const handleItemClick = (item: ProjectItemModel) => {
    emits("item-click", item)
}
</script>
<style lang="scss" scoped>
.ask-project-manage-list{
    padding: 24px;
    width: 100%;
    display: grid;
    grid-template-columns:  repeat(auto-fill, minmax(100px, 120px));
    gap: 24px;
    .ask-project-manage-card{
        aspect-ratio: 1/1;
        box-shadow: 0px 0px 12px #666;
        border-radius: 12px;
        font: 400 14px / normal 'PingFang SC';
        word-break: break-all;
        cursor: pointer;
        will-change: transform;
        transition-property: transform, box-shadow, border-radius;
        transition-timing-function: cubic-bezier(0, .55, .45, 1);
        transition-duration: 300ms;
        &:hover{
            transform: scale(1.2) rotateX(10deg);
            box-shadow: 0px 0px 20px #999;
            border-radius: 4px;
        }
        :deep() .ask-project-manage-card__box{
            width: 100%;
            height: 100%;
            border-radius: inherit;
            padding: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            font: inherit;
            color: currentColor;
            position: relative;
            overflow: hidden;
            .ask-project-manage-card__tip--body{
                position: absolute;
                bottom: 4px;
                right: 4px;
                z-index: 0;
                font-size: 12px;
                color: #8C9EFF;
                opacity: .6;
                cursor: pointer;
                width: 20px;
                height: 20px;
                border-radius: 100%;
            }
            .ask-project-manage-card__type{
                position: absolute;
                bottom: 4px;
                left: 4px;
                z-index: 0;
                font-size: 12px;
                color: #D81B60;
                opacity: .6;
            }
        }
    }
}
</style>
