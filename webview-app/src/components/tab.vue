<template>
    <div class="ask-project-manage-tab" v-if="list.length > 1">
        <v-tabs v-model="active" color="primary" direction="vertical">
            <template v-for="item in list">
                <v-tab :text="item.label" :value="item.key"></v-tab>
            </template>
        </v-tabs>
    </div>
</template>
<script setup lang="ts">
import { ProjectGroupItemModel } from "./types"
defineOptions({
    name: "ProjectManageTab"
})
const active = defineModel({ type: String })
withDefaults(defineProps<{
    list: ProjectGroupItemModel[]
}>(), {
    list: ()=> {
        return [] as ProjectGroupItemModel[]
    }
})
</script>