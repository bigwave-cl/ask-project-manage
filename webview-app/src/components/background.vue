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
    animation: background-aura-field 52s ease-in-out infinite;
}

.ask-project-manage-background__canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    opacity: .58;
    filter: blur(.18px);
    mix-blend-mode: screen;
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
