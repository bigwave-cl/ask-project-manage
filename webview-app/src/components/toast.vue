<template>
    <teleport to="body">
        <v-snackbar
            v-model="toastDisplay"
            :timeout="timeout"
            class="apm-toast"
            location="top right"
        >
            <div class="apm-toast__content">
                <span class="apm-toast__sigil" aria-hidden="true">
                    <v-icon icon="mdi-radar"></v-icon>
                </span>
                <span class="apm-toast__text">{{ text }}</span>
            </div>
            <template v-slot:actions>
                <v-btn class="apm-toast__close" variant="text" @click="hide">
                    关闭
                </v-btn>
            </template>
        </v-snackbar>
    </teleport>
</template>
<script setup lang="ts">
import { ref } from "vue";
defineOptions({
    name: "ProjectManageToast"
})
const DEFAULT_TIME = 2000;
const toastDisplay = ref(false);
const timeout = ref(DEFAULT_TIME);
const text = ref('提示内容');
let callback: Function = () => { };

const show = (opt: string | { text: string, timeout?: number, callback?: Function }) => {
    let _text = "";
    let _timeout = DEFAULT_TIME;
    if (typeof opt === 'string') {
        _text = opt
    } else {
        _text = opt.text;
        _timeout = opt.timeout === undefined ? DEFAULT_TIME : opt.timeout;
        if (opt.callback) {
            callback = opt.callback
        }
    }
    text.value = _text;
    timeout.value = _timeout;
    toastDisplay.value = true;
}
const hide = () => {
    toastDisplay.value = false;
    callback && callback();
    callback = () => { };
    timeout.value = DEFAULT_TIME;
    text.value = "";
}
defineExpose({
    show,
    hide
})
</script>

<style lang="scss">
.apm-toast {
    .v-snackbar__wrapper {
        position: relative;
        min-width: min(380px, calc(100vw - 32px));
        max-width: min(460px, calc(100vw - 32px));
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 34%, transparent);
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(13, 30, 32, .92), rgba(4, 8, 14, .95)),
            repeating-linear-gradient(90deg, rgba(97, 191, 173, .055) 0 1px, transparent 1px 18px);
        color: var(--apm-text-main);
        box-shadow:
            0 18px 46px rgba(0, 0, 0, .42),
            0 0 24px color-mix(in srgb, var(--apm-radio-silence) 18%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, .1);

        &::before,
        &::after {
            content: "";
            position: absolute;
            pointer-events: none;
        }

        &::before {
            inset: 0;
            background:
                radial-gradient(ellipse at 10% 0%, color-mix(in srgb, var(--apm-radio-silence) 30%, transparent), transparent 42%),
                radial-gradient(ellipse at 92% 100%, color-mix(in srgb, var(--apm-riviera) 18%, transparent), transparent 46%),
                linear-gradient(110deg, transparent 0 36%, rgba(249, 247, 232, .08) 45%, transparent 55% 100%);
            opacity: .72;
            mix-blend-mode: screen;
        }

        &::after {
            left: 14px;
            right: 14px;
            top: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--apm-radio-silence), var(--apm-riviera), transparent);
            box-shadow: 0 0 14px color-mix(in srgb, var(--apm-radio-silence) 34%, transparent);
            opacity: .72;
        }
    }

    .v-snackbar__content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        min-height: 54px;
        padding: 10px 12px 10px 14px;
    }

    .v-snackbar__actions {
        position: relative;
        z-index: 1;
        align-self: stretch;
        padding-inline-end: 8px;
    }
}

.apm-toast__content {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.apm-toast__sigil {
    position: relative;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 48%, transparent);
    border-radius: 8px 4px;
    background:
        radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--apm-radio-silence) 34%, transparent), transparent 64%),
        rgba(4, 16, 18, .82);
    color: var(--apm-radio-silence);
    box-shadow: inset 0 0 14px rgba(97, 191, 173, .14);

    &::after {
        content: "";
        position: absolute;
        inset: 7px;
        border: 1px solid color-mix(in srgb, var(--apm-riviera) 26%, transparent);
        border-radius: 999px;
    }
}

.apm-toast__text {
    min-width: 0;
    color: var(--apm-text-main);
    font-size: 14px;
    font-weight: 650;
    line-height: 1.35;
    letter-spacing: 0;
    text-wrap: pretty;
}

.apm-toast__close {
    min-width: 54px;
    border-radius: 8px;
    color: color-mix(in srgb, var(--apm-swan-dive) 76%, transparent);
    font-weight: 700;
    letter-spacing: 0;

    .v-btn__overlay {
        opacity: 0;
    }

    &:hover {
        color: var(--apm-swan-dive);
        background: color-mix(in srgb, var(--apm-radio-silence) 12%, transparent);
    }
}
</style>
