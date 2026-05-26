<template>
    <v-dialog v-model="editForm.model" max-width="620" class="apm-info-dialog">
        <v-card class="apm-info-dialog__card">
            <div class="apm-info-dialog__veil" aria-hidden="true">
                <span></span>
                <span></span>
            </div>

            <header class="apm-info-dialog__header">
                <div class="apm-info-dialog__sigil">
                    <v-icon icon="mdi-star-four-points-outline"></v-icon>
                </div>
                <div class="apm-info-dialog__heading">
                    <span>Ling Shu Node</span>
                    <h2>{{ editForm.title }}</h2>
                </div>
            </header>

            <v-card-text class="apm-info-dialog__content">
                <v-text-field
                    class="apm-info-dialog__field"
                    :label="editForm.nameLabel"
                    required
                    v-model="editForm.name"
                    variant="solo-filled"
                    density="comfortable"
                    hide-details="auto"
                    @keyup.enter="sureEdit"
                ></v-text-field>
            </v-card-text>

            <div class="apm-info-dialog__divider" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <v-card-actions class="apm-info-dialog__actions">
                <v-spacer></v-spacer>

                <v-btn class="apm-info-dialog__btn apm-info-dialog__btn--ghost" text="关闭" variant="text" @click="closeEdit"></v-btn>

                <v-btn class="apm-info-dialog__btn apm-info-dialog__btn--primary" text="确认" variant="flat" @click="sureEdit"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { type FormDataModel } from "./types"
defineOptions({
    name: "ProjectManageInfoDialog"
})
const editForm = ref({
    model: false,
    title: '',
    nameLabel: '',
    name: '',
    groupKey: '',
    listKey: '',
    subInfo: '',
})
const emits = defineEmits<{
    'sure': [form: typeof editForm.value],
    'close': [form: typeof editForm.value]
}>()

const resetEditForm = () => {
    editForm.value.model = false;
    editForm.value.title = '';
    editForm.value.nameLabel = '';
    editForm.value.name = '';
    editForm.value.groupKey = '';
    editForm.value.listKey = '';
    editForm.value.subInfo = '';
}

const openEdit = (formData: FormDataModel) => {
    resetEditForm();
    editForm.value.title = formData.title || '';
    editForm.value.nameLabel = formData.nameLabel || '';
    editForm.value.name = formData.name || '';
    editForm.value.groupKey = formData.groupKey || '';
    editForm.value.listKey = formData.listKey || '';
    editForm.value.subInfo = formData.subInfo || '';
    editForm.value.model = true;
}
const closeEdit = ()=> {
    emits("close", editForm.value)
    resetEditForm();
}
const sureEdit = ()=> {
    emits("sure", editForm.value)
}
defineExpose({
    openEdit,
    resetEditForm
})
</script>

<style lang="scss">
.apm-info-dialog {
    .v-overlay__scrim {
        background:
            radial-gradient(ellipse at 48% 42%, rgba(97, 191, 173, .18), transparent 36%),
            radial-gradient(ellipse at 66% 48%, rgba(255, 139, 139, .12), transparent 32%),
            rgba(1, 4, 10, .82);
        opacity: 1;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    }

    .v-overlay__content {
        overflow: visible;
    }
}

.apm-info-dialog__card {
    position: relative;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 34%, transparent);
    border-radius: 16px !important;
    background:
        linear-gradient(180deg, rgba(12, 27, 30, .92), rgba(5, 9, 16, .96)),
        repeating-linear-gradient(90deg, rgba(97, 191, 173, .06) 0 1px, transparent 1px 22px),
        repeating-linear-gradient(180deg, rgba(249, 247, 232, .04) 0 1px, transparent 1px 18px);
    color: var(--apm-text-main);
    box-shadow:
        0 28px 78px rgba(0, 0, 0, .54),
        0 0 34px color-mix(in srgb, var(--apm-radio-silence) 18%, transparent),
        0 0 54px color-mix(in srgb, var(--apm-riviera) 10%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .1),
        inset 0 0 42px rgba(97, 191, 173, .08);

    &::before,
    &::after {
        content: "";
        position: absolute;
        pointer-events: none;
    }

    &::before {
        inset: 0;
        background:
            radial-gradient(ellipse at 16% 0%, color-mix(in srgb, var(--apm-radio-silence) 32%, transparent), transparent 36%),
            radial-gradient(ellipse at 84% 100%, color-mix(in srgb, var(--apm-riviera) 20%, transparent), transparent 42%),
            linear-gradient(110deg, transparent 0 38%, rgba(249, 247, 232, .07) 46%, transparent 56% 100%);
        opacity: .74;
        mix-blend-mode: screen;
    }

    &::after {
        left: 18px;
        right: 18px;
        top: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--apm-radio-silence), var(--apm-riviera), transparent);
        opacity: .72;
        box-shadow: 0 0 16px color-mix(in srgb, var(--apm-radio-silence) 44%, transparent);
    }
}

.apm-info-dialog__veil {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;

    span {
        position: absolute;
        border-radius: 999px;
        opacity: .68;
        filter: blur(.2px);
    }

    span:first-child {
        left: -72px;
        top: 48px;
        width: 220px;
        height: 42px;
        border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 30%, transparent);
        transform: rotate(-12deg);
    }

    span:last-child {
        right: -58px;
        bottom: 34px;
        width: 190px;
        height: 34px;
        border: 1px solid color-mix(in srgb, var(--apm-riviera) 28%, transparent);
        transform: rotate(10deg);
    }
}

.apm-info-dialog__header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 24px 24px 14px;
}

.apm-info-dialog__sigil {
    position: relative;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 52%, transparent);
    border-radius: 16px 8px;
    background:
        radial-gradient(circle at 50% 50%, rgba(249, 247, 232, .2), transparent 22%),
        radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--apm-radio-silence) 38%, transparent), transparent 64%),
        rgba(7, 20, 22, .88);
    color: var(--apm-swan-dive);
    box-shadow:
        0 0 18px color-mix(in srgb, var(--apm-radio-silence) 24%, transparent),
        inset 0 0 20px rgba(97, 191, 173, .18);

    &::after {
        content: "";
        position: absolute;
        inset: 8px;
        border: 1px solid color-mix(in srgb, var(--apm-riviera) 22%, transparent);
        border-radius: 999px;
        opacity: .66;
    }
}

.apm-info-dialog__heading {
    min-width: 0;

    span {
        display: block;
        color: var(--apm-text-muted);
        font-size: 11px;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: .08em;
    }

    h2 {
        margin: 7px 0 0;
        color: var(--apm-text-main);
        font-size: 22px;
        line-height: 1.18;
        font-weight: 800;
        letter-spacing: 0;
        text-shadow: 0 0 12px color-mix(in srgb, var(--apm-radio-silence) 22%, transparent);
    }
}

.apm-info-dialog__content {
    position: relative;
    z-index: 1;
    padding: 14px 24px 28px;
}

.apm-info-dialog__field {
    .v-field {
        border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 26%, transparent);
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(12, 27, 30, .78), rgba(6, 10, 16, .86)),
            repeating-linear-gradient(90deg, rgba(97, 191, 173, .055) 0 1px, transparent 1px 18px);
        color: var(--apm-text-main);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, .08),
            inset 0 0 22px rgba(97, 191, 173, .08);
    }

    .v-field--focused {
        border-color: color-mix(in srgb, var(--apm-radio-silence) 68%, transparent);
        box-shadow:
            0 0 0 1px color-mix(in srgb, var(--apm-radio-silence) 22%, transparent),
            0 0 24px color-mix(in srgb, var(--apm-radio-silence) 18%, transparent),
            inset 0 0 22px rgba(97, 191, 173, .1);
    }

    .v-field__overlay {
        opacity: 0;
    }

    .v-label,
    input {
        color: var(--apm-text-main);
    }

    .v-label {
        color: var(--apm-text-muted);
    }
}

.apm-info-dialog__divider {
    position: relative;
    z-index: 1;
    height: 1px;
    margin: 0 22px;
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--apm-radio-silence) 36%, transparent), color-mix(in srgb, var(--apm-riviera) 28%, transparent), transparent);

    span {
        position: absolute;
        top: -2px;
        width: 4px;
        height: 4px;
        border-radius: 999px;
        background: var(--apm-swan-dive);
        box-shadow: 0 0 12px var(--apm-radio-silence);
    }

    span:nth-child(1) {
        left: 22%;
    }

    span:nth-child(2) {
        left: 48%;
        background: var(--apm-radio-silence);
    }

    span:nth-child(3) {
        right: 18%;
        background: var(--apm-riviera);
    }
}

.apm-info-dialog__actions {
    position: relative;
    z-index: 1;
    gap: 10px;
    padding: 16px 24px 22px;
}

.apm-info-dialog__btn {
    min-width: 82px;
    border-radius: 8px;
    font-weight: 700;
    letter-spacing: 0;

    .v-btn__overlay {
        opacity: 0;
    }
}

.apm-info-dialog__btn--ghost {
    border: 1px solid color-mix(in srgb, var(--apm-swan-dive) 18%, transparent);
    color: color-mix(in srgb, var(--apm-swan-dive) 76%, transparent);
    background: rgba(249, 247, 232, .04);

    &:hover {
        color: var(--apm-swan-dive);
        border-color: color-mix(in srgb, var(--apm-swan-dive) 30%, transparent);
    }
}

.apm-info-dialog__btn--primary {
    color: #041011;
    background:
        linear-gradient(135deg, var(--apm-radio-silence), color-mix(in srgb, var(--apm-riviera) 78%, var(--apm-radio-silence)));
    box-shadow:
        0 0 18px color-mix(in srgb, var(--apm-radio-silence) 24%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .36);

    &:hover {
        box-shadow:
            0 0 26px color-mix(in srgb, var(--apm-radio-silence) 34%, transparent),
            0 0 18px color-mix(in srgb, var(--apm-riviera) 18%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, .42);
    }
}
</style>
