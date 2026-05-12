<template>
    <div ref="listRef" class="ask-project-manage-list">
        <template v-for="(item, index) in list" :key="item.key">
            <ProjectCard
                :ref="(el) => setCardRef(el, index)"
                :item="item"
                :grid-style="getGridStyle(index)"
                @item-click="handleItemClick"
                @item-copy="handleItemCopy"
                @item-edit="handleItemEdit"
                @item-remove="handleItemRemove"
            ></ProjectCard>
        </template>
    </div>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUpdate, onMounted, onUnmounted, ref, watch } from "vue";
import ProjectCard from "./card.vue";
import { ProjectRenderItemModel } from "./types"
defineOptions({
    name: "ProjectManageList"
})
const props = withDefaults(defineProps<{
    list: ProjectRenderItemModel[]
}>(), {
    list: ()=> {
        return [] as ProjectRenderItemModel[]
    }
})

const emits = defineEmits<{
    'item-click': [item: ProjectRenderItemModel]
    'item-copy': [item: ProjectRenderItemModel]
    'item-edit': [item: ProjectRenderItemModel]
    'item-remove': [item: ProjectRenderItemModel]
}>()
const listRef = ref<HTMLElement | null>(null);
const cardRefs = ref<HTMLElement[]>([]);
type CardVisualState = {
    x: number;
    y: number;
    width: number;
    height: number;
    "--card-color-a": string;
    "--card-color-b": string;
    "--card-color-c": string;
    "--card-glow-x": string;
    "--card-glow-y": string;
    "--card-angle": string;
};
const cardPositions = ref<CardVisualState[]>([]);
let resizeObserver: ResizeObserver | null = null;
let virtualGradientPixels: Uint8ClampedArray | null = null;

onBeforeUpdate(() => {
    cardRefs.value = [];
});

const setCardRef = (el: any, index: number) => {
    const dom = el?.$el || el;
    if (dom) {
        cardRefs.value[index] = dom;
    }
};
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const VIRTUAL_GRADIENT_SIZE = 200;
const GRID_CARD_MIN = 140;
const GRID_CARD_GAP = 18;

const getThemeColor = (name: string, fallback: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
};
const alphaColor = (color: string, alpha: number) => {
    const hex = color.trim().replace("#", "");
    if (/^[0-9a-f]{6}$/i.test(hex)) {
        const value = Number.parseInt(hex, 16);
        const r = (value >> 16) & 255;
        const g = (value >> 8) & 255;
        const b = value & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (color.startsWith("rgb(")) {
        return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    }
    if (color.startsWith("rgba(")) {
        return color.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
    }
    return color;
};
const rgba = (data: Uint8ClampedArray, x: number, y: number, alpha = 1, luminance = .72) => {
    const px = Math.round(clamp(x, 0, VIRTUAL_GRADIENT_SIZE - 1));
    const py = Math.round(clamp(y, 0, VIRTUAL_GRADIENT_SIZE - 1));
    const index = (py * VIRTUAL_GRADIENT_SIZE + px) * 4;
    const r = Math.round(data[index] * luminance);
    const g = Math.round(data[index + 1] * luminance);
    const b = Math.round(data[index + 2] * luminance);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const drawRadial = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    opacity = 1
) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, alphaColor(color, opacity));
    gradient.addColorStop(.52, alphaColor(color, opacity * .34));
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE);
};
const getVirtualGradientPixels = () => {
    if (virtualGradientPixels) {
        return virtualGradientPixels;
    }
    const canvas = document.createElement("canvas");
    canvas.width = VIRTUAL_GRADIENT_SIZE;
    canvas.height = VIRTUAL_GRADIENT_SIZE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
        return null;
    }

    const riviera = getThemeColor("--apm-riviera", "#FF8B8B");
    const swanDive = getThemeColor("--apm-swan-dive", "#F9F7E8");
    const radioSilence = getThemeColor("--apm-radio-silence", "#61BFAD");
    const fadedLetter = getThemeColor("--apm-faded-letter", "#D3E8E1");
    const mamasNewBag = getThemeColor("--apm-mamas-new-bag", "#CBA0AA");
    const lateHomework = getThemeColor("--apm-late-homework", "#178E96");
    const springAwakening = getThemeColor("--apm-spring-awakening", "#20AD65");
    const ourLittleSecret = getThemeColor("--apm-our-little-secret", "#E75153");
    const dinnerParty = getThemeColor("--apm-dinner-party", "#4F3A4B");

    const base = ctx.createLinearGradient(VIRTUAL_GRADIENT_SIZE, 0, 0, VIRTUAL_GRADIENT_SIZE);
    base.addColorStop(0, lateHomework);
    base.addColorStop(.2, lateHomework);
    base.addColorStop(.38, radioSilence);
    base.addColorStop(.56, mamasNewBag);
    base.addColorStop(.74, dinnerParty);
    base.addColorStop(.88, ourLittleSecret);
    base.addColorStop(1, springAwakening);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE);

    ctx.globalCompositeOperation = "screen";
    drawRadial(ctx, 24, 28, 92, radioSilence, .24);
    drawRadial(ctx, 178, 34, 112, riviera, .34);
    drawRadial(ctx, 158, 158, 104, swanDive, .22);
    drawRadial(ctx, 58, 168, 88, lateHomework, .34);
    ctx.globalCompositeOperation = "multiply";
    const shade = ctx.createLinearGradient(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE);
    shade.addColorStop(0, alphaColor(dinnerParty, .74));
    shade.addColorStop(.52, alphaColor(dinnerParty, .78));
    shade.addColorStop(1, alphaColor(lateHomework, .54));
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE);
    ctx.fillStyle = alphaColor(dinnerParty, .32);
    ctx.fillRect(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE);
    ctx.globalCompositeOperation = "source-over";

    virtualGradientPixels = ctx.getImageData(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE).data;
    return virtualGradientPixels;
};
const sampleVirtualGradient = (x: number, y: number) => {
    const pixels = getVirtualGradientPixels();
    const px = clamp(x) * (VIRTUAL_GRADIENT_SIZE - 1);
    const py = clamp(y) * (VIRTUAL_GRADIENT_SIZE - 1);
    if (!pixels) {
        return {
            "--card-color-a": "rgba(97, 191, 173, .34)",
            "--card-color-b": "rgba(203, 160, 170, .26)",
            "--card-color-c": "rgba(23, 142, 150, .18)",
            "--card-glow-x": "78%",
            "--card-glow-y": "18%",
            "--card-angle": "135deg",
        };
    }
    const angle = Math.round(128 + (x - y) * 42);
    const glowX = Math.round(20 + x * 60);
    const glowY = Math.round(16 + y * 48);
    return {
        "--card-color-a": rgba(pixels, px - 18, py - 18, .3, .68),
        "--card-color-b": rgba(pixels, px + 24, py + 18, .24, .66),
        "--card-color-c": rgba(pixels, px + 8, py - 28, .16, .64),
        "--card-glow-x": `${glowX}%`,
        "--card-glow-y": `${glowY}%`,
        "--card-angle": `${angle}deg`,
    };
};
const getGridMetrics = (listEl: HTMLElement, itemCount: number) => {
    const availableWidth = listEl.clientWidth;
    const columnCount = Math.max(1, Math.floor((availableWidth + GRID_CARD_GAP) / (GRID_CARD_MIN + GRID_CARD_GAP)));
    const rowCount = Math.max(1, Math.ceil(itemCount / columnCount));
    return {
        columnCount,
        rowCount,
        maxAxis: Math.max(columnCount, rowCount, 1),
    };
};
const updateCardPositions = async () => {
    await nextTick();
    const listEl = listRef.value;
    if (!listEl) {
        return;
    }
    const { columnCount, maxAxis } = getGridMetrics(listEl, props.list.length);
    cardPositions.value = cardRefs.value.map((card, index) => {
        const rect = card.getBoundingClientRect();
        const colIndex = index % columnCount;
        const rowIndex = Math.floor(index / columnCount);
        const virtualX = clamp((colIndex + 0.5) / maxAxis);
        const virtualY = clamp((rowIndex + 0.5) / maxAxis);
        return {
            x: rect.left,
            y: rect.top,
            width: window.innerWidth,
            height: window.innerHeight,
            ...sampleVirtualGradient(virtualX, virtualY),
        };
    });
};
const getGridStyle = (index: number) => {
    const current = cardPositions.value[index];
    return {
        "--grid-x": `${current?.x || 0}px`,
        "--grid-y": `${current?.y || 0}px`,
        "--grid-width": `${current?.width || 1}px`,
        "--grid-height": `${current?.height || 1}px`,
        "--card-color-a": current?.["--card-color-a"] || "rgba(97, 191, 173, .34)",
        "--card-color-b": current?.["--card-color-b"] || "rgba(203, 160, 170, .26)",
        "--card-color-c": current?.["--card-color-c"] || "rgba(23, 142, 150, .18)",
        "--card-glow-x": current?.["--card-glow-x"] || "80%",
        "--card-glow-y": current?.["--card-glow-y"] || "18%",
        "--card-angle": current?.["--card-angle"] || "135deg",
    };
};
const handleItemClick = (item: ProjectRenderItemModel) => {
    emits("item-click", item)
}
const handleItemCopy = (item: ProjectRenderItemModel) => {
    emits("item-copy", item)
}
const handleItemEdit = (item: ProjectRenderItemModel) => {
    emits("item-edit", item)
}
const handleItemRemove = (item: ProjectRenderItemModel) => {
    emits("item-remove", item)
}
watch(() => props.list, () => {
    updateCardPositions();
}, {
    deep: true,
    flush: "post",
});
onMounted(() => {
    updateCardPositions();
    if (listRef.value) {
        resizeObserver = new ResizeObserver(() => {
            updateCardPositions();
        });
        resizeObserver.observe(listRef.value);
    }
    window.addEventListener("resize", updateCardPositions);
});
onUnmounted(() => {
    resizeObserver?.disconnect();
    window.removeEventListener("resize", updateCardPositions);
});
</script>
<style lang="scss" scoped>
.ask-project-manage-list{
    padding: 4px 0 24px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 18px;

    .ask-project-manage-card{
        position: relative;
        aspect-ratio: 1 / 1;
        min-width: 140px;
        max-width: 160px;
        width: 100%;
        cursor: pointer;
        will-change: transform, border-color, box-shadow;
        transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        :deep() .ask-project-manage-card__box{
            width: 100%;
            height: 100%;
        }
    }
}
</style>
