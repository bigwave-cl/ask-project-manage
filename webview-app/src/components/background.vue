<template>
    <div class="ask-project-manage-background" aria-hidden="true">
        <div class="ask-project-manage-background__aura"></div>
        <canvas ref="canvasRef" class="ask-project-manage-background__canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBackground } from "./useBackground";

defineOptions({
    name: "ProjectManageBackground",
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
useBackground(canvasRef);
</script>

<style lang="scss" scoped>
.ask-project-manage-background {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
}

.ask-project-manage-background__aura {
    position: absolute;
    z-index: 0;
    width: max(200%, 1500px);
    aspect-ratio: 1 / 1;
    left: 50%;
    top: 52%;
    border-radius: 50%;
    background:
        radial-gradient(circle at 20% 18%, color-mix(in srgb, var(--apm-mamas-new-bag) 48%, transparent), transparent 20%),
        radial-gradient(circle at 76% 26%, color-mix(in srgb, var(--apm-radio-silence) 52%, transparent), transparent 22%),
        radial-gradient(circle at 66% 72%, color-mix(in srgb, var(--apm-riviera) 28%, transparent), transparent 24%),
        radial-gradient(circle at 32% 78%, color-mix(in srgb, var(--apm-late-homework) 34%, transparent), transparent 28%),
        radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--apm-faded-letter) 16%, transparent), transparent 48%);
    filter: blur(36px) saturate(1.24);
    opacity: .22;
    mix-blend-mode: screen;
    will-change: transform;
    transform: translate(-50%, -50%) rotate(0deg);
    animation: background-aura-field 52s ease-in-out infinite;
}

.ask-project-manage-background__canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    opacity: 1;
    mix-blend-mode: normal;
}

@keyframes background-aura-field {
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
</style>
