<template>
    <header class="apm-command">
        <div class="apm-command__substrate" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="apm-command__identity">
            <div class="apm-command__sigil" aria-hidden="true">
                <img class="apm-command__sigil-logo" :src="commandLogoUrl" alt="" draggable="false">
            </div>
            <div>
                <div class="apm-command__eyebrow">Ling Shu Console</div>
                <h1 class="apm-command__sr-title">灵枢控制台</h1>
                <svg class="apm-command__brush-title" viewBox="0 0 242 45" role="img" aria-label="灵枢控制台">
                    <defs>
                        <filter id="apmBrushGlow" x="-16%" y="-45%" width="132%" height="190%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="1.05" result="titleGlow"></feGaussianBlur>
                            <feFlood flood-color="#61bfad" flood-opacity=".42" result="glowColor"></feFlood>
                            <feComposite in="glowColor" in2="titleGlow" operator="in" result="coloredGlow"></feComposite>
                            <feMerge>
                                <feMergeNode in="coloredGlow"></feMergeNode>
                                <feMergeNode in="SourceGraphic"></feMergeNode>
                            </feMerge>
                        </filter>
                    </defs>
                    <path
                        class="apm-brush-title__path"
                        d="M55 17 L55 13 L54 13 L54 12 L23 12 L23 10 L40 10 L40 9 L48 9 L48 10 L55 10 L55 11 L57 11 L57 14 L58 14 L58 18 L57 18 L57 27 L52 27 L52 26 L41 26 L41 29 L42 29 L42 36 L41 36 L41 38 L42 38 L42 39 L45 39 L45 40 L49 40 L49 41 L52 41 L52 42 L55 42 L55 43 L57 43 L57 45 L52 45 L52 44 L49 44 L49 43 L46 43 L46 42 L42 42 L42 41 L39 41 L39 42 L38 42 L38 43 L36 43 L36 44 L32 44 L32 45 L22 45 L22 42 L26 42 L26 43 L29 43 L29 42 L34 42 L34 41 L36 41 L36 40 L37 40 L37 39 L38 39 L38 38 L39 38 L39 27 L38 27 L38 26 L28 26 L28 27 L24 27 L24 26 L23 26 L23 24 L55 24 L55 20 L26 20 L26 21 L24 21 L24 20 L23 20 L23 18 L42 18 L42 17 L55 17 Z M26 34 L27 34 L27 40 L26 40 L26 41 L25 41 L25 40 L24 40 L24 28 L26 28 L26 34 Z M46 37 L46 38 L44 38 L44 35 L46 35 L46 34 L48 34 L48 33 L50 33 L50 32 L52 32 L52 31 L54 31 L54 30 L58 30 L58 32 L56 32 L56 33 L54 33 L54 34 L52 34 L52 35 L50 35 L50 36 L48 36 L48 37 L46 37 Z M64 14 L63 14 L63 13 L62 13 L62 11 L68 11 L68 10 L69 10 L69 9 L71 9 L71 10 L72 10 L72 11 L75 11 L75 13 L72 13 L72 41 L74 41 L74 42 L75 42 L75 44 L74 44 L74 45 L73 45 L73 44 L70 44 L70 45 L67 45 L67 42 L69 42 L69 14 L67 14 L67 21 L66 21 L66 39 L65 39 L65 45 L63 45 L63 30 L64 30 L64 14 Z M80 12 L80 19 L79 19 L79 41 L80 41 L80 42 L97 42 L97 45 L82 45 L82 44 L78 44 L78 43 L77 43 L77 40 L76 40 L76 24 L77 24 L77 12 L76 12 L76 10 L98 10 L98 13 L93 13 L93 12 L80 12 Z M85 36 L86 36 L86 37 L91 37 L91 36 L93 36 L93 35 L94 35 L94 20 L93 20 L93 15 L96 15 L96 21 L97 21 L97 35 L96 35 L96 37 L98 37 L98 39 L97 39 L97 40 L96 40 L96 39 L94 39 L94 38 L93 38 L93 39 L81 39 L81 36 L82 36 L82 21 L83 21 L83 14 L85 14 L85 15 L86 15 L86 19 L85 19 L85 36 Z M106 14 L102 14 L102 11 L106 11 L106 9 L109 9 L109 11 L111 11 L111 13 L109 13 L109 35 L111 35 L111 37 L110 37 L110 38 L109 38 L109 44 L108 44 L108 45 L104 45 L104 44 L103 44 L103 42 L107 42 L107 39 L102 39 L102 36 L107 36 L107 25 L106 25 L106 14 Z M112 44 L112 42 L114 42 L114 41 L123 41 L123 24 L113 24 L113 22 L114 22 L114 20 L115 20 L115 19 L112 19 L112 10 L114 10 L114 11 L123 11 L123 9 L126 9 L126 11 L135 11 L135 12 L136 12 L136 13 L137 13 L137 16 L138 16 L138 17 L135 17 L135 15 L134 15 L134 14 L132 14 L132 15 L133 15 L133 18 L134 18 L134 19 L137 19 L137 21 L135 21 L135 22 L136 22 L136 24 L126 24 L126 42 L137 42 L137 44 L112 44 Z M130 13 L116 13 L116 14 L114 14 L114 16 L116 16 L116 15 L118 15 L118 18 L117 18 L117 21 L126 21 L126 22 L134 22 L134 21 L132 21 L132 20 L131 20 L131 18 L130 18 L130 13 Z M148 9 L148 11 L152 11 L152 9 L153 9 L153 8 L154 8 L154 9 L155 9 L155 11 L165 11 L165 13 L164 13 L164 14 L159 14 L159 13 L155 13 L155 17 L154 17 L154 18 L160 18 L160 19 L161 19 L161 18 L164 18 L164 19 L165 19 L165 21 L154 21 L154 22 L157 22 L157 23 L162 23 L162 24 L163 24 L163 26 L164 26 L164 28 L163 28 L163 41 L164 41 L164 44 L163 44 L163 45 L158 45 L158 44 L157 44 L157 42 L161 42 L161 26 L160 26 L160 25 L154 25 L154 34 L153 34 L153 41 L154 41 L154 45 L151 45 L151 25 L150 25 L150 26 L146 26 L146 29 L145 29 L145 45 L142 45 L142 39 L143 39 L143 22 L146 22 L146 23 L151 23 L151 21 L143 21 L143 18 L148 18 L148 19 L151 19 L151 18 L152 18 L152 14 L146 14 L146 16 L145 16 L145 17 L143 17 L143 13 L144 13 L144 11 L145 11 L145 9 L148 9 Z M170 36 L171 36 L171 40 L170 40 L170 41 L169 41 L169 40 L168 40 L168 32 L167 32 L167 11 L169 11 L169 12 L170 12 L170 36 Z M178 16 L177 16 L177 44 L176 44 L176 45 L171 45 L171 42 L175 42 L175 29 L174 29 L174 26 L175 26 L175 9 L177 9 L177 10 L178 10 L178 16 Z M206 20 L206 19 L214 19 L214 17 L213 17 L213 12 L212 12 L212 9 L215 9 L215 13 L216 13 L216 18 L217 18 L217 23 L215 23 L215 22 L199 22 L199 23 L188 23 L188 24 L186 24 L186 23 L184 23 L184 21 L183 21 L183 17 L184 17 L184 12 L185 12 L185 9 L188 9 L188 11 L187 11 L187 16 L186 16 L186 21 L190 21 L190 20 L206 20 Z M184 40 L183 40 L183 25 L184 25 L184 24 L186 24 L186 25 L193 25 L193 24 L215 24 L215 25 L217 25 L217 35 L216 35 L216 45 L214 45 L214 44 L186 44 L186 45 L184 45 L184 40 Z M214 27 L212 27 L212 26 L196 26 L196 27 L188 27 L188 28 L186 28 L186 41 L187 41 L187 42 L213 42 L213 41 L214 41 L214 27 Z"
                        filter="url(#apmBrushGlow)"
                    ></path>
                </svg>
            </div>
        </div>
        <div class="apm-command__search">
            <v-text-field
                :model-value="searchKeyword"
                density="compact"
                variant="solo-filled"
                prepend-inner-icon="mdi-magnify"
                clearable
                hide-details
                label="搜索项目、路径、分组"
                @update:model-value="emit('update:searchKeyword', String($event ?? ''))"
            ></v-text-field>
        </div>
        <div class="apm-command__actions">
            <div class="apm-import-control">
                <v-btn
                    class="apm-import-control__primary"
                    variant="tonal"
                    color="deep-purple-lighten-2"
                    prepend-icon="mdi-book-plus-multiple-outline"
                    @click="emit('toolbar-click', 'chooseWorkspace')"
                >导入工作区</v-btn>
                <v-menu location="bottom end" :offset="8">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            class="apm-import-control__toggle"
                            icon="mdi-chevron-down"
                            variant="tonal"
                            color="deep-purple-lighten-2"
                            aria-label="展开导入选项"
                        ></v-btn>
                    </template>
                    <v-list density="compact" class="apm-menu apm-import-menu">
                        <v-list-item
                            class="apm-menu__item apm-menu__item--mauve"
                            prepend-icon="mdi-book-plus-multiple-outline"
                            title="导入工作区"
                            @click="emit('toolbar-click', 'chooseWorkspace')"
                        ></v-list-item>
                        <v-list-item
                            class="apm-menu__item apm-menu__item--mint"
                            prepend-icon="mdi-folder-plus-outline"
                            title="导入文件夹"
                            @click="emit('toolbar-click', 'chooseFolder')"
                        ></v-list-item>
                        <div class="apm-menu__divider" aria-hidden="true"></div>
                        <v-list-item
                            class="apm-menu__item apm-menu__item--mint"
                            prepend-icon="mdi-database-import-outline"
                            title="导入配置"
                            @click="emit('toolbar-click', 'importConfig')"
                        ></v-list-item>
                        <div
                            class="apm-menu__submenu"
                            :class="{ 'apm-menu__submenu--left': exportSubmenuAlign === 'left' }"
                            @mouseenter="updateExportSubmenuAlign"
                            @focusin="updateExportSubmenuAlign"
                        >
                            <v-list-item
                                class="apm-menu__item apm-menu__item--coral"
                                prepend-icon="mdi-database-export-outline"
                                title="导出配置"
                                append-icon="mdi-chevron-right"
                                tabindex="0"
                            ></v-list-item>
                            <v-list density="compact" class="apm-menu apm-export-menu apm-menu__submenu-panel">
                                <v-list-item
                                    class="apm-menu__item apm-menu__item--mauve"
                                    prepend-icon="mdi-code-json"
                                    title="JSON"
                                    @click="emit('toolbar-click', 'exportConfigJson')"
                                ></v-list-item>
                                <v-list-item
                                    class="apm-menu__item apm-menu__item--mint"
                                    prepend-icon="mdi-file-code-outline"
                                    title="YML"
                                    @click="emit('toolbar-click', 'exportConfigYml')"
                                ></v-list-item>
                            </v-list>
                        </div>
                    </v-list>
                </v-menu>
            </div>
            <v-menu location="bottom end" :offset="8">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-dots-grid" variant="text"></v-btn>
                </template>
                <v-list density="compact" class="apm-menu">
                    <v-list-item
                        class="apm-menu__item apm-menu__item--mint"
                        prepend-icon="mdi-view-grid-plus-outline"
                        title="添加分组"
                        @click="emit('toolbar-click', 'addGroup')"
                    ></v-list-item>
                    <v-list-item
                        class="apm-menu__item apm-menu__item--mauve"
                        prepend-icon="mdi-cog-outline"
                        title="批量管理"
                        @click="emit('toolbar-click', 'setting')"
                    ></v-list-item>
                    <v-list-item
                        class="apm-menu__item apm-menu__item--coral"
                        prepend-icon="mdi-trash-can-outline"
                        :title="removeGroupTitle"
                        @click="emit('toolbar-click', 'removeGroup')"
                    ></v-list-item>
                </v-list>
            </v-menu>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import commandLogoUrl from "../assets/logo.svg";

defineOptions({
    name: "ProjectCommandHeader",
});

withDefaults(defineProps<{
    searchKeyword: string;
    removeGroupTitle?: string;
}>(), {
    removeGroupTitle: "删除当前分组",
});

const emit = defineEmits<{
    "update:searchKeyword": [value: string];
    "toolbar-click": [type: string];
}>();

const exportSubmenuAlign = ref<"left" | "right">("right");
const updateExportSubmenuAlign = (event: MouseEvent | FocusEvent) => {
    const target = event.currentTarget as HTMLElement | null;
    const panel = target?.querySelector<HTMLElement>(".apm-menu__submenu-panel");
    if (!target || !panel) {
        return;
    }
    const gap = 8;
    const viewportPadding = 12;
    const targetRect = target.getBoundingClientRect();
    const panelWidth = panel.offsetWidth || 138;
    const canOpenRight = targetRect.right + gap + panelWidth <= window.innerWidth - viewportPadding;
    exportSubmenuAlign.value = canOpenRight ? "right" : "left";
};
</script>

<style lang="scss">
.apm-command {
    --apm-command-control-height: 40px;
    position: relative;
    display: grid;
    grid-template-columns: minmax(220px, 320px) minmax(260px, 1fr) auto;
    gap: 16px;
    align-items: center;
    min-height: 64px;
    padding: 6px 10px;
    isolation: isolate;

    &::before,
    &::after {
        content: "";
        position: absolute;
        left: 50%;
        pointer-events: none;
        transform: translateX(-50%);
    }

    &::before {
        top: -18px;
        width: min(1080px, 92%);
        height: 58px;
        background:
            radial-gradient(ellipse at 12% 52%, color-mix(in srgb, var(--apm-radio-silence) 18%, transparent), transparent 34%),
            radial-gradient(ellipse at 84% 44%, color-mix(in srgb, var(--apm-riviera) 14%, transparent), transparent 34%),
            linear-gradient(90deg, transparent, rgba(5, 13, 15, .72) 12%, rgba(5, 13, 15, .78) 88%, transparent);
        filter: blur(14px);
        opacity: .56;
        mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
    }

    &::after {
        top: -1px;
        width: min(960px, 82%);
        height: 1px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--apm-riviera) 52%, transparent), color-mix(in srgb, var(--apm-radio-silence) 54%, transparent), transparent);
        box-shadow:
            0 0 18px color-mix(in srgb, var(--apm-radio-silence) 28%, transparent),
            0 14px 28px rgba(0, 0, 0, .34);
        animation: apm-command-line-breathe 5.6s ease-in-out infinite;
        opacity: .58;
    }
}

.apm-command__substrate {
    position: absolute;
    inset: -10px 0 auto;
    z-index: -1;
    height: 64px;
    pointer-events: none;
    overflow: hidden;
    mask-image: linear-gradient(180deg, #000 0%, #000 62%, transparent 100%);
    -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 62%, transparent 100%);

    &::before,
    &::after {
        content: "";
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
    }

    &::before {
        top: 16px;
        width: min(1120px, 92%);
        height: 32px;
        border-top: 1px solid color-mix(in srgb, var(--apm-radio-silence) 24%, transparent);
        background:
            repeating-linear-gradient(90deg, transparent 0 30px, color-mix(in srgb, var(--apm-radio-silence) 8%, transparent) 30px 31px),
            radial-gradient(ellipse at 50% 0%, rgba(249, 247, 232, .08), transparent 58%);
        transform: translateX(-50%) perspective(480px) rotateX(56deg);
    }

    &::after {
        top: 0;
        width: min(1040px, 86%);
        height: 26px;
        background:
            radial-gradient(ellipse at 18% 100%, color-mix(in srgb, var(--apm-radio-silence) 24%, transparent), transparent 46%),
            radial-gradient(ellipse at 76% 100%, color-mix(in srgb, var(--apm-riviera) 14%, transparent), transparent 48%);
        filter: blur(9px);
        opacity: .42;
    }

    span {
        position: absolute;
        top: 4px;
        width: 2px;
        height: 34px;
        border-radius: 999px;
        background: linear-gradient(180deg, color-mix(in srgb, var(--apm-radio-silence) 42%, transparent), transparent);
        box-shadow: 0 0 12px color-mix(in srgb, var(--apm-radio-silence) 24%, transparent);
        transform-origin: center top;
        animation: apm-command-tendril 6.2s ease-in-out infinite;

        &:nth-child(1) {
            left: 18%;
            transform: rotate(12deg);
        }

        &:nth-child(2) {
            left: 53%;
            height: 42px;
            animation-delay: -2.1s;
        }

        &:nth-child(3) {
            left: 83%;
            transform: rotate(-10deg);
            animation-delay: -3.4s;
        }
    }
}

.apm-command__identity {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 4px 10px 4px 0;

}

.apm-command__sr-title {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0 0 0 0);
    overflow: hidden;
    white-space: nowrap;
}

.apm-command__brush-title {
    display: block;
    width: 242px;
    height: 45px;
    margin-top: -5px;
    overflow: visible;
}

.apm-brush-title__path {
    filter:
        drop-shadow(0 1px 0 rgba(0, 0, 0, .68))
        drop-shadow(0 0 8px color-mix(in srgb, var(--apm-radio-silence) 24%, transparent));
    fill: #f9f7e8;
    fill-rule: evenodd;
}

.apm-command__eyebrow {
    color: var(--apm-text-muted);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .06em;
}

.apm-command__sigil {
    position: relative;
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    transform: rotate(-3deg);
    animation: apm-command-sigil 8.4s ease-in-out infinite;
}

.apm-command__sigil-logo {
    position: relative;
    z-index: 1;
    display: block;
    width: 54px;
    height: 54px;
    max-width: none;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
    filter:
        drop-shadow(0 0 12px color-mix(in srgb, var(--apm-radio-silence) 42%, transparent))
        drop-shadow(0 8px 18px rgba(0, 0, 0, .38));
}

.apm-command__search {
    position: relative;
    z-index: 1;

    .v-input,
    .v-input__control,
    .v-field {
        min-height: var(--apm-command-control-height);
        height: var(--apm-command-control-height);
    }

    .v-field {
        border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 30%, transparent);
        border-radius: 16px 8px 16px 8px;
        background:
            radial-gradient(circle at 86% 24%, color-mix(in srgb, var(--apm-radio-silence) 10%, transparent), transparent 38%),
            linear-gradient(180deg, rgba(9, 22, 24, .84), rgba(3, 8, 12, .72));
        box-shadow:
            0 0 28px color-mix(in srgb, var(--apm-radio-silence) 12%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, .08),
            inset 0 0 24px color-mix(in srgb, var(--apm-radio-silence) 7%, transparent);
    }

    .v-field::before {
        content: "";
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--apm-radio-silence) 50%, transparent), transparent);
        opacity: .82;
    }
}

.apm-command__actions {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-height: var(--apm-command-control-height);

    .v-btn {
        height: var(--apm-command-control-height);
        min-height: var(--apm-command-control-height);
        border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
        border-radius: 14px 7px 14px 7px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, .07), rgba(255, 255, 255, .02)),
            rgba(5, 13, 18, .68);
        box-shadow:
            0 0 18px color-mix(in srgb, currentColor 14%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, .08);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow:
                0 10px 22px rgba(0, 0, 0, .24),
                0 0 24px color-mix(in srgb, currentColor 22%, transparent),
                inset 0 1px 0 rgba(255, 255, 255, .12);
        }
    }
}

.apm-import-control {
    display: inline-flex;
    align-items: center;
    height: var(--apm-command-control-height);
    min-height: var(--apm-command-control-height);
    border-radius: 16px 8px 16px 8px;
    box-shadow: 0 0 20px color-mix(in srgb, var(--apm-mamas-new-bag) 13%, transparent);

    .v-btn {
        margin: 0;
        height: var(--apm-command-control-height);
        min-height: var(--apm-command-control-height);

        &:hover {
            transform: none;
        }
    }

    .apm-import-control__primary {
        align-self: stretch;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right-color: color-mix(in srgb, var(--apm-mamas-new-bag) 18%, transparent);
        color: var(--apm-mamas-new-bag);
    }

    .apm-import-control__toggle {
        align-self: stretch;
        width: 38px;
        min-width: 38px;
        padding-inline: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        color: var(--apm-mamas-new-bag);
    }

    .apm-import-control__toggle .v-icon {
        font-size: 18px;
    }
}

.apm-import-menu {
    width: 198px;
    min-width: 198px;
    max-height: none !important;
    overflow: visible !important;
}

.apm-export-menu {
    width: 138px;
    min-width: 138px;
}

.apm-menu {
    position: relative;
    min-width: 188px;
    overflow: hidden;
    padding: 8px;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 34%, transparent);
    border-radius: 16px !important;
    background:
        linear-gradient(180deg, rgba(12, 28, 30, .94), rgba(5, 8, 13, .96)),
        repeating-linear-gradient(90deg, rgba(97, 191, 173, .055) 0 1px, transparent 1px 18px),
        repeating-linear-gradient(180deg, rgba(249, 247, 232, .04) 0 1px, transparent 1px 16px);
    box-shadow:
        0 18px 42px rgba(0, 0, 0, .48),
        0 0 26px color-mix(in srgb, var(--apm-radio-silence) 18%, transparent),
        0 0 34px color-mix(in srgb, var(--apm-riviera) 8%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .1);
    color: var(--apm-text-main);

    &.apm-import-menu {
        min-width: 198px;
        overflow: visible !important;
    }

    &.apm-export-menu {
        min-width: 138px;
    }

    &::before,
    &::after {
        content: "";
        position: absolute;
        pointer-events: none;
    }

    &::before {
        inset: 0;
        background:
            radial-gradient(ellipse at 16% 0%, color-mix(in srgb, var(--apm-radio-silence) 24%, transparent), transparent 40%),
            radial-gradient(ellipse at 92% 100%, color-mix(in srgb, var(--apm-riviera) 16%, transparent), transparent 44%),
            linear-gradient(110deg, transparent 0 38%, rgba(249, 247, 232, .07) 46%, transparent 56% 100%);
        mix-blend-mode: screen;
        opacity: .78;
    }

    &::after {
        left: 12px;
        right: 12px;
        top: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--apm-radio-silence), var(--apm-riviera), transparent);
        box-shadow: 0 0 14px color-mix(in srgb, var(--apm-radio-silence) 38%, transparent);
        opacity: .72;
    }

    .v-list-item {
        position: relative;
        z-index: 1;
        min-height: 42px;
        margin: 2px 0;
        border: 1px solid transparent;
        border-radius: 7px !important;
        color: color-mix(in srgb, var(--apm-swan-dive) 88%, transparent);
        transition:
            border-color 160ms ease,
            background 160ms ease,
            color 160ms ease,
            transform 160ms ease,
            box-shadow 160ms ease;
    }

    .v-list-item__prepend {
        margin-inline-end: 4px;
    }

    .v-list-item__prepend > .v-icon ~ .v-list-item__spacer,
    .v-list-item__append > .v-icon ~ .v-list-item__spacer,
    .v-list-item__spacer {
        width: 4px !important;
    }

    .v-list-item__append {
        margin-inline-start: 4px;
    }

    .v-list-item-title {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0;
    }

    .v-icon {
        opacity: .94;
        filter: drop-shadow(0 0 8px currentColor);
    }

    .v-list-item__overlay {
        opacity: 0;
    }

    .v-list-item::before {
        content: "";
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, currentColor 28%, transparent), transparent);
        opacity: .34;
    }

    .apm-menu__divider {
        position: relative;
        z-index: 1;
        height: 1px;
        margin: 7px 8px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--apm-radio-silence) 24%, transparent), color-mix(in srgb, var(--apm-riviera) 18%, transparent), transparent);
        opacity: .82;
    }

    .apm-menu__submenu {
        position: relative;
        z-index: 2;
    }

    .apm-menu__submenu::after {
        content: "";
        position: absolute;
        top: 0;
        left: 100%;
        width: 10px;
        height: 100%;
    }

    .apm-menu__submenu--left::after {
        right: 100%;
        left: auto;
    }

    .apm-menu__submenu-panel {
        position: absolute;
        left: calc(100% + 8px);
        top: 0;
        z-index: 3;
        opacity: 0;
        pointer-events: none;
        transform: translateX(-4px) scale(.98);
        transform-origin: left top;
        transition:
            opacity 140ms ease,
            transform 140ms ease;
    }

    .apm-menu__submenu--left > .apm-menu__submenu-panel {
        right: calc(100% + 8px);
        left: auto;
        transform: translateX(4px) scale(.98);
        transform-origin: right top;
    }

    .apm-menu__submenu:hover > .apm-menu__submenu-panel,
    .apm-menu__submenu:focus-within > .apm-menu__submenu-panel {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(0) scale(1);
    }

    .v-list-item:hover {
        color: var(--apm-swan-dive);
        border-color: color-mix(in srgb, currentColor 28%, transparent);
        background:
            linear-gradient(90deg, color-mix(in srgb, currentColor 14%, transparent), transparent 76%),
            rgba(249, 247, 232, .035);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, .08),
            0 0 18px color-mix(in srgb, currentColor 12%, transparent);
        transform: translateX(2px);
    }

    .apm-menu__item--mint {
        color: var(--apm-radio-silence);
    }

    .apm-menu__item--mauve {
        color: var(--apm-mamas-new-bag);
    }

    .apm-menu__item--coral {
        color: var(--apm-riviera);
    }

    .apm-menu__item--mint .v-list-item-title,
    .apm-menu__item--mauve .v-list-item-title,
    .apm-menu__item--coral .v-list-item-title {
        color: color-mix(in srgb, var(--apm-swan-dive) 88%, transparent);
    }

    .apm-menu__item--mint:hover .v-list-item-title,
    .apm-menu__item--mauve:hover .v-list-item-title,
    .apm-menu__item--coral:hover .v-list-item-title {
        color: var(--apm-swan-dive);
    }
}

@keyframes apm-command-line-breathe {
    0%,
    100% {
        opacity: .42;
        transform: translateX(-50%) scaleX(.86);
    }

    50% {
        opacity: .9;
        transform: translateX(-50%) scaleX(1.04);
    }
}

@keyframes apm-command-tendril {
    0%,
    100% {
        opacity: .18;
        scale: 1 .74;
    }

    50% {
        opacity: .66;
        scale: 1 1.08;
    }
}

@keyframes apm-command-sigil {
    0%,
    100% {
        transform: rotate(-3deg) scale(1);
    }

    45% {
        transform: rotate(4deg) scale(1.02);
    }

    72% {
        transform: rotate(-8deg) scale(.98);
    }
}

@keyframes apm-command-sigil-ring {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 860px) {
    .apm-command {
        grid-template-columns: 1fr;
    }

    .apm-command__actions {
        justify-content: flex-start;
        flex-wrap: wrap;
    }
}
</style>
