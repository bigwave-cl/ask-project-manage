<template>
    <div class="ask-project-manage-wrap">
        <div class="ask-project-manage-wrap__aura"></div>
        <canvas ref="dragonCanvasRef" class="ask-project-manage-wrap__dragon" aria-hidden="true"></canvas>
        <div class="apm-shell">
            <header class="apm-command">
                <div class="apm-command__identity">
                    <div class="apm-command__sigil">
                        <v-icon icon="mdi-creation-outline"></v-icon>
                    </div>
                    <div>
                        <div class="apm-command__eyebrow">Ling Shu Console</div>
                        <h1>灵枢项目台</h1>
                    </div>
                </div>
                <div class="apm-command__search">
                    <v-text-field
                        v-model="searchKeyword"
                        density="compact"
                        variant="solo-filled"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        hide-details
                        label="搜索项目、路径、分组"
                    ></v-text-field>
                </div>
                <div class="apm-command__actions">
                    <v-btn
                        variant="tonal"
                        color="cyan-lighten-2"
                        prepend-icon="mdi-folder-plus-outline"
                        @click="handleToolbarClick('chooseFolder')"
                    >文件夹</v-btn>
                    <v-btn
                        variant="tonal"
                        color="deep-purple-lighten-2"
                        prepend-icon="mdi-book-plus-multiple-outline"
                        @click="handleToolbarClick('chooseWorkspace')"
                    >工作区</v-btn>
                    <v-menu location="bottom end">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-dots-grid" variant="text"></v-btn>
                        </template>
                        <v-list density="compact" class="apm-menu">
                            <v-list-item prepend-icon="mdi-view-grid-plus-outline" title="添加分组" @click="handleToolbarClick('addGroup')"></v-list-item>
                            <v-list-item prepend-icon="mdi-cog-outline" title="批量管理" @click="handleToolbarClick('setting')"></v-list-item>
                            <v-list-item prepend-icon="mdi-trash-can-outline" title="删除当前分组" @click="handleToolbarClick('removeGroup')"></v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </header>

            <section class="apm-metrics">
                <div class="apm-metric">
                    <span>项目总数</span>
                    <strong>{{ totalProjectCount }}</strong>
                </div>
                <div class="apm-metric">
                    <span>工作区</span>
                    <strong>{{ workspaceCount }}</strong>
                </div>
                <div class="apm-metric">
                    <span>文件夹</span>
                    <strong>{{ folderCount }}</strong>
                </div>
                <div class="apm-metric apm-metric--active">
                    <span>当前域</span>
                    <strong>{{ currentGroupLabel }}</strong>
                </div>
            </section>

            <ProjectTab v-model="groupActiveType" :list="groupList" />

            <div class="apm-list">
            <EmptyText v-if="groupList.length === 0">
                <template #text>
                    <div>当前还没有分组数据，可以先添加分组，也可以直接从顶部导入项目</div>
                </template>
                <v-btn size="60" v-tooltip:top="toolBarRule.addGroup.tip" :icon="toolBarRule.addGroup.icon"
                    @click="handleToolbarClick('addGroup')"></v-btn>
            </EmptyText>
                <EmptyText v-if="groupActiveType && list.length === 0" text="当前没有匹配的项目符牌，试试换个关键词或导入一个项目"></EmptyText>
                <ProjectList
                    v-show="list.length > 0"
                    :list="list"
                    @item-click="handleItemClick"
                    @item-copy="copyProjectPath"
                    @item-edit="editProject"
                    @item-remove="removeProject"
                ></ProjectList>
            </div>
        </div>
    </div>
    <ProjectSetting v-model="isSettingState" :list="sourceList" @save-setting="onSaveSetting" />

    <InfoDialog ref="infoDialogRef" @sure="onInfoDialogSure"></InfoDialog>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import ProjectTab from "./tab.vue";
import ProjectList from "./list.vue";
import ProjectSetting from "./setting.vue"
import InfoDialog from "./infoDialog.vue"
import EmptyText from "./empty.vue"
import { useWrap } from "./useWrap"
defineOptions({
    name: "ProjectManageWrap"
})
const dragonCanvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId = 0;
let resizeObserver: ResizeObserver | null = null;
let lastFrameTime = 0;
let animationTime = 0;
type SpiritDragon = {
    radiusX: number;
    radiusZ: number;
    y: number;
    heightAmp: number;
    phase: number;
    linearSpeed: number;
    speedPhaseA: number;
    speedPhaseB: number;
    length: number;
    thickness: number;
    hue: number;
    tilt: number;
    alphaScale: number;
    blurScale: number;
    beadCount: number;
};
const spiritDragons: SpiritDragon[] = [];

const createSpiritDragon = (width: number, height: number, index: number): SpiritDragon => {
    const sizeTier = [0.68, 1, 1.42, 0.82, 1.2][index % 5] * (0.88 + Math.random() * 0.24);
    return {
        radiusX: width * (0.16 + Math.random() * 0.36) * sizeTier,
        radiusZ: width * (0.05 + Math.random() * 0.16) * sizeTier,
        y: height * (0.34 + Math.random() * 0.34),
        heightAmp: height * (0.014 + Math.random() * 0.05) * sizeTier,
        phase: Math.random() * Math.PI * 2,
        linearSpeed: 20 + Math.random() * 18,
        speedPhaseA: Math.random() * Math.PI * 2,
        speedPhaseB: Math.random() * Math.PI * 2,
        length: (0.34 + Math.random() * 0.42) * (0.8 + sizeTier * 0.35),
        thickness: (5 + Math.random() * 7) * sizeTier,
        hue: [172, 194, 272, 42, 318][index % 5] + Math.random() * 12,
        tilt: -0.18 + Math.random() * 0.36,
        alphaScale: 0.78 + sizeTier * 0.22,
        blurScale: 0.72 + sizeTier * 0.34,
        beadCount: sizeTier > 1.18 ? 4 : sizeTier < 0.82 ? 2 : 3,
    };
};
const ensureSpiritDragons = (width: number, height: number) => {
    const targetCount = Math.max(5, Math.min(9, Math.round((width * height) / 230000)));
    while (spiritDragons.length < targetCount) {
        spiritDragons.push(createSpiritDragon(width, height, spiritDragons.length));
    }
    if (spiritDragons.length > targetCount) {
        spiritDragons.length = targetCount;
    }
};
const projectRibbonPoint = (dragon: SpiritDragon, theta: number, width: number, height: number, time: number) => {
    const centerX = width * 0.5;
    const centerY = height * 0.54;
    const z = Math.sin(theta) * dragon.radiusZ;
    const perspective = Math.max(0.46, Math.min(1.72, 620 / (620 - z)));
    const orbitX = Math.cos(theta) * dragon.radiusX;
    const yWave = Math.sin(theta * 1.7 + dragon.phase + time * 0.00028) * dragon.heightAmp;
    return {
        x: centerX + orbitX * perspective,
        y: centerY + (dragon.y - height * 0.5 + yWave + Math.cos(theta + dragon.phase) * height * dragon.tilt * 0.08) * perspective,
        z,
        scale: perspective,
        depth: Math.max(0, Math.min(1, (z / dragon.radiusZ + 1) / 2)),
    };
};
const getRibbonPhase = (dragon: SpiritDragon, time: number) => {
    const seconds = time / 1000;
    const orbitRadius = Math.max(1, (dragon.radiusX + dragon.radiusZ) / 2);
    const speedNoise =
        1 +
        Math.sin(seconds * 0.27 + dragon.speedPhaseA) * 0.22 +
        Math.sin(seconds * 0.083 + dragon.speedPhaseB) * 0.13;
    return dragon.phase + (seconds * dragon.linearSpeed * speedNoise) / orbitRadius;
};
const isDrawablePoint = (point: { x: number; y: number; scale: number; depth: number }) => {
    return [point.x, point.y, point.scale, point.depth].every(Number.isFinite);
};
const resetAnimationClock = () => {
    lastFrameTime = 0;
};
const handleVisibilityChange = () => {
    resetAnimationClock();
};
const drawDragonBackground = (time = 0) => {
    if (document.hidden) {
        lastFrameTime = time;
        animationFrameId = window.requestAnimationFrame(drawDragonBackground);
        return;
    }
    if (!lastFrameTime) {
        lastFrameTime = time;
    }
    const delta = Math.min(50, Math.max(0, time - lastFrameTime));
    lastFrameTime = time;
    animationTime += delta;
    const canvas = dragonCanvasRef.value;
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) {
        return;
    }
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
    ensureSpiritDragons(width, height);

    spiritDragons.forEach(dragon => {
        const base = getRibbonPhase(dragon, animationTime);
        const segments = 34;
        for (let pass = 0; pass < 3; pass++) {
            const passWidth = dragon.thickness * [1.55, 0.68, 0.12][pass];
            const passAlpha = [0.035, 0.085, 0.26][pass] * dragon.alphaScale;
            const passBlur = [28, 16, 5][pass] * dragon.blurScale;
            ctx.save();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowBlur = passBlur;
            ctx.shadowColor = `hsla(${dragon.hue}, 100%, 68%, ${passAlpha})`;
            for (let i = 0; i < segments - 1; i++) {
                const t0 = i / (segments - 1);
                const t1 = (i + 1) / (segments - 1);
                const theta0 = base - dragon.length * t0;
                const theta1 = base - dragon.length * t1;
                const p0 = projectRibbonPoint(dragon, theta0, width, height, animationTime);
                const p1 = projectRibbonPoint(dragon, theta1, width, height, animationTime);
                if (!isDrawablePoint(p0) || !isDrawablePoint(p1)) {
                    continue;
                }
                const tailFade = Math.pow(1 - t0, 1.2);
                const depthAlpha = 0.08 + p0.depth * 0.92;
                const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
                grad.addColorStop(0, `hsla(${dragon.hue + 22}, 100%, ${62 + p0.depth * 16}%, ${passAlpha * tailFade * depthAlpha})`);
                grad.addColorStop(1, `hsla(${dragon.hue + 70}, 100%, ${62 + p1.depth * 14}%, ${passAlpha * Math.pow(1 - t1, 1.2) * (0.08 + p1.depth * 0.92)})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = Math.max(0.2, passWidth * (0.25 + p0.scale * 0.95) * (0.34 + tailFade * 0.66));
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                const cx = (p0.x + p1.x) / 2 + Math.sin(theta0 * 2.3 + animationTime * 0.0005) * 8 * Math.max(0.2, p0.scale);
                const cy = (p0.y + p1.y) / 2 + Math.cos(theta0 * 2.1 + animationTime * 0.0006) * 5 * Math.max(0.2, p0.scale);
                ctx.quadraticCurveTo(cx, cy, p1.x, p1.y);
                ctx.stroke();
            }
            ctx.restore();
        }

        for (let i = 0; i < dragon.beadCount; i++) {
            const beadTheta = base - dragon.length * (((animationTime / 1000) * 0.16 + i / dragon.beadCount) % 1);
            const bead = projectRibbonPoint(dragon, beadTheta, width, height, animationTime);
            if (!isDrawablePoint(bead)) {
                continue;
            }
            const alpha = (0.06 + bead.depth * 0.22) * dragon.alphaScale;
            ctx.save();
            ctx.fillStyle = `hsla(${dragon.hue + 48}, 100%, 78%, ${alpha})`;
            ctx.shadowBlur = 18 * Math.max(0.2, bead.scale);
            ctx.shadowColor = `hsla(${dragon.hue}, 100%, 72%, ${alpha})`;
            ctx.beginPath();
            const beadRadius = Math.max(0.4, (1.3 + Math.max(0.2, bead.scale) * 2.2) * Math.max(0.7, dragon.thickness / 12));
            ctx.arc(bead.x, bead.y, beadRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    animationFrameId = window.requestAnimationFrame(drawDragonBackground);
};
onMounted(() => {
    const canvas = dragonCanvasRef.value;
    if (canvas?.parentElement) {
        resizeObserver = new ResizeObserver(() => {
            drawDragonBackground();
        });
        resizeObserver.observe(canvas.parentElement);
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", resetAnimationClock);
    animationFrameId = window.requestAnimationFrame(drawDragonBackground);
});
onUnmounted(() => {
    resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("focus", resetAnimationClock);
    window.cancelAnimationFrame(animationFrameId);
});
const {
    sourceList,
    list,
    searchKeyword,
    handleItemClick,
    copyProjectPath,
    removeProject,
    editProject,
    handleToolbarClick,
    groupActiveType,
    groupList,
    currentGroupLabel,
    totalProjectCount,
    workspaceCount,
    folderCount,
    isSettingState,
    onSaveSetting,
    infoDialogRef,
    onInfoDialogSure,
    toolBarRule
} = useWrap();
</script>
<style lang="scss" scoped>
.ask-project-manage-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    color: var(--apm-text-main);
    background:
        radial-gradient(circle at 12% 18%, color-mix(in srgb, var(--apm-radio-silence) 12%, transparent), transparent 26%),
        radial-gradient(circle at 86% 8%, color-mix(in srgb, var(--apm-mamas-new-bag) 12%, transparent), transparent 24%),
        linear-gradient(135deg, var(--apm-bg-deep) 0%, color-mix(in srgb, var(--apm-dinner-party) 24%, #090f10) 42%, #070b0e 100%);

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-image:
            linear-gradient(color-mix(in srgb, var(--apm-radio-silence) 7%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--apm-radio-silence) 6%, transparent) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: radial-gradient(circle at center, black, transparent 78%);
    }

    .ask-project-manage-wrap__aura {
        position: absolute;
        z-index: 0;
        pointer-events: none;
        width: max(200%, 1500px);
        aspect-ratio: 1 / 1;
        left: 50%;
        top: 52%;
        border-radius: 50%;
        background:
            radial-gradient(circle at 22% 24%, color-mix(in srgb, var(--apm-radio-silence) 58%, transparent), transparent 22%),
            radial-gradient(circle at 78% 18%, color-mix(in srgb, var(--apm-mamas-new-bag) 52%, transparent), transparent 24%),
            radial-gradient(circle at 66% 70%, color-mix(in srgb, var(--apm-riviera) 38%, transparent), transparent 25%),
            radial-gradient(circle at 30% 76%, color-mix(in srgb, var(--apm-late-homework) 45%, transparent), transparent 28%),
            radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--apm-faded-letter) 22%, transparent), transparent 46%);
        filter: blur(25px) saturate(1.12);
        opacity: .18;
        mix-blend-mode: screen;
        will-change: transform;
        transform: translate(-50%, -50%) rotate(0deg);
        animation: wrap-aura-field 52s ease-in-out infinite;
    }

    .ask-project-manage-wrap__dragon {
        position: absolute;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: .58;
        filter: blur(.18px);
        mix-blend-mode: screen;
    }

    .apm-shell {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 22px 24px 0;
        gap: 16px;
    }

    .apm-command {
        display: grid;
        grid-template-columns: minmax(220px, 320px) minmax(260px, 1fr) auto;
        gap: 16px;
        align-items: center;
    }

    .apm-command__identity {
        display: flex;
        align-items: center;
        gap: 14px;

        h1 {
            margin: 0;
            font-size: 22px;
            line-height: 1.1;
            letter-spacing: 0;
            font-weight: 650;
        }
    }

    .apm-command__eyebrow {
        color: var(--apm-text-muted);
        font-size: 11px;
        text-transform: uppercase;
    }

    .apm-command__sigil {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 42%, transparent);
        border-radius: 14px;
        background: linear-gradient(145deg, color-mix(in srgb, var(--apm-radio-silence) 22%, transparent), color-mix(in srgb, var(--apm-mamas-new-bag) 16%, transparent));
        box-shadow: 0 0 28px color-mix(in srgb, var(--apm-radio-silence) 20%, transparent), inset 0 0 22px rgba(255, 255, 255, .06);
        color: var(--apm-radio-silence);
        font-size: 24px;
    }

    .apm-command__search {
        :deep(.v-field) {
            border: 1px solid var(--apm-border-subtle);
            border-radius: 14px;
            background: rgba(5, 12, 14, .58);
            box-shadow: inset 0 0 24px color-mix(in srgb, var(--apm-radio-silence) 7%, transparent);
        }
    }

    .apm-command__actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;

        .v-btn {
            border-radius: 12px;
        }
    }

    .apm-metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(120px, 1fr));
        gap: 10px;
    }

    .apm-metric {
        min-height: 58px;
        padding: 10px 14px;
        border: 1px solid var(--apm-border-subtle);
        border-radius: 14px;
        background: rgba(10, 18, 20, .54);

        span {
            display: block;
            color: var(--apm-text-muted);
            font-size: 12px;
        }

        strong {
            display: block;
            margin-top: 4px;
            color: var(--apm-text-main);
            font-size: 18px;
            font-weight: 650;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .apm-metric--active {
        border-color: color-mix(in srgb, var(--apm-mamas-new-bag) 34%, transparent);
        box-shadow: inset 0 0 24px color-mix(in srgb, var(--apm-mamas-new-bag) 12%, transparent);
    }

    .apm-list {
        width: 100%;
        flex: 1;
        min-width: 300px;
        overflow-y: auto;
        padding-bottom: 28px;
    }
}

@keyframes wrap-aura-field {
    0% {
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
    50% {
        transform: translate(-48%, -52%) rotate(180deg) scale(1.04);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg) scale(1);
    }
}

.apm-menu {
    border: 1px solid var(--apm-border-subtle);
    background: rgba(18, 23, 25, .96);
}

@media (max-width: 860px) {
    .ask-project-manage-wrap {
        .apm-command {
            grid-template-columns: 1fr;
        }

        .apm-command__actions {
            justify-content: flex-start;
            flex-wrap: wrap;
        }

        .apm-metrics {
            grid-template-columns: repeat(2, minmax(120px, 1fr));
        }
    }
}
</style>
