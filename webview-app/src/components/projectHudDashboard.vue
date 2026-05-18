<template>
    <section class="apm-cockpit" aria-label="项目统计仪表盘">
        <div
            class="apm-cockpit__panel"
            @pointermove="handleCockpitPointerMove"
            @pointerleave="handleCockpitPointerLeave"
        >
            <div class="apm-cockpit__topline">
                <span>LING SHU PROJECT DECK</span>
                <b>{{ currentGroupLabel }}</b>
            </div>
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
                        <stop offset=".5" stop-color="#62e8ff" stop-opacity=".76"></stop>
                        <stop offset="1" stop-color="#c45dff" stop-opacity=".12"></stop>
                    </linearGradient>
                    <linearGradient id="apmHudPink" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0" stop-color="#ff4f9a" stop-opacity=".78"></stop>
                        <stop offset="1" stop-color="#6defff" stop-opacity=".22"></stop>
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
                    <line x1="490" y1="22" x2="490" y2="38" />
                    <line x1="490" y1="110" x2="490" y2="126" />
                    <line x1="438" y1="74" x2="454" y2="74" />
                    <line x1="526" y1="74" x2="542" y2="74" />
                </g>

                <g class="apm-ornament__ticks">
                    <path d="M350 28 H386" />
                    <path d="M594 28 H630" />
                    <path d="M354 134 H398" />
                    <path d="M582 134 H626" />
                    <path d="M316 80 H340" />
                    <path d="M640 80 H664" />
                </g>

                <g class="apm-ornament__edge" filter="url(#apmHudGlow)">
                    <path d="M82 138 H298 L326 126 H654 L682 138 H898" />
                    <path d="M116 22 H322 L348 34 H632 L658 22 H864" />
                    <path d="M52 96 H126 L146 84 H214" />
                    <path d="M766 84 H836 L856 96 H928" />
                    <path d="M188 150 H392" />
                    <path d="M588 150 H792" />
                </g>

                <g class="apm-ornament__dots">
                    <circle cx="858" cy="62" r="2" /><circle cx="874" cy="62" r="2" /><circle cx="890" cy="62" r="2" /><circle cx="906" cy="62" r="2" />
                    <circle cx="850" cy="78" r="2" /><circle cx="866" cy="78" r="2" /><circle cx="882" cy="78" r="2" /><circle cx="898" cy="78" r="2" /><circle cx="914" cy="78" r="2" />
                    <circle cx="858" cy="94" r="2" /><circle cx="874" cy="94" r="2" /><circle cx="890" cy="94" r="2" /><circle cx="906" cy="94" r="2" />
                    <circle cx="66" cy="46" r="2" /><circle cx="82" cy="46" r="2" /><circle cx="98" cy="46" r="2" /><circle cx="114" cy="46" r="2" />
                    <circle cx="58" cy="62" r="2" /><circle cx="74" cy="62" r="2" /><circle cx="90" cy="62" r="2" /><circle cx="106" cy="62" r="2" /><circle cx="122" cy="62" r="2" />
                </g>

                <path class="apm-ornament__scanner" d="M88 144 H330 L356 132 H624 L650 144 H892" />
            </svg>
            <div class="apm-cockpit__deck">
                <div class="apm-cockpit__cards apm-cockpit__cards--left">
                    <div class="apm-hud-card apm-hud-card--project">
                        <div class="apm-hud-card__icon"><v-icon icon="mdi-vector-square"></v-icon></div>
                        <div class="apm-hud-card__meta">
                            <span>项目总数</span>
                            <strong>{{ totalProjectCount }}</strong>
                        </div>
                        <div class="apm-hud-card__signal" aria-hidden="true"></div>
                    </div>
                    <div class="apm-hud-card apm-hud-card--folder">
                        <div class="apm-hud-card__icon"><v-icon icon="mdi-folder-cog-outline"></v-icon></div>
                        <div class="apm-hud-card__meta">
                            <span>文件夹</span>
                            <strong>{{ folderCount }}</strong>
                        </div>
                        <div class="apm-hud-card__signal" aria-hidden="true"></div>
                    </div>
                </div>

                <div class="apm-hub-core" aria-hidden="true">
                    <div class="apm-hub-core__ring">
                        <span></span><span></span><span></span>
                    </div>
                    <div class="apm-hub-core__label">
                        <span>ACTIVE</span>
                        <strong>{{ currentGroupLabel }}</strong>
                    </div>
                </div>

                <div class="apm-cockpit__cards apm-cockpit__cards--right">
                    <div class="apm-hud-card apm-hud-card--workspace">
                        <div class="apm-hud-card__icon"><v-icon icon="mdi-book-multiple-outline"></v-icon></div>
                        <div class="apm-hud-card__meta">
                            <span>工作区</span>
                            <strong>{{ workspaceCount }}</strong>
                        </div>
                        <div class="apm-hud-card__signal" aria-hidden="true"></div>
                    </div>
                    <div class="apm-hud-card apm-hud-card--group">
                        <div class="apm-hud-card__icon"><v-icon icon="mdi-orbit-variant"></v-icon></div>
                        <div class="apm-hud-card__meta">
                            <span>分组</span>
                            <strong>{{ groupCount }}</strong>
                        </div>
                        <div class="apm-hud-card__signal" aria-hidden="true"></div>
                    </div>
                </div>
            </div>
            <div class="apm-cockpit__rail" aria-hidden="true">
                <span></span><span></span><span></span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
defineOptions({
    name: "ProjectHudDashboard",
});

defineProps<{
    currentGroupLabel: string;
    totalProjectCount: number;
    folderCount: number;
    workspaceCount: number;
    groupCount: number;
}>();

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
    target.style.setProperty("--cockpit-y", "20%");
};
</script>

<style lang="scss" scoped>
.apm-cockpit {
    position: absolute;
    left: 50%;
    bottom: 52px;
    width: 980px;
    max-width: calc(100% - 64px);
    transform: translateX(-50%) scale(var(--cockpit-scale, 1));
    transform-origin: center bottom;
    padding: 0;
    perspective: 1080px;
    perspective-origin: 50% 92%;
    overflow: visible;
}

.apm-cockpit__panel {
    --cockpit-x: 50%;
    --cockpit-y: 20%;
    position: relative;
    min-height: 352px;
    padding: 40px 38px 30px;
    border: 0;
    border-radius: 150px 150px 34px 34px;
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    transform: translateZ(0);
    transform-origin: center bottom;
    transform-style: preserve-3d;
    transition: transform 520ms cubic-bezier(.2, .8, .2, 1), box-shadow 260ms ease;
    box-shadow: none;
    overflow: visible;
    pointer-events: auto;

    &:hover {
        .apm-cockpit__deck {
            transform: translateZ(28px) rotateX(58deg);
        }

        .apm-cockpit__deck::before {
            opacity: .95;
            transform: translate3d(-50%, -26%, -78px) rotateX(6deg) scale(1.06);
        }

        .apm-cockpit__deck::after {
            opacity: .78;
            transform: translate3d(-50%, -76%, 132px) rotateX(-12deg) scale(1.04);
        }

        .apm-hub-core {
            --hub-z: 296px;
            --hub-float: -92px;
        }

        .apm-hud-card {
            --spread-scale: 1;
            --spread-z: 178px;
            --spread-tilt-x: -4deg;
        }

        .apm-hud-card--project {
            --spread-x: -312px;
            --spread-y: -122px;
            --spread-rotate: 26deg;
            --hover-rotate: 20deg;
            --spread-shadow-x: 22px;
            transition-delay: 0ms;
        }

        .apm-hud-card--folder {
            --spread-x: -238px;
            --spread-y: 100px;
            --spread-rotate: 16deg;
            --hover-rotate: 10deg;
            --spread-shadow-x: 16px;
            transition-delay: 90ms;
        }

        .apm-hud-card--workspace {
            --spread-x: 238px;
            --spread-y: -122px;
            --spread-rotate: -16deg;
            --hover-rotate: -10deg;
            --spread-shadow-x: -16px;
            transition-delay: 130ms;
        }

        .apm-hud-card--group {
            --spread-x: 312px;
            --spread-y: 100px;
            --spread-rotate: -26deg;
            --hover-rotate: -20deg;
            --spread-shadow-x: -22px;
            transition-delay: 180ms;
        }
    }

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
        border: 1px solid rgba(118, 224, 255, .22);
        border-radius: 130px 130px 32px 32px;
        background:
            radial-gradient(ellipse at 50% -18%, rgba(128, 214, 255, .2), transparent 56%),
            radial-gradient(ellipse at 50% 108%, rgba(154, 91, 255, .16), transparent 58%),
            linear-gradient(180deg, rgba(7, 16, 30, .5), rgba(3, 8, 18, .82)),
            repeating-linear-gradient(90deg, rgba(112, 225, 255, .035) 0 1px, transparent 1px 22px);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow:
            0 24px 58px rgba(0, 0, 0, .38),
            0 0 34px rgba(82, 151, 255, .12),
            0 0 52px rgba(169, 92, 255, .08),
            inset 0 1px 0 rgba(255, 255, 255, .12),
            inset 0 0 42px rgba(81, 184, 255, .08);
        transform: translate3d(-50%, -92px, -116px) rotateX(58deg) skewX(-4deg);
        transform-origin: center center;
    }

    &::after {
        left: 50%;
        top: 50%;
        width: 760px;
        height: 166px;
        background:
            radial-gradient(circle at var(--cockpit-x) var(--cockpit-y), rgba(145, 233, 255, .18), transparent 22%),
            linear-gradient(90deg, transparent 10%, rgba(104, 221, 255, .38), rgba(173, 105, 255, .26), transparent 90%);
        background-size: auto, 100% 1px;
        background-position: center, bottom;
        background-repeat: no-repeat;
        mix-blend-mode: screen;
        opacity: .78;
        border-radius: 130px 130px 32px 32px;
        clip-path: inset(0 round 130px 130px 32px 32px);
        transform: translate3d(-50%, -92px, -104px) rotateX(58deg) skewX(-4deg);
        transform-origin: center center;
    }
}

.apm-cockpit__panel::before {
    box-shadow:
        0 1px 0 rgba(141, 238, 255, .18),
        inset 0 18px 36px rgba(106, 226, 255, .05);
}

.apm-cockpit__panel::after {
    box-shadow:
        inset 0 -18px 28px rgba(0, 0, 0, .28),
        0 22px 42px rgba(0, 0, 0, .36);
}

.apm-cockpit__topline {
    position: absolute;
    top: 34px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 3px 14px;
    border: 1px solid rgba(116, 225, 255, .18);
    border-radius: 999px;
    background: rgba(3, 8, 18, .58);
    color: rgba(218, 246, 255, .72);
    font-size: 9px;
    letter-spacing: .12em;
    white-space: nowrap;

    b {
        color: #79ffde;
        font-size: 9px;
        font-weight: 700;
    }
}

.apm-cockpit__ornaments {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 0;
    width: 760px;
    height: 166px;
    color: rgba(113, 234, 255, .66);
    opacity: .72;
    pointer-events: none;
    transform: translate3d(-50%, -92px, -102px) rotateX(58deg) skewX(-4deg);
    transform-origin: center center;

    path,
    circle,
    line {
        fill: none;
        vector-effect: non-scaling-stroke;
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
        stroke: rgba(255, 83, 160, .58);
        stroke-width: 1.3;
        stroke-linecap: round;
        stroke-dasharray: 46 18;
        animation: apm-ring-flow 4.8s linear infinite;
    }

    line {
        stroke: rgba(194, 104, 255, .38);
        stroke-width: 1;
    }
}

.apm-ornament__ticks {
    stroke: rgba(112, 236, 255, .38);
    stroke-width: 1.2;
    stroke-linecap: round;

    path {
        stroke-dasharray: 16 20;
        animation: apm-tick-blink 2.8s ease-in-out infinite;
    }
}

.apm-ornament__edge {
    stroke: rgba(112, 236, 255, .58);
    stroke-width: 1.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: .9;

    path {
        stroke-dasharray: 88 34;
        animation: apm-edge-run 5.8s linear infinite;

        &:nth-child(even) {
            stroke: rgba(255, 83, 160, .46);
            stroke-dasharray: 52 42;
            animation-duration: 7.2s;
            animation-direction: reverse;
        }
    }
}

.apm-ornament__dots {
    fill: rgba(255, 78, 148, .54);
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

.apm-cockpit__deck {
    position: relative;
    z-index: 2;
    height: 266px;
    display: grid;
    place-items: center;
    transform: translateZ(20px) rotateX(58deg);
    transform-origin: center center;
    transform-style: preserve-3d;
    transition: transform 520ms cubic-bezier(.2, .8, .2, 1);
}

.apm-cockpit__cards {
    position: absolute;
    inset: 0;
    z-index: 2;
    transform-style: preserve-3d;
    pointer-events: none;
}

.apm-cockpit__cards--left {
    perspective-origin: right center;
}

.apm-cockpit__cards--right {
    perspective-origin: left center;
}

.apm-hub-core {
    --hub-z: 260px;
    --hub-float: -84px;
    position: relative;
    z-index: 6;
    width: 144px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border: 1px solid rgba(179, 246, 255, .42);
    border-radius: 50%;
    background:
        linear-gradient(180deg, rgba(246, 255, 255, .16), rgba(246, 255, 255, 0) 18%),
        radial-gradient(circle, rgba(118, 224, 255, .2) 0 2px, transparent 3px),
        radial-gradient(circle at 50% 50%, rgba(255, 83, 160, .24), transparent 30%),
        radial-gradient(circle at 50% 46%, rgba(118, 224, 255, .26), transparent 48%),
        conic-gradient(from 90deg, rgba(118, 224, 255, .52), transparent 18%, rgba(255, 83, 160, .46), transparent 52%, rgba(118, 224, 255, .34), transparent),
        linear-gradient(180deg, rgba(6, 20, 35, .82), rgba(3, 8, 18, .94));
    box-shadow:
        0 28px 42px rgba(0, 0, 0, .42),
        0 0 34px rgba(80, 196, 255, .26),
        0 0 64px rgba(255, 83, 160, .14),
        inset 0 1px 0 rgba(255, 255, 255, .22),
        inset 0 -20px 38px rgba(2, 8, 18, .48),
        inset 0 0 34px rgba(116, 225, 255, .14);
    transform: translate3d(0, var(--hub-float), var(--hub-z)) rotateX(-58deg);
    transform-style: preserve-3d;
    animation: apm-hub-float 5.2s ease-in-out infinite;
    overflow: hidden;
    transition:
        border-color 420ms ease,
        box-shadow 520ms ease,
        transform 900ms cubic-bezier(.16, 1, .3, 1);
    will-change: transform;

    &::before,
    &::after {
        content: "";
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
    }

    &::before {
        inset: 13px;
        border: 1px dashed rgba(127, 236, 255, .36);
        animation: apm-core-drift 14s linear infinite reverse;
        transform: translateZ(22px);
    }

    &::after {
        inset: 34px;
        border: 1px solid rgba(255, 83, 160, .24);
        background: radial-gradient(circle, rgba(255, 83, 160, .2), transparent 62%);
        box-shadow:
            0 0 26px rgba(255, 83, 160, .18),
            inset 0 0 20px rgba(116, 225, 255, .1);
        transform: translateZ(30px);
    }
}

.apm-hub-core + .apm-cockpit__cards,
.apm-cockpit__cards + .apm-hub-core {
    pointer-events: none;
}

.apm-cockpit__deck::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 620px;
    height: 240px;
    border-radius: 50%;
    background:
        radial-gradient(ellipse at center, rgba(96, 231, 255, .12), transparent 56%),
        conic-gradient(from 180deg, transparent, rgba(96, 231, 255, .08), transparent 34%, rgba(255, 83, 160, .06), transparent 70%);
    filter: blur(18px);
    transform: translate3d(-50%, -22%, -82px) rotateX(4deg);
    opacity: .42;
    pointer-events: none;
    transition: transform 900ms cubic-bezier(.16, 1, .3, 1), opacity 520ms ease;
}

.apm-cockpit__deck::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 48%;
    z-index: 4;
    width: 220px;
    height: 78px;
    border: 1px solid rgba(116, 225, 255, .14);
    border-radius: 50%;
    background:
        radial-gradient(ellipse at center, rgba(118, 224, 255, .32), rgba(255, 83, 160, .11) 42%, transparent 72%),
        linear-gradient(90deg, transparent, rgba(246, 255, 255, .16), transparent);
    filter: blur(3px);
    opacity: .58;
    pointer-events: none;
    transform: translate3d(-50%, -72%, 116px) rotateX(-12deg);
    transition: transform 900ms cubic-bezier(.16, 1, .3, 1), opacity 520ms ease;
}

.apm-hub-core__ring {
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    animation: apm-core-drift 10s linear infinite;

    span {
        position: absolute;
        left: 50%;
        top: 0;
        width: 2px;
        height: 14px;
        border-radius: 999px;
        background: rgba(116, 225, 255, .78);
        box-shadow: 0 0 10px rgba(116, 225, 255, .48);
        transform-origin: 1px 52px;

        &:nth-child(2) {
            transform: rotate(120deg);
            background: rgba(255, 83, 160, .66);
        }

        &:nth-child(3) {
            transform: rotate(240deg);
        }
    }
}

.apm-hub-core__label {
    position: relative;
    z-index: 1;
    max-width: 92px;
    text-align: center;
    transform: translateZ(18px) rotateX(0deg);

    span {
        display: block;
        color: rgba(218, 246, 255, .56);
        font-size: 9px;
        letter-spacing: .1em;
    }

    strong {
        display: block;
        margin-top: 3px;
        color: #f4ffff;
        font-size: 13px;
        line-height: 1.15;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.apm-hud-card {
    --float-y: 0px;
    --spread-x: 0px;
    --spread-y: 0px;
    --spread-scale: .84;
    --spread-rotate: 10deg;
    --hover-rotate: 0deg;
    --spread-tilt-x: 16deg;
    --spread-z: 28px;
    --spread-shadow-x: 0px;
    position: absolute;
    left: 50%;
    top: 50%;
    width: clamp(150px, 21vw, 205px);
    min-width: 0;
    z-index: 3;
    display: grid;
    grid-template-columns: 32px 1fr;
    grid-template-rows: 1fr 8px;
    column-gap: 10px;
    row-gap: 8px;
    align-items: center;
    min-height: 68px;
    padding: 12px 12px 10px;
    border: 1px solid rgba(116, 225, 255, .26);
    border-radius: 10px;
    background:
        radial-gradient(circle at 78% 22%, rgba(255, 83, 160, .14), transparent 30%),
        repeating-linear-gradient(90deg, rgba(123, 235, 255, .04) 0 1px, transparent 1px 11px),
        linear-gradient(180deg, rgba(18, 35, 55, .74), rgba(3, 9, 20, .7)),
        radial-gradient(circle at 18% 0%, rgba(118, 224, 255, .16), transparent 40%),
        linear-gradient(90deg, transparent, rgba(96, 218, 255, .052), transparent);
    box-shadow:
        var(--spread-shadow-x) 22px 34px rgba(0, 0, 0, .34),
        0 0 20px rgba(80, 196, 255, .1),
        inset 0 1px 0 rgba(255, 255, 255, .08),
        inset 0 0 18px rgba(95, 190, 255, .055);
    transform: translate3d(calc(-50% + var(--spread-x)), calc(-50% + var(--float-y) + var(--spread-y)), var(--spread-z)) rotateX(var(--spread-tilt-x)) rotateY(var(--spread-rotate)) scale(var(--spread-scale));
    transform-style: preserve-3d;
    animation: apm-card-float 5.6s ease-in-out infinite;
    transform-origin: center bottom;
    transition:
        transform 900ms cubic-bezier(.16, 1, .3, 1),
        border-color 360ms ease,
        background 360ms ease,
        box-shadow 520ms ease,
        opacity 420ms ease;
    will-change: transform;
    pointer-events: auto;

    &::before {
        content: "";
        position: absolute;
        left: 22px;
        right: 22px;
        bottom: -34px;
        height: 48px;
        border-radius: 50%;
        background:
            radial-gradient(ellipse at center, rgba(91, 226, 255, .28), transparent 62%),
            linear-gradient(180deg, rgba(91, 226, 255, .14), transparent 72%);
        filter: blur(10px);
        transform: translateZ(-90px) rotateX(70deg);
        opacity: .7;
        transition: height 520ms ease, opacity 520ms ease, filter 520ms ease, transform 900ms cubic-bezier(.16, 1, .3, 1);
    }

    &::after {
        content: "";
        position: absolute;
        inset: 8px;
        border-top: 1px solid rgba(183, 245, 255, .2);
        border-bottom: 1px solid rgba(159, 100, 255, .12);
        background:
            linear-gradient(90deg, rgba(116, 225, 255, .12), transparent 32%, transparent 70%, rgba(255, 83, 160, .1)),
            radial-gradient(circle at 82% 44%, rgba(116, 225, 255, .2) 0 1px, transparent 2px);
        background-size: 100% 1px, 10px 10px;
        background-position: left 12px, right 4px top 5px;
        background-repeat: no-repeat, repeat;
        pointer-events: none;
        opacity: .7;
    }

    &:hover {
        animation-play-state: paused;
        z-index: 5;
        transform: translate3d(calc(-50% + var(--spread-x)), calc(-50% + var(--spread-y) - 14px), 228px) rotateX(-12deg) rotateY(var(--hover-rotate)) scale(1.08);
        border-color: rgba(116, 225, 255, .42);
        box-shadow:
            var(--spread-shadow-x) 24px 38px rgba(0, 0, 0, .38),
            0 0 30px rgba(80, 196, 255, .18),
            inset 0 0 18px rgba(95, 190, 255, .085);
        background:
            radial-gradient(circle at 78% 22%, rgba(255, 83, 160, .18), transparent 30%),
            repeating-linear-gradient(90deg, rgba(123, 235, 255, .05) 0 1px, transparent 1px 11px),
            linear-gradient(180deg, rgba(18, 38, 60, .78), rgba(4, 9, 20, .58)),
            radial-gradient(circle at 18% 0%, rgba(118, 224, 255, .22), transparent 42%),
            linear-gradient(90deg, transparent, rgba(96, 218, 255, .08), transparent);

        &::before {
            height: 62px;
            opacity: .94;
            filter: blur(12px);
            transform: translateZ(-110px) rotateX(68deg) scaleX(1.18);
        }
    }

    span,
    strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    span {
        color: rgba(218, 246, 255, .62);
        font-size: 11px;
        letter-spacing: 0;
    }

    strong {
        color: #f2ffff;
        font-size: 22px;
        font-weight: 750;
        line-height: 1.1;
    }
}

.apm-hud-card__icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(116, 225, 255, .24);
    border-radius: 8px;
    color: #72e7ff;
    background: rgba(6, 18, 32, .64);
    box-shadow: 0 0 16px rgba(80, 196, 255, .16);
    transform: translateZ(16px);
}

.apm-hud-card__meta {
    display: grid;
    gap: 2px;
    transform: translateZ(10px);
}

.apm-hud-card__signal {
    position: relative;
    grid-column: 1 / -1;
    height: 8px;
    border: 1px solid rgba(116, 225, 255, .14);
    border-radius: 999px;
    overflow: hidden;
    background: rgba(2, 8, 18, .42);
    transform: translateZ(8px);

    &::before,
    &::after {
        content: "";
        position: absolute;
        inset: 0;
    }

    &::before {
        width: 62%;
        border-radius: inherit;
        background: linear-gradient(90deg, rgba(88, 235, 255, .14), rgba(88, 235, 255, .82), rgba(255, 83, 160, .52));
        box-shadow: 0 0 12px rgba(88, 235, 255, .24);
    }

    &::after {
        background: repeating-linear-gradient(90deg, transparent 0 9px, rgba(4, 9, 20, .82) 9px 11px);
    }
}

.apm-hud-card--project {
    --spread-x: -220px;
    --spread-y: -106px;
    --spread-z: 104px;
    --spread-scale: .78;
    --spread-rotate: 34deg;
    --hover-rotate: 18deg;
    --spread-shadow-x: -6px;
    transition-delay: 0ms;
    animation-delay: -1.2s;
}

.apm-hud-card--folder {
    --spread-x: -186px;
    --spread-y: 94px;
    --spread-z: 82px;
    --spread-scale: .74;
    --float-y: -4px;
    --spread-rotate: 26deg;
    --hover-rotate: 12deg;
    --spread-shadow-x: -6px;
    transition-delay: 70ms;
    animation-delay: -2.6s;
}

.apm-hud-card--workspace {
    --spread-x: 186px;
    --spread-y: -106px;
    --spread-z: 82px;
    --spread-scale: .74;
    --float-y: -1px;
    --spread-rotate: -26deg;
    --hover-rotate: -12deg;
    --spread-shadow-x: 6px;
    transition-delay: 110ms;
    animation-delay: -3.8s;
}

.apm-hud-card--group {
    --spread-x: 220px;
    --spread-y: 94px;
    --spread-z: 104px;
    --spread-scale: .78;
    --float-y: -5px;
    --spread-rotate: -34deg;
    --hover-rotate: -18deg;
    --spread-shadow-x: 6px;
    transition-delay: 150ms;
    animation-delay: -.4s;
}

.apm-cockpit__rail {
    position: absolute;
    left: 50%;
    bottom: 13px;
    display: flex;
    gap: 11px;
    transform: translateX(-50%);
    z-index: 1;

    span {
        width: 46px;
        height: 3px;
        border-radius: 999px;
        background: linear-gradient(90deg, transparent, rgba(116, 225, 255, .58), transparent);
        box-shadow: 0 0 10px rgba(116, 225, 255, .24);

        &:nth-child(even) {
            background: linear-gradient(90deg, transparent, rgba(173, 105, 255, .48), transparent);
        }
    }
}

@keyframes apm-card-float {
    0%,
    100% {
        transform: translate3d(calc(-50% + var(--spread-x)), calc(-50% + var(--float-y) + var(--spread-y)), var(--spread-z)) rotateX(var(--spread-tilt-x)) rotateY(var(--spread-rotate)) scale(var(--spread-scale));
    }

    50% {
        transform: translate3d(calc(-50% + var(--spread-x)), calc(-50% + var(--float-y) + var(--spread-y) - 10px), calc(var(--spread-z) + 28px)) rotateX(calc(var(--spread-tilt-x) - 5deg)) rotateY(var(--spread-rotate)) scale(var(--spread-scale));
    }
}

@keyframes apm-hub-float {
    0%,
    100% {
        transform: translate3d(0, var(--hub-float), var(--hub-z)) rotateX(-58deg);
    }

    50% {
        transform: translate3d(0, calc(var(--hub-float) - 22px), calc(var(--hub-z) + 32px)) rotateX(-58deg);
    }
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

@keyframes apm-tick-blink {
    0%,
    100% {
        opacity: .24;
    }

    45% {
        opacity: .9;
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

@media (max-width: 860px) {
    .apm-cockpit {
        --cockpit-mobile-scale: .78;
        --cockpit-scale: var(--cockpit-mobile-scale);
        bottom: 18px;
        max-width: none;
        padding: 0;
    }

    .apm-cockpit__panel {
        min-height: 352px;
        padding: 40px 38px 30px;
    }

    .apm-cockpit__ornaments {
        opacity: .58;
    }

    .apm-cockpit__deck {
        height: 266px;
        display: grid;
        transform: translateZ(20px) rotateX(58deg);
    }

    .apm-cockpit__topline {
        top: 34px;
    }
}

@media (max-width: 760px) {
    .apm-cockpit {
        --cockpit-mobile-scale: .68;
    }
}

@media (max-width: 600px) {
    .apm-cockpit {
        --cockpit-mobile-scale: .54;
    }
}

@media (max-width: 480px) {
    .apm-cockpit {
        --cockpit-mobile-scale: .44;
    }
}

@media (max-width: 420px) {
    .apm-cockpit {
        --cockpit-mobile-scale: .38;
    }
}

@media (max-width: 360px) {
    .apm-cockpit {
        --cockpit-mobile-scale: .34;
    }
}
</style>
