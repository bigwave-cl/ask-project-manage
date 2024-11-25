<template>
    <div class="draggable-container">
        <transition-group tag="div" ref="draggableRef" class="draggable-container-box" name="flip-list">
            <template v-for="(item, index) in list2" :key="item[itemKey]">
                <div class="draggable-wrap" :data-id="item[itemKey]" :data-index="index">
                    <slot name="item" :item="item"></slot>
                </div>
            </template>
        </transition-group>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
// import Sortable from 'sortablejs';
defineOptions({
    name: "ProjectSettingDraggable"
})
const props = withDefaults(defineProps<{
    list: any[],
    itemKey?: string
}>(), {
    list: () => {
        return []
    },
    itemKey: 'key'
})
const draggableRef = ref<any>(null);
const draggableInstance = ref<any>(null);
const list2 = ref<any[]>([])
onMounted(() => {
    if (draggableRef.value) {
        list2.value = JSON.parse(JSON.stringify(props.list))
        draggableInstance.value = initDrag();
    }
})
const initDrag = () => {
    if (!draggableRef.value) { return null }
    // console.log('draggableRef.value', draggableRef.value)
    // const sortable = new Sortable(draggableRef.value.$el, {
    //     group: {
    //         name: "g1", // 分组名
    //         pull: true, // 允许拖拽进入其他列表
    //         put: true,  // 允许从其他列表接收项
    //     },
    //     handle: ".handle",
    //     draggable: ".draggable-wrap",
    //     // ...props.options,
    //     onEnd: (evt: any) => {
    //         const newList = list2.value;
    //         console.log('evt', evt)
    //         const [movedItem] = newList.splice(evt.oldIndex, 1);
    //         newList.splice(evt.newIndex, 0, movedItem);
    //     },
    //     onMove: (evt: any) => {
    //         console.log('move-evt', evt)
    //     }
    //     // onStart: (evt) => emit("drag-start", evt),
    // })
    // console.log('sortable', sortable)
    // return shallowRef(sortable)
}
</script>