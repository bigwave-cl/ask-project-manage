<template>
    <div class="ask-project-manage-tab" v-if="list.length > 0">
        <v-tabs v-model="active" color="cyan-lighten-2" density="compact">
            <template v-for="item in list" :key="item.key">
                <v-tab :value="item.key">
                    <span>{{ item.label }}</span>
                </v-tab>
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
<style lang="scss" scoped>
.ask-project-manage-tab {
    min-height: 38px;
    overflow: hidden;

    :deep(.v-tabs) {
        border: 1px solid rgba(138, 255, 237, .14);
        border-radius: 14px;
        background: rgba(7, 13, 15, .46);
    }

    :deep(.v-tab) {
        min-width: auto;
        padding: 0 14px;
        color: rgba(237, 255, 252, .68);
        letter-spacing: 0;
        text-transform: none;
    }

    :deep(.v-tab--selected) {
        color: #efffff;
        background: linear-gradient(90deg, rgba(0, 229, 255, .12), rgba(219, 80, 255, .1));
    }
}
</style>
