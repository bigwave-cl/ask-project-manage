<template>
    <div class="ask-project-manage-empty">
        <div class="ask-project-manage-empty__box">
            <div class="ask-project-manage-empty__sigil" aria-hidden="true">
                <v-icon icon="mdi-file-star-outline"></v-icon>
            </div>
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
.ask-project-manage-empty {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 220px;

    .ask-project-manage-empty__box {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: inherit;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column nowrap;
        color: color-mix(in srgb, var(--apm-faded-letter) 72%, transparent);
        isolation: isolate;

        &::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 46%;
            z-index: -1;
            width: min(520px, 70%);
            height: 180px;
            background:
                radial-gradient(ellipse at 50% 42%, color-mix(in srgb, var(--apm-radio-silence) 16%, transparent), transparent 58%),
                radial-gradient(ellipse at 50% 64%, color-mix(in srgb, var(--apm-riviera) 10%, transparent), transparent 62%);
            filter: blur(12px);
            transform: translate(-50%, -50%);
            opacity: .72;
        }

        :deep(.v-btn) {
            border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 34%, transparent);
            background:
                radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--apm-radio-silence) 18%, transparent), transparent 56%),
                rgba(4, 12, 14, .72);
            box-shadow:
                0 0 22px color-mix(in srgb, var(--apm-radio-silence) 18%, transparent),
                inset 0 1px 0 rgba(255, 255, 255, .08);
            color: var(--apm-radio-silence);
        }

        .ask-project-manage-empty__box--text {
            max-width: min(520px, 82%);
            padding: 18px 0 24px;
            font-size: 14px;
            line-height: 1.7;
            word-break: break-all;
            text-align: center;
            text-shadow: 0 0 16px color-mix(in srgb, var(--apm-radio-silence) 16%, transparent);
        }
    }
}

.ask-project-manage-empty__sigil {
    position: relative;
    width: auto;
    min-height: 58px;
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--apm-swan-dive) 70%, transparent);
    opacity: .82;

    .v-icon {
        position: relative;
        z-index: 1;
        font-size: 62px;
        filter:
            drop-shadow(0 0 12px color-mix(in srgb, var(--apm-radio-silence) 28%, transparent))
            drop-shadow(0 0 22px color-mix(in srgb, var(--apm-riviera) 14%, transparent));
    }
}
</style>
