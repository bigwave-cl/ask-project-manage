<template>
    <article
        class="ask-project-manage-card"
        :class="{ 'ask-project-manage-card--current': item.isCurrent }"
        :style="{ ...cardStyle, ...gridStyle }"
        @click="handleClick(item)"
    >
        <div class="ask-project-manage-card__box">
            <div class="ask-project-manage-card__halo"></div>
            <div class="ask-project-manage-card__top">
                <div class="ask-project-manage-card__seal" aria-hidden="true">
                    <span>{{ sealText }}</span>
                    <i></i>
                </div>
                <div class="ask-project-manage-card__meta">
                    <span>{{ item.type === "workspace" ? "WORKSPACE" : "FOLDER" }}</span>
                    <strong>{{ runeName }}</strong>
                </div>
                <v-menu location="bottom end" :offset="8">
                    <template v-slot:activator="{ props }">
	                        <v-btn
	                            v-bind="props"
	                            class="ask-project-manage-card__more"
	                            icon="mdi-dots-vertical"
	                            size="x-small"
	                            variant="text"
	                            @click.stop
	                        ></v-btn>
                    </template>
                    <v-list density="compact" class="ask-project-manage-card__menu">
                        <v-list-item class="ask-project-manage-card__menu-item ask-project-manage-card__menu-item--mint" prepend-icon="mdi-open-in-new" title="打开项目" @click="handleClick(item)"></v-list-item>
                        <v-list-item class="ask-project-manage-card__menu-item ask-project-manage-card__menu-item--mauve" prepend-icon="mdi-pencil-outline" title="编辑符名" @click="handleEdit(item)"></v-list-item>
                        <v-list-item class="ask-project-manage-card__menu-item ask-project-manage-card__menu-item--fog" prepend-icon="mdi-content-copy" title="复制路径" @click="handleCopy(item)"></v-list-item>
                        <v-list-item class="ask-project-manage-card__menu-item ask-project-manage-card__menu-item--danger" prepend-icon="mdi-trash-can-outline" title="删除项目" @click="handleRemove(item)"></v-list-item>
                    </v-list>
                </v-menu>
            </div>

            <div class="ask-project-manage-card__main">
                <h2>{{ item.name }}</h2>
                <p>{{ shortPath }}</p>
            </div>

            <div class="ask-project-manage-card__bottom">
                <span>{{ item.groupLabel }}</span>
                <span v-if="item.isCurrent" class="ask-project-manage-card__status">当前窗口</span>
                <span v-else>{{ item.type === "workspace" ? "阵盘" : "玉简" }}</span>
            </div>
        </div>
    </article>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { ProjectRenderItemModel } from "./types";

defineOptions({
    name: "ProjectManageCard",
});

const props = withDefaults(
    defineProps<{
        item: ProjectRenderItemModel;
        gridStyle?: Record<string, string>;
    }>(),
    {
        item: () => {
            return {} as ProjectRenderItemModel;
        },
        gridStyle: () => ({}),
    }
);

const emits = defineEmits<{
    "item-click": [item: ProjectRenderItemModel];
    "item-copy": [item: ProjectRenderItemModel];
    "item-edit": [item: ProjectRenderItemModel];
    "item-remove": [item: ProjectRenderItemModel];
}>();

const palettes = [
    { primary: "var(--apm-radio-silence)", secondary: "var(--apm-faded-letter)", element: "青木" },
    { primary: "var(--apm-riviera)", secondary: "var(--apm-swan-dive)", element: "赤金" },
    { primary: "var(--apm-late-homework)", secondary: "var(--apm-radio-silence)", element: "玄水" },
    { primary: "var(--apm-spring-awakening)", secondary: "var(--apm-swan-dive)", element: "灵木" },
    { primary: "var(--apm-our-little-secret)", secondary: "var(--apm-dinner-party)", element: "离火" },
    { primary: "var(--apm-mamas-new-bag)", secondary: "var(--apm-riviera)", element: "幻雷" },
];

const hashText = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const signature = computed(() => `${props.item.name}-${props.item.path}-${props.item.groupLabel}`);
const palette = computed(() => palettes[hashText(signature.value) % palettes.length]);
const sealText = computed(() => {
    const source = props.item.name || props.item.type || "AP";
    return source
        .split(/[-_\s.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(cur => cur[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
});
const runeName = computed(() => {
    const lower = signature.value.toLocaleLowerCase();
    if (/ai|llm|cursor|claude|bot/.test(lower)) {
        return "灵识";
    }
    if (/sdk|lib|tools|router|publish/.test(lower)) {
        return "器修";
    }
    if (/h5|app|mobile|portal/.test(lower)) {
        return "疾行";
    }
    if (/cms|admin|finance|manage/.test(lower)) {
        return "中枢";
    }
    if (/video|image|studio|media/.test(lower)) {
        return "幻象";
    }
    return palette.value.element;
});
const shortPath = computed(() => {
    const chunks = (props.item.path || props.item.source || "").split("/").filter(Boolean);
    return chunks.slice(-3).join(" / ") || props.item.path;
});
const cardStyle = computed(() => {
    return {
        "--seal-primary": palette.value.primary,
        "--seal-secondary": palette.value.secondary,
    };
});

const handleClick = (item: ProjectRenderItemModel) => {
    emits("item-click", item);
};
const handleCopy = (item: ProjectRenderItemModel) => {
    emits("item-copy", item);
};
const handleEdit = (item: ProjectRenderItemModel) => {
    emits("item-edit", item);
};
const handleRemove = (item: ProjectRenderItemModel) => {
    emits("item-remove", item);
};
</script>
<style lang="scss">
.ask-project-manage-card {
    position: relative;
    border: 1px solid color-mix(in srgb, var(--seal-primary) 32%, transparent);
    border-radius: 18px;
    background:
        radial-gradient(circle at 0 0, var(--card-color-tl, rgba(97, 191, 173, .26)), transparent 62%),
        radial-gradient(circle at 100% 0, var(--card-color-tr, rgba(23, 142, 150, .26)), transparent 62%),
        radial-gradient(circle at 100% 100%, var(--card-color-br, rgba(203, 160, 170, .26)), transparent 66%),
        radial-gradient(circle at 0 100%, var(--card-color-bl, rgba(79, 58, 75, .26)), transparent 66%),
        linear-gradient(var(--card-angle, 135deg), var(--card-color-tr, rgba(23, 142, 150, .26)) 0%, var(--card-color-tl, rgba(97, 191, 173, .26)) 34%, var(--card-color-br, rgba(203, 160, 170, .26)) 68%, var(--card-color-bl, rgba(79, 58, 75, .26)) 100%),
        rgba(10, 17, 19, .24);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: 0 18px 44px rgba(0, 0, 0, .28), inset 0 0 0 1px rgba(255, 255, 255, .08);
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: .34;
        background:
            radial-gradient(circle at 0 0, var(--card-color-tl, rgba(97, 191, 173, .28)), transparent 58%),
            radial-gradient(circle at 100% 0, var(--card-color-tr, rgba(23, 142, 150, .26)), transparent 58%),
            radial-gradient(circle at 100% 100%, var(--card-color-br, rgba(203, 160, 170, .22)), transparent 62%),
            radial-gradient(circle at 0 100%, var(--card-color-bl, rgba(79, 58, 75, .28)), transparent 62%),
            linear-gradient(var(--card-angle, 135deg), var(--card-color-tr, rgba(23, 142, 150, .2)) 0%, var(--card-color-tl, rgba(97, 191, 173, .18)) 32%, var(--card-color-br, rgba(203, 160, 170, .16)) 68%, var(--card-color-bl, rgba(79, 58, 75, .2)) 100%);
        mask-image:
            radial-gradient(circle at 82% 12%, black 0 30px, rgba(0, 0, 0, .78) 58px, transparent 104px),
            linear-gradient(135deg, transparent 0 12%, rgba(0, 0, 0, .9) 34%, rgba(0, 0, 0, .72) 64%, transparent 90%);
        mask-composite: add;
        mix-blend-mode: soft-light;
    }

    &::after {
        content: "";
        position: absolute;
        width: 92px;
        height: 92px;
        right: -34px;
        top: -36px;
        pointer-events: none;
        border-radius: 50%;
        border: 1px solid color-mix(in srgb, var(--seal-primary) 34%, transparent);
        background:
            conic-gradient(from 0deg, transparent 0 16%, color-mix(in srgb, var(--seal-primary) 40%, transparent) 18%, transparent 20% 48%, color-mix(in srgb, var(--seal-secondary) 42%, transparent) 50%, transparent 52% 100%);
        opacity: .16;
    }

    &:hover {
        transform: translateY(-4px);
        border-color: color-mix(in srgb, var(--seal-primary) 66%, transparent);
        box-shadow: 0 24px 56px rgba(0, 0, 0, .36), 0 0 26px color-mix(in srgb, var(--seal-primary) 22%, transparent);
    }
}

.ask-project-manage-card--current {
    border-color: var(--seal-primary);
    box-shadow: 0 20px 52px rgba(0, 0, 0, .32), 0 0 30px color-mix(in srgb, var(--seal-primary) 32%, transparent);
}

.ask-project-manage-card__box {
    position: relative;
    height: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.ask-project-manage-card__halo {
    position: absolute;
    width: 96px;
    height: 96px;
    right: -42px;
    top: -44px;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in srgb, var(--seal-secondary) 34%, transparent), transparent 68%);
    filter: blur(2px);
}

.ask-project-manage-card__top,
.ask-project-manage-card__bottom {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
}

.ask-project-manage-card__top {
    gap: 6px;
}

.ask-project-manage-card__seal {
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
    position: relative;
    display: grid;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--seal-primary) 52%, transparent);
    border-radius: 14px;
    background:
        radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--seal-primary) 22%, transparent), transparent 58%),
        linear-gradient(135deg, rgba(255, 255, 255, .08), rgba(255, 255, 255, .02));
    color: #f4ffff;
    box-shadow: inset 0 0 18px color-mix(in srgb, var(--seal-primary) 16%, transparent);

    span {
        position: relative;
        z-index: 1;
        font-size: 11px;
        font-weight: 800;
    }

    i {
        position: absolute;
        inset: 6px;
        border: 1px solid color-mix(in srgb, var(--seal-secondary) 70%, transparent);
        transform: rotate(45deg);
    }
}

.ask-project-manage-card__meta {
    min-width: 0;
    flex: 1;

    span,
    strong {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    span {
        color: rgba(225, 255, 249, .48);
        font-size: 8px;
        letter-spacing: .04em;
    }

    strong {
        margin-top: 1px;
        color: color-mix(in srgb, var(--seal-primary) 78%, white);
        font-size: 10px;
        font-weight: 650;
    }
}

.ask-project-manage-card__more {
    color: rgba(239, 255, 252, .72);
    width: 22px;
    height: 22px;
    min-width: 22px;
    font-size: 12px;
}

.ask-project-manage-card__main {
    position: relative;
    z-index: 1;
    min-width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 58px;

    h2 {
        margin: 0;
        color: #f4ffff;
        font-size: 13px;
        line-height: 1.18;
        font-weight: 680;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        min-height: 46px;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    p {
        margin: 3px 0 0;
        color: rgba(225, 255, 249, .46);
        font-size: 8px;
        line-height: 1.15;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.ask-project-manage-card__bottom {
    margin-top: auto;
    justify-content: space-between;
    gap: 10px;

    span {
        min-width: 0;
        max-width: 60%;
        padding: 2px 5px;
        border: 1px solid rgba(255, 255, 255, .08);
        border-radius: 999px;
        color: rgba(235, 255, 250, .68);
        background: rgba(255, 255, 255, .04);
        font-size: 9px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .ask-project-manage-card__status {
        color: #061211;
        background: linear-gradient(90deg, var(--seal-primary), var(--seal-secondary));
        border-color: transparent;
        font-weight: 700;
    }
}

.ask-project-manage-card__menu {
    position: relative;
    min-width: 172px;
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
        min-height: 40px;
        margin: 2px 0;
        border: 1px solid transparent;
        border-radius: 8px !important;
        color: color-mix(in srgb, var(--apm-swan-dive) 88%, transparent);
        transition:
            border-color 160ms ease,
            background 160ms ease,
            color 160ms ease,
            transform 160ms ease,
            box-shadow 160ms ease;
    }

    .v-list-item__prepend {
        margin-inline-end: 14px;
    }

    .v-list-item-title {
        color: color-mix(in srgb, var(--apm-swan-dive) 88%, transparent);
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

    .ask-project-manage-card__menu-item--mint {
        color: var(--apm-radio-silence);
    }

    .ask-project-manage-card__menu-item--mauve {
        color: var(--apm-mamas-new-bag);
    }

    .ask-project-manage-card__menu-item--fog {
        color: var(--apm-faded-letter);
    }

    .ask-project-manage-card__menu-item--danger {
        color: var(--apm-riviera);
    }

    .ask-project-manage-card__menu-item--danger:hover .v-list-item-title {
        color: var(--apm-riviera);
    }
}
</style>
