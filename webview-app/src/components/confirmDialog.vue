<template>
    <v-dialog
        v-model="confirmState.model"
        max-width="560"
        class="apm-info-dialog apm-confirm-dialog"
        @update:model-value="onDialogModelUpdate"
    >
        <v-card class="apm-info-dialog__card apm-confirm-dialog__card">
            <div class="apm-info-dialog__veil" aria-hidden="true">
                <span></span>
                <span></span>
            </div>

            <header class="apm-info-dialog__header">
                <div class="apm-info-dialog__sigil apm-confirm-dialog__sigil">
                    <v-icon :icon="confirmState.icon"></v-icon>
                </div>
                <div class="apm-info-dialog__heading">
                    <span>Ling Shu Guard</span>
                    <h2>{{ confirmState.title }}</h2>
                </div>
            </header>

            <v-card-text class="apm-confirm-dialog__content">
                {{ confirmState.content }}
            </v-card-text>

            <div class="apm-info-dialog__divider" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <v-card-actions class="apm-info-dialog__actions">
                <v-spacer></v-spacer>
                <v-btn
                    class="apm-info-dialog__btn apm-info-dialog__btn--ghost"
                    :text="confirmState.cancelText"
                    variant="text"
                    @click="closeConfirm(false)"
                ></v-btn>
                <v-btn
                    class="apm-info-dialog__btn apm-confirm-dialog__btn--danger"
                    :text="confirmState.confirmText"
                    variant="flat"
                    @click="closeConfirm(true)"
                ></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({
    name: "ProjectManageConfirmDialog",
});

type ConfirmOptions = {
    title: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
    icon?: string;
};

const confirmState = ref({
    model: false,
    title: "",
    content: "",
    confirmText: "确认删除",
    cancelText: "取消",
    icon: "mdi-alert-rhombus-outline",
});

let confirmResolver: ((value: boolean) => void) | null = null;

const resetConfirm = () => {
    confirmState.value.model = false;
    confirmState.value.title = "";
    confirmState.value.content = "";
    confirmState.value.confirmText = "确认删除";
    confirmState.value.cancelText = "取消";
    confirmState.value.icon = "mdi-alert-rhombus-outline";
};

const closeConfirm = (value: boolean) => {
    confirmResolver?.(value);
    confirmResolver = null;
    resetConfirm();
};

const onDialogModelUpdate = (value: boolean) => {
    if (!value && confirmResolver) {
        closeConfirm(false);
    }
};

const openConfirm = (options: ConfirmOptions) => {
    confirmResolver?.(false);
    confirmState.value.title = options.title;
    confirmState.value.content = options.content;
    confirmState.value.confirmText = options.confirmText || "确认删除";
    confirmState.value.cancelText = options.cancelText || "取消";
    confirmState.value.icon = options.icon || "mdi-alert-rhombus-outline";
    confirmState.value.model = true;

    return new Promise<boolean>(resolve => {
        confirmResolver = resolve;
    });
};

defineExpose({
    openConfirm,
});
</script>

<style lang="scss">
.apm-confirm-dialog__content {
    position: relative;
    z-index: 1;
    padding: 10px 24px 28px;
    color: color-mix(in srgb, var(--apm-swan-dive) 82%, transparent);
    font-size: 15px;
    font-weight: 650;
    line-height: 1.7;
    letter-spacing: 0;
    white-space: pre-line;
}

.apm-confirm-dialog__sigil {
    color: var(--apm-riviera);
    border-color: color-mix(in srgb, var(--apm-riviera) 52%, transparent);
    background:
        radial-gradient(circle at 50% 50%, rgba(249, 247, 232, .18), transparent 22%),
        radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--apm-riviera) 36%, transparent), transparent 64%),
        rgba(22, 9, 14, .88);
    box-shadow:
        0 0 18px color-mix(in srgb, var(--apm-riviera) 24%, transparent),
        inset 0 0 20px rgba(255, 139, 139, .14);
}

.apm-confirm-dialog__btn--danger {
    min-width: 96px;
    border-radius: 8px;
    color: #14080a;
    font-weight: 800;
    letter-spacing: 0;
    background:
        linear-gradient(135deg, var(--apm-riviera), color-mix(in srgb, var(--apm-radio-silence) 58%, var(--apm-riviera)));
    box-shadow:
        0 0 18px color-mix(in srgb, var(--apm-riviera) 24%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .34);

    .v-btn__overlay {
        opacity: 0;
    }

    &:hover {
        box-shadow:
            0 0 26px color-mix(in srgb, var(--apm-riviera) 34%, transparent),
            0 0 18px color-mix(in srgb, var(--apm-radio-silence) 16%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, .42);
    }
}
</style>
