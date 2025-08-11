<template>
    <div class="draggable-container">
        <ul ref="listRef" class="draggable-list">
            <template v-for="(item, index) in list" :key="item.value">
                <li
                    draggable="true"
                    class="draggable-item"
                    @dragstart="onDragStart(index)"
                    @dragover="onDragOver($event, index)"
                    @drop="onDrop($event, index)"
                    @dragend="onDragEnd">
                    {{ item.name }}
                </li>
            </template>
        </ul>
    </div>
</template>
<script setup lang="ts">
    import { ref } from "vue";
    // import Sortable from 'sortablejs';
    defineOptions({
        name: "ProjectSettingDraggableJS",
    });
    const list = ref(
        // @ts-ignore
        Array(10).fill(undefined).map((cur, i) => {
            return {
                value: i,
                name: "数据-" + i,
            };
    }));
    const draggedIndex = ref<number | null>(null); // 当前被拖拽元素的索引

    // 开始拖拽时记录拖拽的索引
    const onDragStart = (index: number) => {
        console.log('onDragStart-index', index)
        draggedIndex.value = index;
    };

    // 拖拽到目标位置时，阻止默认行为
    const onDragOver = (event: DragEvent, index: number) => {
        console.log('onDragOver-index', event)
        event.preventDefault();
        event.stopPropagation();
        // 动态调整样式或逻辑
    };

    // 在目标位置放置
    const onDrop = (event: DragEvent, index: number) => {
        console.log('onDrop-index', index)
        event.preventDefault();
        event.stopPropagation();
        if (draggedIndex.value !== null && draggedIndex.value !== index) {
            const movedItem = list.value[draggedIndex.value];
            list.value.splice(draggedIndex.value, 1); // 删除拖拽项
            list.value.splice(index, 0, movedItem); // 插入到目标位置
        }
        draggedIndex.value = null;
    };

    // 拖拽结束时清除状态
    const onDragEnd = () => {
        console.log('onDragEnd-index')
        draggedIndex.value = null;
    };
</script>
<style>
    .draggable-list {
        list-style: none;
        padding: 0;
        width: 300px;
        pointer-events: all;
    }

    .draggable-item {
        padding: 10px;
        margin: 5px 0;
        background-color: #f4f4f4;
        border: 1px solid #ccc;
        cursor: grab;
        user-select: none;
        color: #333;
        pointer-events: all;
    }

    .draggable-item.dragging {
        opacity: 0.5;
        background-color: #ddd;
    }
</style>
