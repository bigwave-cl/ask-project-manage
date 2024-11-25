<template>
    <v-speed-dial location="bottom center" transition="slide-y-reverse-transition">
        <template v-for="item in list" :key="item.key">
            <v-btn v-tooltip:top="item.tip" :icon="item.icon" @click="handleClick(item.key)"></v-btn>
        </template>
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" icon="mdi-view-dashboard"></v-btn>
        </template>
        <!-- <v-btn icon="mdi-file-document-plus-outline" @click="handleClick('chooseFolder')"></v-btn>
        <v-btn icon="mdi-book-plus-multiple-outline" @click="handleClick('chooseWorkspace')"></v-btn>
        <v-btn icon="mdi-trash-can-outline" @click="handleClick('removeProjectByGroup')"></v-btn>
        <v-btn icon="mdi-view-grid-plus-outline" @click="handleClick('addGroup')"></v-btn>
        <v-btn icon="mdi-trash-can-outline" @click="handleClick('removeGroup')"></v-btn> -->
    </v-speed-dial>
</template>
<script setup lang="ts">
defineOptions({
    name: "ProjectManageToolBar"
})

withDefaults(defineProps<{
    list: { key: string, tip: string, icon: string }[]
}>(), {
    list: () => {
        return []
    }
})
const emits = defineEmits<{
    'item-click': [type: string]
}>()
const handleClick = (type: string) => {
    emits("item-click", type)
}
</script>