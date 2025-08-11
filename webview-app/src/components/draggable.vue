<template>
    <div class="draggable-container">
        <VueDraggable
            class="draggable-list"
            tag="div"
            :list="list"
            :group="{
                group: group,
                put: false
            }"
            v-bind="dragOptions"
            @start="onDragStart"
            @end="isDrag = false"
            :item-key="itemKey">
            <template #item="{ element: item }">
                <div class="draggable-item">
                    <SettingItem :item="item" @item-click="handleClick"></SettingItem>
                    <template v-if="item.children && item.children.length > 0">
                        <div class="draggable-wrap">
                            <ProjectSettingDraggable :list="item.children" :group="'p'+item[itemKey]" :item-key="itemKey" @item-click="(subItem, type)=> {
                                handleClick(subItem, type, item[itemKey])
                            }"/>
                        </div>
                    </template>
                </div>
            </template>
        </VueDraggable>
    </div>
</template>
<script setup lang="ts">
    import { ref } from "vue";
    import VueDraggable from "vuedraggable";
    import SettingItem from "./settingItem.vue";
    defineOptions({
        name: "ProjectSettingDraggable",
    });
    withDefaults(
        defineProps<{
            list: any[];
            group?: string;
            itemKey?: string;
        }>(),
        {
            list: () => {
                return [];
            },
            group: "p1",
            itemKey: "key",
        }
    );
    const isDrag = ref(false);
    const dragOptions = ref({
        animation: 200,
        handle: ".handle",
        disabled: false,
        ghostClass: "ghost",
    });

    const emits = defineEmits<{
        'item-click': [item: any, type: string, pId?: string]
    }>()
    const handleClick = (item: any, type: string, pId?: string) => {
        emits("item-click", item, type, pId)
    }
    const handleClone = (event: any) => {
        const cloneNode = event.item.cloneNode(true);
        console.dir(cloneNode.childNodes[0])
        return cloneNode.childNodes[0];
    }
    const onDragStart = (event: any) => {
        isDrag.value = true;
        console.log('event', event)
        const cloneNode = event.item.cloneNode(true);
        console.dir(cloneNode.childNodes[0])
        event.dataTransfer.setData('text/html', cloneNode.childNodes[0]);
    }
</script>
<style lang="scss" scoped>
    :deep(.draggable-container) {
        .flip-list-move {
            transition: transform 0.5s;
        }

        .no-move {
            transition: transform 0s;
        }

        .ghost {
            opacity: 0.5;
            background: #c8ebfb;
        }
    }
</style>
