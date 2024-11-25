<template>
    <div class="ask-project-manage-empty">
        <div class="ask-project-manage-empty__box">
            <v-icon icon="mdi-file-sign"></v-icon>
            <div class="ask-project-manage-empty__box--text">
                <slot name="text">{{ text }}</slot>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: "ProjectManageEmpty"
})
withDefaults(defineProps<{
    text?: string
}>(), {
    text: '还没有数据、添加一个吧'
})
</script>
<style lang="scss" scoped>
.ask-project-manage-empty{
    display: block;
    width: 100%;
    height: 100%;
    .ask-project-manage-empty__box{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column nowrap;
        color: #666;
        .v-icon{
            font-size: 120px;
        }
        .ask-project-manage-empty__box--text{
            padding: 24px 0;
            font-size: 14px;
            word-break: break-all;
            text-align: center
        }
    }
}
</style>