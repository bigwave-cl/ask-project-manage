<template>
    <v-dialog v-model="isOpen" max-width="620" scrollable>
        <section class="apm-preferences" aria-label="偏好设置">
            <header class="apm-preferences__header">
                <div>
                    <span>Console Preferences</span>
                    <h2>设置</h2>
                </div>
                <v-btn
                    icon="mdi-close"
                    variant="text"
                    aria-label="关闭设置"
                    @click="isOpen = false"
                ></v-btn>
            </header>

            <div class="apm-preferences__body">
                <article class="apm-preference-card">
                    <div class="apm-preference-card__copy">
                        <v-icon icon="mdi-rocket-launch-outline"></v-icon>
                        <div>
                            <h3>默认激活 Panel</h3>
                            <p>打开 Cursor / VS Code 项目时自动唤起项目控制台。</p>
                        </div>
                    </div>
                    <v-switch
                        v-model="draft.autoOpenPanel"
                        color="teal-accent-3"
                        hide-details
                        inset
                        aria-label="默认激活 Panel"
                    ></v-switch>
                </article>

                <article class="apm-preference-card apm-preference-card--stack">
                    <div class="apm-preference-card__copy">
                        <v-icon icon="mdi-view-dashboard-outline"></v-icon>
                        <div>
                            <h3>底部 HUD</h3>
                            <p>控制底部统计仪表是否显示，以及保留哪些统计项。</p>
                        </div>
                        <v-switch
                            :model-value="draft.hud.visible"
                            color="cyan-accent-2"
                            hide-details
                            inset
                            aria-label="显示底部 HUD"
                            @update:model-value="updateHudVisible"
                        ></v-switch>
                    </div>

                    <div class="apm-hud-options" :class="{ 'apm-hud-options--disabled': !draft.hud.visible }">
                        <button
                            v-for="option in hudMetricOptions"
                            :key="option.key"
                            type="button"
                            class="apm-hud-option"
                            :class="{ 'apm-hud-option--active': draft.hud.metrics[option.key] }"
                            :disabled="!draft.hud.visible"
                            @click="toggleHudMetric(option.key)"
                        >
                            <v-icon :icon="draft.hud.metrics[option.key] ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"></v-icon>
                            <span>{{ option.label }}</span>
                        </button>
                    </div>
                </article>

                <article class="apm-preference-card">
                    <div class="apm-preference-card__copy">
                        <v-icon icon="mdi-compass-rose"></v-icon>
                        <div>
                            <h3>新手引导</h3>
                            <p>重新查看面板自动打开、状态栏快捷入口和设置入口说明。</p>
                        </div>
                    </div>
                    <v-btn
                        class="apm-preference-card__action"
                        color="deep-purple-lighten-2"
                        variant="tonal"
                        prepend-icon="mdi-play-circle-outline"
                        @click="openGuide"
                    >查看引导</v-btn>
                </article>
            </div>

            <footer class="apm-preferences__footer">
                <v-btn variant="text" @click="resetDraft">恢复默认</v-btn>
                <div>
                    <v-btn variant="text" @click="isOpen = false">取消</v-btn>
                    <v-btn color="teal-accent-3" variant="tonal" @click="savePreferences">保存</v-btn>
                </div>
            </footer>
        </section>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ProjectHudMetricKey, ProjectPreferencesModel } from "./types";

defineOptions({
    name: "ProjectPreferenceSetting",
});

const defaultPreferences: ProjectPreferencesModel = {
    autoOpenPanel: true,
    hud: {
        visible: true,
        metrics: {
            project: true,
            folder: true,
            workspace: true,
            group: true,
        },
    },
    onboarding: {
        seen: false,
    },
};

const isOpen = defineModel({ type: Boolean });
const props = defineProps<{
    preferences: ProjectPreferencesModel;
}>();
const emit = defineEmits<{
    "save-preferences": [preferences: ProjectPreferencesModel];
    "open-guide": [];
}>();

const hudMetricOptions: { key: ProjectHudMetricKey; label: string }[] = [
    { key: "project", label: "项目总数" },
    { key: "folder", label: "文件夹" },
    { key: "workspace", label: "工作区" },
    { key: "group", label: "分组" },
];

const clonePreferences = (preferences: ProjectPreferencesModel) => {
    return JSON.parse(JSON.stringify(preferences)) as ProjectPreferencesModel;
};

const draft = ref<ProjectPreferencesModel>(clonePreferences(defaultPreferences));

watch(
    [isOpen, () => props.preferences],
    () => {
        if (isOpen.value) {
            draft.value = clonePreferences(props.preferences);
        }
    },
    { immediate: true }
);

const resetDraft = () => {
    draft.value = clonePreferences(defaultPreferences);
};

const toggleHudMetric = (key: ProjectHudMetricKey) => {
    draft.value.hud.metrics[key] = !draft.value.hud.metrics[key];
};

const selectAllHudMetrics = () => {
    hudMetricOptions.forEach(option => {
        draft.value.hud.metrics[option.key] = true;
    });
};

const updateHudVisible = (value: boolean | null) => {
    const visible = Boolean(value);
    draft.value.hud.visible = visible;
    if (visible) {
        selectAllHudMetrics();
    }
};

const openGuide = () => {
    isOpen.value = false;
    emit("open-guide");
};

const savePreferences = () => {
    emit("save-preferences", clonePreferences(draft.value));
    isOpen.value = false;
};
</script>

<style lang="scss" scoped>
.apm-preferences {
    position: relative;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 34%, transparent);
    border-radius: 18px 8px 18px 8px;
    background:
        radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--apm-radio-silence) 20%, transparent), transparent 38%),
        radial-gradient(circle at 92% 100%, color-mix(in srgb, var(--apm-mamas-new-bag) 14%, transparent), transparent 42%),
        linear-gradient(180deg, rgba(11, 24, 28, .98), rgba(4, 8, 14, .98));
    box-shadow:
        0 26px 64px rgba(0, 0, 0, .58),
        0 0 32px color-mix(in srgb, var(--apm-radio-silence) 16%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .1);
    color: var(--apm-text-main);
}

.apm-preferences__header,
.apm-preferences__footer {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.apm-preferences__header {
    padding: 22px 24px 16px;
    border-bottom: 1px solid color-mix(in srgb, var(--apm-radio-silence) 22%, transparent);

    span {
        display: block;
        margin-bottom: 4px;
        color: color-mix(in srgb, var(--apm-radio-silence) 72%, transparent);
        font-size: 11px;
        line-height: 1.2;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
    }

    h2 {
        margin: 0;
        font-size: 24px;
        line-height: 1.2;
        letter-spacing: 0;
    }
}

.apm-preferences__body {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 14px;
    padding: 18px 24px 20px;
}

.apm-preference-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    min-height: 86px;
    padding: 16px;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 22%, transparent);
    border-radius: 12px 6px 12px 6px;
    background:
        linear-gradient(90deg, color-mix(in srgb, var(--apm-radio-silence) 8%, transparent), transparent 42%),
        rgba(255, 255, 255, .035);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .07);
}

.apm-preference-card--stack {
    display: grid;
}

.apm-preference-card--stack .apm-preference-card__copy {
    grid-template-columns: 34px minmax(0, 1fr) auto;
}

.apm-preference-card__action {
    flex: 0 0 auto;
    min-width: 118px;
    border-radius: 12px 6px 12px 6px;
    letter-spacing: 0;
}

.apm-preference-card__copy {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
    min-width: 0;

    > .v-icon {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 34%, transparent);
        border-radius: 10px 5px 10px 5px;
        color: var(--apm-radio-silence);
        background: rgba(3, 10, 12, .58);
        filter: drop-shadow(0 0 10px color-mix(in srgb, var(--apm-radio-silence) 32%, transparent));
    }

    h3 {
        margin: 0 0 4px;
        font-size: 16px;
        line-height: 1.3;
        letter-spacing: 0;
    }

    p {
        margin: 0;
        color: color-mix(in srgb, var(--apm-faded-letter) 72%, transparent);
        font-size: 13px;
        line-height: 1.55;
    }
}

.apm-hud-options {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    padding-left: 46px;
    padding-right: 66px;
    transition: opacity 160ms ease;
}

.apm-hud-option {
    display: inline-grid;
    grid-template-columns: 18px minmax(0, 1fr);
    align-items: center;
    gap: 7px;
    min-width: 0;
    width: 100%;
    min-height: 42px;
    padding: 0 12px;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 18%, transparent);
    border-radius: 9px 5px 9px 5px;
    color: color-mix(in srgb, var(--apm-faded-letter) 78%, transparent);
    background: rgba(5, 13, 18, .48);
    cursor: pointer;
    transition: border-color 160ms ease, color 160ms ease, background 160ms ease, box-shadow 160ms ease;

    .v-icon {
        color: color-mix(in srgb, var(--apm-radio-silence) 74%, transparent);
        font-size: 18px;
    }

    span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0;
    }

    &:hover:not(:disabled) {
        border-color: color-mix(in srgb, var(--apm-radio-silence) 38%, transparent);
        color: var(--apm-text-main);
        background: color-mix(in srgb, var(--apm-radio-silence) 10%, rgba(5, 13, 18, .62));
    }

    &:disabled {
        cursor: not-allowed;
    }
}

.apm-hud-option--active {
    border-color: color-mix(in srgb, var(--apm-radio-silence) 46%, transparent);
    color: var(--apm-text-main);
    background:
        linear-gradient(90deg, color-mix(in srgb, var(--apm-radio-silence) 13%, transparent), transparent 70%),
        rgba(5, 13, 18, .62);
    box-shadow: 0 0 16px color-mix(in srgb, var(--apm-radio-silence) 12%, transparent);
}

.apm-hud-options--disabled {
    opacity: .42;
}

.apm-preferences__footer {
    padding: 16px 24px 22px;
    border-top: 1px solid color-mix(in srgb, var(--apm-radio-silence) 18%, transparent);

    > div {
        display: flex;
        gap: 10px;
    }
}

@media (max-width: 680px) {
    .apm-preference-card,
    .apm-preference-card__copy,
    .apm-preferences__footer {
        align-items: stretch;
    }

    .apm-preference-card {
        display: grid;
    }

    .apm-preference-card__copy {
        grid-template-columns: 34px minmax(0, 1fr);

        .v-switch {
            grid-column: 1 / -1;
            justify-self: start;
        }
    }

    .apm-hud-options {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        padding-inline: 0;
    }

    .apm-preferences__footer {
        display: grid;

        > div {
            justify-content: end;
        }
    }
}
</style>
