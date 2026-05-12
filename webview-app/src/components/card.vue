<template>
    <article
        class="ask-project-manage-card"
        :class="{ 'ask-project-manage-card--current': item.isCurrent }"
        :style="cardStyle"
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
                <v-menu location="bottom end">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            class="ask-project-manage-card__more"
                            icon="mdi-dots-vertical"
                            size="small"
                            variant="text"
                            @click.stop
                        ></v-btn>
                    </template>
                    <v-list density="compact" class="ask-project-manage-card__menu">
                        <v-list-item prepend-icon="mdi-open-in-new" title="打开项目" @click="handleClick(item)"></v-list-item>
                        <v-list-item prepend-icon="mdi-pencil-outline" title="编辑符名" @click="handleEdit(item)"></v-list-item>
                        <v-list-item prepend-icon="mdi-content-copy" title="复制路径" @click="handleCopy(item)"></v-list-item>
                        <v-list-item prepend-icon="mdi-trash-can-outline" title="删除项目" @click="handleRemove(item)"></v-list-item>
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
    }>(),
    {
        item: () => {
            return {} as ProjectRenderItemModel;
        },
    }
);

const emits = defineEmits<{
    "item-click": [item: ProjectRenderItemModel];
    "item-copy": [item: ProjectRenderItemModel];
    "item-edit": [item: ProjectRenderItemModel];
    "item-remove": [item: ProjectRenderItemModel];
}>();

const palettes = [
    { primary: "#42f5c8", secondary: "#15a6ff", element: "青木" },
    { primary: "#ffcc66", secondary: "#ff5e8a", element: "赤金" },
    { primary: "#8ea7ff", secondary: "#c77dff", element: "玄水" },
    { primary: "#a6ff68", secondary: "#00d4ff", element: "灵木" },
    { primary: "#ff8a3d", secondary: "#ffe66d", element: "离火" },
    { primary: "#f075ff", secondary: "#5fe4ff", element: "幻雷" },
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
<style lang="scss" scoped>
.ask-project-manage-card {
    position: relative;
    border: 1px solid color-mix(in srgb, var(--seal-primary) 32%, transparent);
    border-radius: 18px;
    background:
        linear-gradient(135deg, color-mix(in srgb, var(--seal-primary) 10%, transparent), transparent 48%),
        linear-gradient(160deg, rgba(13, 20, 22, .92), rgba(22, 22, 26, .84));
    box-shadow: 0 18px 44px rgba(0, 0, 0, .28), inset 0 0 0 1px rgba(255, 255, 255, .04);
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: .42;
        background:
            linear-gradient(90deg, transparent 0 26%, color-mix(in srgb, var(--seal-primary) 36%, transparent) 26% 27%, transparent 27%),
            linear-gradient(0deg, transparent 0 72%, color-mix(in srgb, var(--seal-secondary) 30%, transparent) 72% 73%, transparent 73%);
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
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
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
    gap: 8px;
}

.ask-project-manage-card__seal {
    width: 34px;
    height: 34px;
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
        font-size: 12px;
        font-weight: 800;
    }

    i {
        position: absolute;
        inset: 7px;
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
        font-size: 9px;
        letter-spacing: .04em;
    }

    strong {
        margin-top: 1px;
        color: color-mix(in srgb, var(--seal-primary) 78%, white);
        font-size: 11px;
        font-weight: 650;
    }
}

.ask-project-manage-card__more {
    color: rgba(239, 255, 252, .72);
}

.ask-project-manage-card__main {
    position: relative;
    z-index: 1;
    min-width: 0;

    h2 {
        margin: 0;
        color: #f4ffff;
        font-size: 14px;
        line-height: 1.25;
        font-weight: 680;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    p {
        margin: 5px 0 0;
        color: rgba(225, 255, 249, .52);
        font-size: 10px;
        line-height: 1.3;
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
        padding: 3px 6px;
        border: 1px solid rgba(255, 255, 255, .08);
        border-radius: 999px;
        color: rgba(235, 255, 250, .68);
        background: rgba(255, 255, 255, .04);
        font-size: 10px;
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
    border: 1px solid rgba(145, 255, 237, .16);
    background: rgba(18, 23, 25, .96);
}
</style>
