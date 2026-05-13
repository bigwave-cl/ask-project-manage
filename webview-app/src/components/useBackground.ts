import { onMounted, onUnmounted, Ref } from "vue";

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

export const useBackground = (canvasRef: Ref<HTMLCanvasElement | null>) => {
    let animationFrameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let lastFrameTime = 0;
    let animationTime = 0;

    const resetAnimationClock = () => {
        lastFrameTime = 0;
    };
    const handleVisibilityChange = () => {
        resetAnimationClock();
    };
    const drawBackground = (time = 0) => {
        if (document.hidden) {
            lastFrameTime = time;
            animationFrameId = window.requestAnimationFrame(drawBackground);
            return;
        }
        if (!lastFrameTime) {
            lastFrameTime = time;
        }
        const delta = Math.min(50, Math.max(0, time - lastFrameTime));
        lastFrameTime = time;
        animationTime += delta;
        const canvas = canvasRef.value;
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

        animationFrameId = window.requestAnimationFrame(drawBackground);
    };

    onMounted(() => {
        const canvas = canvasRef.value;
        if (canvas?.parentElement) {
            resizeObserver = new ResizeObserver(() => {
                drawBackground();
            });
            resizeObserver.observe(canvas.parentElement);
        }
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", resetAnimationClock);
        animationFrameId = window.requestAnimationFrame(drawBackground);
    });
    onUnmounted(() => {
        resizeObserver?.disconnect();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("focus", resetAnimationClock);
        window.cancelAnimationFrame(animationFrameId);
    });

    return {
        drawBackground,
    };
};
