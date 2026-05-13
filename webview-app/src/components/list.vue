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
    "--card-color-tl": string;
    "--card-color-tr": string;
    "--card-color-br": string;
    "--card-color-bl": string;
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
const rgba = (data: Uint8ClampedArray, x: number, y: number, alpha = .26, luminance = .62) => {
    const px = Math.round(clamp(x, 0, VIRTUAL_GRADIENT_SIZE - 1));
    const py = Math.round(clamp(y, 0, VIRTUAL_GRADIENT_SIZE - 1));
    const index = (py * VIRTUAL_GRADIENT_SIZE + px) * 4;
    const r = Math.round(data[index] * luminance);
    const g = Math.round(data[index + 1] * luminance);
    const b = Math.round(data[index + 2] * luminance);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

    const coral = getThemeColor("--apm-accent-coral", "#FF8B8B");
    const mint = getThemeColor("--apm-accent-mint", "#61BFAD");
    const mauve = getThemeColor("--apm-accent-mauve", "#CBA0AA");
    const teal = getThemeColor("--apm-accent-teal", "#178E96");
    const green = getThemeColor("--apm-accent-green", "#20AD65");
    const plum = getThemeColor("--apm-accent-plum", "#4F3A4B");

    const base = ctx.createLinearGradient(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE);
    base.addColorStop(0, plum);
    base.addColorStop(.52, teal);
    base.addColorStop(1, plum);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE);

    const paintRadial = (
        x: number,
        y: number,
        radius: number,
        stops: Array<[number, string]>
    ) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE);
    };
    ctx.globalCompositeOperation = "screen";
    paintRadial(96, 96, 98, [
        [0, mint],
        [.42, teal],
        [.72, "rgba(0, 0, 0, 0)"],
        [1, "rgba(0, 0, 0, 0)"],
    ]);
    paintRadial(54, 152, 92, [
        [0, green],
        [.48, teal],
        [1, "rgba(0, 0, 0, 0)"],
    ]);
    ctx.globalCompositeOperation = "source-over";
    paintRadial(154, 54, 86, [
        [0, mauve],
        [.58, "rgba(0, 0, 0, 0)"],
        [1, "rgba(0, 0, 0, 0)"],
    ]);
    paintRadial(30, 24, 58, [
        [0, coral],
        [.38, "rgba(0, 0, 0, 0)"],
        [1, "rgba(0, 0, 0, 0)"],
    ]);
    paintRadial(188, 188, 44, [
        [0, coral],
        [.34, "rgba(0, 0, 0, 0)"],
        [1, "rgba(0, 0, 0, 0)"],
    ]);

    virtualGradientPixels = ctx.getImageData(0, 0, VIRTUAL_GRADIENT_SIZE, VIRTUAL_GRADIENT_SIZE).data;
    return virtualGradientPixels;
};
const sampleVirtualGradient = (left: number, top: number, right: number, bottom: number) => {
    const pixels = getVirtualGradientPixels();
    const x0 = clamp(left) * (VIRTUAL_GRADIENT_SIZE - 1);
    const y0 = clamp(top) * (VIRTUAL_GRADIENT_SIZE - 1);
    const x1 = clamp(right) * (VIRTUAL_GRADIENT_SIZE - 1);
    const y1 = clamp(bottom) * (VIRTUAL_GRADIENT_SIZE - 1);
    if (!pixels) {
        return {
            "--card-color-tl": "rgba(97, 191, 173, .26)",
            "--card-color-tr": "rgba(23, 142, 150, .26)",
            "--card-color-br": "rgba(203, 160, 170, .26)",
            "--card-color-bl": "rgba(79, 58, 75, .26)",
            "--card-angle": "135deg",
        };
    }
    return {
        "--card-color-tl": rgba(pixels, x0, y0),
        "--card-color-tr": rgba(pixels, x1, y0),
        "--card-color-br": rgba(pixels, x1, y1),
        "--card-color-bl": rgba(pixels, x0, y1),
        "--card-angle": "135deg",
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
        const virtualLeft = clamp(colIndex / maxAxis);
        const virtualTop = clamp(rowIndex / maxAxis);
        const virtualRight = clamp((colIndex + 1) / maxAxis);
        const virtualBottom = clamp((rowIndex + 1) / maxAxis);
        return {
            x: rect.left,
            y: rect.top,
            width: window.innerWidth,
            height: window.innerHeight,
            ...sampleVirtualGradient(virtualLeft, virtualTop, virtualRight, virtualBottom),
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
        "--card-color-tl": current?.["--card-color-tl"] || "rgba(97, 191, 173, .26)",
        "--card-color-tr": current?.["--card-color-tr"] || "rgba(23, 142, 150, .26)",
        "--card-color-br": current?.["--card-color-br"] || "rgba(203, 160, 170, .26)",
        "--card-color-bl": current?.["--card-color-bl"] || "rgba(79, 58, 75, .26)",
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
