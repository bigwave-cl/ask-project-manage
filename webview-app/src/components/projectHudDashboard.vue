<template>
    <section ref="cockpitRef" class="apm-cockpit" aria-label="项目统计仪表盘">
        <div
            class="apm-cockpit__panel"
            @pointermove="handleCockpitPointerMove"
            @pointerleave="handleCockpitPointerLeave"
        >
            <div class="apm-cockpit__scan" aria-hidden="true"></div>
            <svg class="apm-cockpit__ornaments" viewBox="0 0 980 160" aria-hidden="true">
                <defs>
                    <filter id="apmHudGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="2.5" result="blur"></feGaussianBlur>
                        <feMerge>
                            <feMergeNode in="blur"></feMergeNode>
                            <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                    </filter>
                    <linearGradient id="apmHudLine" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0" stop-color="#32f4ff" stop-opacity=".05"></stop>
                        <stop offset=".5" stop-color="#62e8ff" stop-opacity=".72"></stop>
                        <stop offset="1" stop-color="#ff8b8b" stop-opacity=".18"></stop>
                    </linearGradient>
                    <linearGradient id="apmHudPink" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0" stop-color="#ff8b8b" stop-opacity=".74"></stop>
                        <stop offset="1" stop-color="#61bfad" stop-opacity=".24"></stop>
                    </linearGradient>
                </defs>

                <g class="apm-ornament__circuit" filter="url(#apmHudGlow)">
                    <path d="M34 92 H98 L122 68 H212 L235 52 H304" />
                    <path d="M74 122 H154 L176 104 H292" />
                    <path d="M674 52 H760 L784 34 H916" />
                    <path d="M648 118 H754 L781 98 H942" />
                    <circle cx="122" cy="68" r="4" />
                    <circle cx="235" cy="52" r="3" />
                    <circle cx="784" cy="34" r="4" />
                    <circle cx="781" cy="98" r="3" />
                </g>

                <g class="apm-ornament__core" filter="url(#apmHudGlow)">
                    <circle cx="490" cy="74" r="46" />
                    <circle cx="490" cy="74" r="31" />
                    <path d="M490 22 A52 52 0 0 1 542 74" />
                    <path d="M438 74 A52 52 0 0 1 490 22" />
                    <path d="M542 74 A52 52 0 0 1 490 126" />
                    <path d="M490 126 A52 52 0 0 1 438 74" />
                </g>

                <g class="apm-ornament__edge" filter="url(#apmHudGlow)">
                    <path d="M82 138 H298 L326 126 H654 L682 138 H898" />
                    <path d="M116 22 H322 L348 34 H632 L658 22 H864" />
                    <path d="M52 96 H126 L146 84 H214" />
                    <path d="M766 84 H836 L856 96 H928" />
                </g>

                <g class="apm-ornament__dots">
                    <circle cx="858" cy="62" r="2" /><circle cx="874" cy="62" r="2" /><circle cx="890" cy="62" r="2" /><circle cx="906" cy="62" r="2" />
                    <circle cx="850" cy="78" r="2" /><circle cx="866" cy="78" r="2" /><circle cx="882" cy="78" r="2" /><circle cx="898" cy="78" r="2" /><circle cx="914" cy="78" r="2" />
                    <circle cx="66" cy="46" r="2" /><circle cx="82" cy="46" r="2" /><circle cx="98" cy="46" r="2" /><circle cx="114" cy="46" r="2" />
                    <circle cx="58" cy="62" r="2" /><circle cx="74" cy="62" r="2" /><circle cx="90" cy="62" r="2" /><circle cx="106" cy="62" r="2" /><circle cx="122" cy="62" r="2" />
                </g>

                <path class="apm-ornament__scanner" d="M88 144 H330 L356 132 H624 L650 144 H892" />
            </svg>

            <div class="apm-cockpit__body">
                <div
                    class="apm-cockpit__metrics"
                    :style="{ '--hud-metric-count': String(Math.max(1, metrics.length)) }"
                >
                    <article
                        v-for="metric in metrics"
                        :key="metric.key"
                        class="apm-hud-card"
                        :class="`apm-hud-card--${metric.key}`"
                        :style="{ '--metric-level': metric.level }"
                    >
                        <div class="apm-hud-card__icon">
                            <v-icon :icon="metric.icon"></v-icon>
                        </div>
                        <div class="apm-hud-card__content">
                            <span>{{ metric.label }}</span>
                            <strong>{{ metric.value }}</strong>
                        </div>
                        <div class="apm-hud-card__bar" aria-hidden="true">
                            <span></span>
                        </div>
                    </article>
                </div>
            </div>

            <footer class="apm-cockpit__footer" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </footer>

            <div class="apm-cockpit__adhesion" aria-hidden="true">
                <svg viewBox="0 0 980 128" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="apmAdhesionStroke" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0" stop-color="#61bfad" stop-opacity=".08"></stop>
                            <stop offset=".48" stop-color="#61bfad" stop-opacity=".42"></stop>
                            <stop offset="1" stop-color="#ff8b8b" stop-opacity=".18"></stop>
                        </linearGradient>
                        <radialGradient id="apmAdhesionNode">
                            <stop offset="0" stop-color="#f9f7e8" stop-opacity=".68"></stop>
                            <stop offset=".34" stop-color="#61bfad" stop-opacity=".3"></stop>
                            <stop offset="1" stop-color="#061011" stop-opacity="0"></stop>
                        </radialGradient>
                        <filter id="apmAdhesionBlur" x="-20%" y="-30%" width="140%" height="170%">
                            <feGaussianBlur stdDeviation="3.2"></feGaussianBlur>
                        </filter>
                    </defs>
                    <path class="apm-adhesion__mass" d="M84 30 C184 14 228 44 318 34 C438 20 502 10 608 34 C704 56 792 24 904 36 L980 128 H0 L0 122 C28 92 42 42 84 30 Z" />
                    <g class="apm-adhesion__tendrils">
                        <path d="M132 40 C126 66 150 78 136 112" />
                        <path d="M256 34 C236 58 260 72 242 124" />
                        <path d="M398 30 C422 54 390 78 414 126" />
                        <path d="M548 28 C520 60 560 82 530 126" />
                        <path d="M702 42 C724 66 692 84 718 122" />
                        <path d="M842 38 C818 58 850 78 830 126" />
                    </g>
                    <g class="apm-adhesion__nodes">
                        <circle cx="136" cy="105" r="7" />
                        <circle cx="242" cy="116" r="5" />
                        <circle cx="414" cy="112" r="6" />
                        <circle cx="530" cy="118" r="4" />
                        <circle cx="718" cy="108" r="6" />
                        <circle cx="830" cy="118" r="5" />
                    </g>
                </svg>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ProjectHudMetricKey } from "./types";

defineOptions({
    name: "ProjectHudDashboard",
});

const props = defineProps<{
    currentGroupLabel: string;
    totalProjectCount: number;
    folderCount: number;
    workspaceCount: number;
    groupCount: number;
    visibleMetricKeys: ProjectHudMetricKey[];
}>();

const cockpitRef = ref<HTMLElement | null>(null);

const metricValues = computed(() => [
    props.totalProjectCount,
    props.folderCount,
    props.workspaceCount,
    props.groupCount,
]);

const maxMetricValue = computed(() => Math.max(1, ...metricValues.value));

const getMetricLevel = (value: number) => {
    const level = value / maxMetricValue.value;
    return Math.max(0.18, Math.min(1, level)).toFixed(3);
};

const metrics = computed(() => [
    {
        key: "project",
        label: "项目总数",
        value: props.totalProjectCount,
        icon: "mdi-vector-square",
        level: getMetricLevel(props.totalProjectCount),
    },
    {
        key: "folder",
        label: "文件夹",
        value: props.folderCount,
        icon: "mdi-folder-cog-outline",
        level: getMetricLevel(props.folderCount),
    },
    {
        key: "workspace",
        label: "工作区",
        value: props.workspaceCount,
        icon: "mdi-book-multiple-outline",
        level: getMetricLevel(props.workspaceCount),
    },
    {
        key: "group",
        label: "分组",
        value: props.groupCount,
        icon: "mdi-orbit-variant",
        level: getMetricLevel(props.groupCount),
    },
].filter(metric => props.visibleMetricKeys.includes(metric.key as ProjectHudMetricKey)));

const handleCockpitPointerMove = (event: PointerEvent) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    target.style.setProperty("--cockpit-x", `${x * 100}%`);
    target.style.setProperty("--cockpit-y", `${y * 100}%`);
};

const handleCockpitPointerLeave = (event: PointerEvent) => {
    const target = event.currentTarget as HTMLElement;
    target.style.setProperty("--cockpit-x", "50%");
    target.style.setProperty("--cockpit-y", "18%");
};
</script>

<style lang="scss" scoped>
.apm-cockpit {
    position: absolute;
    left: 50%;
    bottom: 12px;
    z-index: 4;
    width: 980px;
    max-width: calc(100% - 64px);
    transform: translateX(-50%) scale(var(--cockpit-scale, 1));
    transform-origin: center bottom;
    pointer-events: none;
    perspective: 1080px;
    perspective-origin: 50% 92%;
    overflow: visible;
}

.apm-cockpit__panel {
    --cockpit-x: 50%;
    --cockpit-y: 20%;
    --cockpit-stage-y: 38px;
    --cockpit-edge-fade:
        linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%),
        linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%);
    position: relative;
    min-height: 130px;
    padding: 0 38px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow: visible;
    pointer-events: auto;
    isolation: isolate;
    transform-style: preserve-3d;

    &::before,
    &::after {
        content: "";
        position: absolute;
        pointer-events: none;
    }

    &::before {
        left: 50%;
        top: 50%;
        width: 760px;
        height: 166px;
        border: 0;
        border-radius: 0;
        background:
            radial-gradient(ellipse at 50% -18%, rgba(128, 214, 255, .2), transparent 56%),
            radial-gradient(ellipse at 50% 108%, color-mix(in srgb, var(--apm-riviera) 18%, transparent), transparent 58%),
            linear-gradient(180deg, rgba(7, 16, 30, .5), rgba(3, 8, 18, .82)),
            repeating-linear-gradient(90deg, rgba(112, 225, 255, .035) 0 1px, transparent 1px 22px);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow:
            0 24px 58px rgba(0, 0, 0, .38),
            0 0 34px rgba(82, 151, 255, .12),
            0 0 52px color-mix(in srgb, var(--apm-riviera) 12%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, .12),
            inset 0 18px 36px rgba(106, 226, 255, .05),
            inset 0 0 42px rgba(81, 184, 255, .08);
        mask-image: var(--cockpit-edge-fade);
        mask-composite: intersect;
        -webkit-mask-image: var(--cockpit-edge-fade);
        -webkit-mask-composite: source-in;
        transform: translate3d(-50%, var(--cockpit-stage-y), -116px) rotateX(58deg) skewX(-4deg);
        transform-origin: center center;
    }

    &::after {
        left: 50%;
        top: 50%;
        width: 760px;
        height: 166px;
        background:
            radial-gradient(circle at var(--cockpit-x) var(--cockpit-y), rgba(145, 233, 255, .18), transparent 22%),
            linear-gradient(90deg, transparent 10%, rgba(104, 221, 255, .38), color-mix(in srgb, var(--apm-riviera) 30%, transparent), transparent 90%);
        background-size: auto, 100% 1px;
        background-position: center, bottom;
        background-repeat: no-repeat;
        mix-blend-mode: screen;
        opacity: .78;
        border-radius: 0;
        clip-path: none;
        box-shadow:
            inset 0 -18px 28px rgba(0, 0, 0, .28),
            0 22px 42px rgba(0, 0, 0, .36);
        mask-image: var(--cockpit-edge-fade);
        mask-composite: intersect;
        -webkit-mask-image: var(--cockpit-edge-fade);
        -webkit-mask-composite: source-in;
        transform: translate3d(-50%, var(--cockpit-stage-y), -104px) rotateX(58deg) skewX(-4deg);
        transform-origin: center center;
    }
}

.apm-cockpit__scan {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 760px;
    height: 166px;
    z-index: -1;
    background:
        linear-gradient(180deg, transparent 0, rgba(255, 255, 255, .06) 48%, transparent 100%),
        repeating-linear-gradient(0deg, transparent 0 9px, rgba(249, 247, 232, .035) 9px 10px);
    border-radius: 130px 130px 32px 32px;
    opacity: .34;
    overflow: hidden;
    mask-image: var(--cockpit-edge-fade);
    mask-composite: intersect;
    -webkit-mask-image: var(--cockpit-edge-fade);
    -webkit-mask-composite: source-in;
    transform: translate3d(-50%, var(--cockpit-stage-y), -96px) rotateX(58deg) skewX(-4deg);
    animation: apm-hud-scan 5.8s linear infinite;
}

.apm-cockpit__ornaments {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 0;
    width: 760px;
    height: 166px;
    color: rgba(113, 234, 255, .66);
    opacity: .58;
    pointer-events: none;
    transform: translate3d(-50%, var(--cockpit-stage-y), -102px) rotateX(58deg) skewX(-4deg);
    transform-origin: center center;
    filter: blur(.15px);
    mask-image:
        linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%),
        linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%);
    mask-composite: intersect;
    -webkit-mask-image:
        linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%),
        linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%);
    -webkit-mask-composite: source-in;

    path,
    circle,
    line {
        fill: none;
        vector-effect: non-scaling-stroke;
    }
}

.apm-cockpit__body {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: stretch;
    min-height: 118px;
    width: min(540px, 100%);
    margin: 0 auto;
    transform: translateY(12px);
    transform-style: preserve-3d;
}

.apm-cockpit__metrics {
    display: grid;
    grid-template-columns: repeat(var(--hud-metric-count, 4), minmax(0, 1fr));
    gap: 12px;
    align-items: end;
}

.apm-hud-card {
    --metric-level: .5;
    position: relative;
    min-width: 0;
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    grid-template-rows: 1fr 6px;
    gap: 10px;
    align-items: center;
    min-height: 94px;
    padding: 12px;
    border: 1px solid color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 34%, transparent);
    border-radius: 12px;
    background:
        linear-gradient(90deg, color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 10%, transparent), transparent 22%, transparent 72%, color-mix(in srgb, var(--apm-riviera) 8%, transparent)),
        radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 20%, transparent), transparent 34%),
        repeating-linear-gradient(0deg, rgba(246, 255, 255, .038) 0 1px, transparent 1px 7px),
        linear-gradient(180deg, rgba(13, 32, 45, .72), rgba(3, 9, 20, .66));
    box-shadow:
        0 14px 28px rgba(0, 0, 0, .24),
        0 0 20px color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 10%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .08);
    overflow: hidden;
    transform: translateY(0);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease, background 220ms ease;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
            linear-gradient(135deg, color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 16%, transparent), transparent 46%),
            repeating-linear-gradient(90deg, transparent 0 11px, rgba(255, 255, 255, .045) 11px 12px);
        opacity: .56;
        pointer-events: none;
    }

    &:hover {
        border-color: color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 58%, transparent);
        box-shadow:
            0 12px 28px rgba(0, 0, 0, .24),
            0 0 24px color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 18%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, .12);
        transform: translateY(-6px);
    }
}

.apm-hud-card--project {
    --card-accent: var(--apm-radio-silence);
}

.apm-hud-card--folder {
    --card-accent: var(--apm-riviera);
}

.apm-hud-card--workspace {
    --card-accent: var(--apm-mamas-new-bag);
}

.apm-hud-card--group {
    --card-accent: var(--apm-spring-awakening);
}

.apm-hud-card__icon {
    position: relative;
    z-index: 1;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 42%, transparent);
    border-radius: 10px;
    color: var(--card-accent, var(--apm-radio-silence));
    background: rgba(3, 10, 12, .62);
    box-shadow: 0 0 18px color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 18%, transparent);
}

.apm-hud-card__content {
    position: relative;
    z-index: 1;
    min-width: 0;
    display: grid;
    gap: 2px;

    span {
        color: color-mix(in srgb, var(--apm-faded-letter) 68%, transparent);
        font-size: 12px;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    strong {
        color: var(--apm-swan-dive);
        font-size: clamp(24px, 2.7vw, 34px);
        font-weight: 780;
        line-height: 1;
        text-shadow: 0 0 18px color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 28%, transparent);
        font-variant-numeric: tabular-nums;
    }
}

.apm-hud-card__bar {
    position: relative;
    z-index: 1;
    grid-column: 1 / -1;
    height: 6px;
    border-radius: 999px;
    background: rgba(0, 0, 0, .28);
    overflow: hidden;

    span {
        display: block;
        width: calc(var(--metric-level) * 100%);
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--card-accent, var(--apm-radio-silence)), var(--apm-swan-dive));
        box-shadow: 0 0 14px color-mix(in srgb, var(--card-accent, var(--apm-radio-silence)) 36%, transparent);
        transition: width 360ms ease;
    }
}

.apm-cockpit__footer {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 90px 1fr;
    gap: 12px;
    width: min(560px, 76%);
    margin: 8px auto 0;

    span {
        height: 2px;
        border-radius: 999px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--apm-radio-silence) 56%, transparent), transparent);

        &:nth-child(2) {
            background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--apm-riviera) 60%, transparent), transparent);
        }
    }
}

.apm-cockpit__adhesion {
    position: absolute;
    left: 50%;
    bottom: -28px;
    z-index: 1;
    width: min(940px, 96%);
    height: 96px;
    pointer-events: none;
    transform: translateX(-50%);
    opacity: .58;
    mix-blend-mode: screen;
    mask-image: linear-gradient(180deg, transparent 0%, #000 14%, #000 68%, transparent 100%);
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 14%, #000 68%, transparent 100%);

    &::before,
    &::after {
        content: "";
        position: absolute;
        left: 50%;
        pointer-events: none;
        transform: translateX(-50%);
    }

    &::before {
        bottom: 0;
        width: 86%;
        height: 34px;
        border-radius: 50%;
        background:
            radial-gradient(ellipse at 50% 20%, color-mix(in srgb, var(--apm-radio-silence) 22%, transparent), transparent 62%),
            radial-gradient(ellipse at 38% 60%, color-mix(in srgb, var(--apm-riviera) 12%, transparent), transparent 58%),
            linear-gradient(180deg, rgba(2, 8, 10, .08), rgba(0, 0, 0, .72));
        filter: blur(13px);
    }

    &::after {
        bottom: 20px;
        width: 64%;
        height: 1px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--apm-radio-silence) 50%, transparent), color-mix(in srgb, var(--apm-riviera) 28%, transparent), transparent);
        box-shadow:
            0 0 18px color-mix(in srgb, var(--apm-radio-silence) 22%, transparent),
            0 16px 28px rgba(0, 0, 0, .46);
        animation: apm-adhesion-breathe 5.4s ease-in-out infinite;
    }

    svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    > span {
        position: absolute;
        bottom: 26px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--apm-radio-silence) 54%, transparent);
        box-shadow:
            0 0 12px color-mix(in srgb, var(--apm-radio-silence) 44%, transparent),
            0 0 22px color-mix(in srgb, var(--apm-riviera) 16%, transparent);
        animation: apm-adhesion-node 4.8s ease-in-out infinite;

        &:nth-of-type(1) {
            left: 27%;
            animation-delay: -1.2s;
        }

        &:nth-of-type(2) {
            left: 51%;
            width: 4px;
            height: 4px;
            animation-delay: -2.8s;
        }

        &:nth-of-type(3) {
            left: 73%;
            animation-delay: -.4s;
        }
    }
}

.apm-adhesion__mass {
    fill: rgba(2, 10, 13, .58);
    filter: url(#apmAdhesionBlur);
}

.apm-adhesion__tendrils {
    fill: none;
    stroke: url(#apmAdhesionStroke);
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-dasharray: 84 26;
    filter: drop-shadow(0 0 8px color-mix(in srgb, var(--apm-radio-silence) 22%, transparent));
    animation: apm-tendril-drift 7.6s ease-in-out infinite;
}

.apm-adhesion__nodes {
    fill: url(#apmAdhesionNode);
    opacity: .82;
    animation: apm-adhesion-node 4.8s ease-in-out infinite reverse;
}

@keyframes apm-hud-scan {
    0%,
    100% {
        opacity: .22;
        filter: brightness(.9);
    }

    50% {
        opacity: .52;
        filter: brightness(1.25);
    }
}

@keyframes apm-adhesion-breathe {
    0%,
    100% {
        opacity: .42;
        transform: translateX(-50%) scaleX(.82);
    }

    50% {
        opacity: .9;
        transform: translateX(-50%) scaleX(1.04);
    }
}

@keyframes apm-tendril-drift {
    0%,
    100% {
        stroke-dashoffset: 0;
        transform: translateY(0);
        opacity: .64;
    }

    50% {
        stroke-dashoffset: -36;
        transform: translateY(5px);
        opacity: .9;
    }
}

@keyframes apm-adhesion-node {
    0%,
    100% {
        opacity: .38;
        transform: translateY(0) scale(.82);
    }

    50% {
        opacity: .9;
        transform: translateY(-8px) scale(1.08);
    }
}

.apm-ornament__circuit {
    stroke: url(#apmHudLine);
    stroke-width: 1.1;
    stroke-linecap: round;
    stroke-linejoin: round;

    path {
        stroke-dasharray: 74 34;
        animation: apm-circuit-flow 7.5s linear infinite;
    }

    circle {
        fill: rgba(112, 236, 255, .78);
        stroke: rgba(112, 236, 255, .26);
        animation: apm-node-pulse 3.6s ease-in-out infinite;
    }
}

.apm-ornament__core {
    transform-box: fill-box;
    transform-origin: center;
    animation: apm-core-drift 12s linear infinite;

    circle {
        stroke: rgba(112, 236, 255, .32);
        stroke-width: 1;
    }

    path {
        stroke: color-mix(in srgb, var(--apm-riviera) 70%, transparent);
        stroke-width: 1.3;
        stroke-linecap: round;
        stroke-dasharray: 46 18;
        animation: apm-ring-flow 4.8s linear infinite;
    }
}

.apm-ornament__edge {
    stroke: rgba(112, 236, 255, .52);
    stroke-width: 1.2;
    stroke-linecap: round;
    stroke-linejoin: round;

    path {
        stroke-dasharray: 88 34;
        animation: apm-edge-run 5.8s linear infinite;

        &:nth-child(even) {
            stroke: color-mix(in srgb, var(--apm-riviera) 52%, transparent);
            stroke-dasharray: 52 42;
            animation-duration: 7.2s;
            animation-direction: reverse;
        }
    }
}

.apm-ornament__dots {
    fill: color-mix(in srgb, var(--apm-riviera) 62%, transparent);
    animation: apm-dot-breathe 3.8s ease-in-out infinite;

    circle:nth-child(3n) {
        fill: rgba(112, 236, 255, .62);
    }

    circle:nth-child(4n) {
        opacity: .42;
    }
}

.apm-ornament__scanner {
    fill: none;
    stroke: url(#apmHudPink);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 140 620;
    filter: url(#apmHudGlow);
    animation: apm-scanner-slide 4.2s ease-in-out infinite;
}

@keyframes apm-circuit-flow {
    to {
        stroke-dashoffset: -108;
    }
}

@keyframes apm-node-pulse {
    0%,
    100% {
        opacity: .46;
    }

    50% {
        opacity: .95;
    }
}

@keyframes apm-core-drift {
    to {
        transform: rotate(360deg);
    }
}

@keyframes apm-ring-flow {
    to {
        stroke-dashoffset: -64;
    }
}

@keyframes apm-edge-run {
    to {
        stroke-dashoffset: -122;
    }
}

@keyframes apm-dot-breathe {
    0%,
    100% {
        opacity: .38;
        transform: translateY(0);
    }

    50% {
        opacity: .82;
        transform: translateY(-2px);
    }
}

@keyframes apm-scanner-slide {
    0% {
        stroke-dashoffset: 760;
        opacity: .16;
    }

    48% {
        opacity: .86;
    }

    100% {
        stroke-dashoffset: 0;
        opacity: .16;
    }
}

@media (max-width: 900px) {
    .apm-cockpit {
        --cockpit-mobile-scale: .78;
        bottom: 12px;
        max-width: none;
    }

    .apm-cockpit__panel {
        padding: 0 38px;
    }

    .apm-cockpit__body {
        width: min(540px, 100%);
    }

    .apm-cockpit__metrics {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

@media (max-width: 760px) {
    .apm-cockpit {
        --cockpit-scale: .66;
    }
}

@media (max-width: 600px) {
    .apm-cockpit {
        --cockpit-scale: .54;
    }
}

@media (max-width: 520px) {
    .apm-cockpit {
        --cockpit-scale: .46;
    }
}

@media (max-width: 420px) {
    .apm-cockpit {
        --cockpit-scale: .38;
    }
}
</style>
