<template>
    <v-dialog v-model="isOpen" max-width="760" persistent>
        <section class="apm-onboarding" aria-label="新手引导">
            <div class="apm-onboarding__halo" aria-hidden="true"></div>

            <header class="apm-onboarding__header">
                <div>
                    <span>First Flight</span>
                    <h2>欢迎来到灵枢控制台</h2>
                </div>
                <div class="apm-onboarding__counter">{{ currentIndex + 1 }} / {{ slides.length }}</div>
            </header>

            <div class="apm-onboarding__stage">
                <article
                    v-for="(slide, index) in slides"
                    :key="slide.key"
                    class="apm-onboarding-slide"
                    :class="{ 'apm-onboarding-slide--active': index === currentIndex }"
                    :aria-hidden="index !== currentIndex"
                >
                    <div class="apm-onboarding-slide__visual" :class="`apm-onboarding-slide__visual--${slide.key}`">
                        <v-icon :icon="slide.icon"></v-icon>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="apm-onboarding-slide__copy">
                        <h3>{{ slide.title }}</h3>
                        <p>{{ slide.description }}</p>
                        <button
                            v-if="slide.image"
                            class="apm-onboarding-thumb"
                            type="button"
                            aria-label="查看状态栏快捷入口大图"
                            @click="previewImage = slide.image"
                        >
                            <img :src="slide.image" alt="状态栏快捷入口位置示意图" draggable="false">
                            <span>
                                <v-icon icon="mdi-magnify-plus-outline"></v-icon>
                                点击查看大图
                            </span>
                        </button>
                    </div>
                </article>
            </div>

            <div class="apm-onboarding__dots" aria-label="引导进度">
                <button
                    v-for="(_, index) in slides"
                    :key="index"
                    type="button"
                    :class="{ 'apm-onboarding__dot--active': index === currentIndex }"
                    :aria-label="`查看第 ${index + 1} 页`"
                    @click="currentIndex = index"
                ></button>
            </div>

            <footer class="apm-onboarding__footer">
                <v-btn
                    variant="text"
                    prepend-icon="mdi-chevron-left"
                    :disabled="currentIndex === 0"
                    @click="currentIndex -= 1"
                >上一页</v-btn>
                <div>
                    <v-btn
                        v-if="currentIndex < slides.length - 1"
                        color="teal-accent-3"
                        variant="tonal"
                        append-icon="mdi-chevron-right"
                        @click="currentIndex += 1"
                    >下一页</v-btn>
                    <v-btn
                        v-else
                        color="teal-accent-3"
                        variant="tonal"
                        append-icon="mdi-check"
                        @click="finishGuide"
                    >我知道了</v-btn>
                </div>
            </footer>
        </section>
    </v-dialog>
    <v-dialog v-model="isPreviewOpen" max-width="980">
        <section class="apm-onboarding-preview" aria-label="状态栏快捷入口大图">
            <header>
                <span>Quick Toggle</span>
                <v-btn
                    icon="mdi-close"
                    variant="text"
                    aria-label="关闭大图"
                    @click="previewImage = ''"
                ></v-btn>
            </header>
            <img v-if="previewImage" :src="previewImage" alt="状态栏 Ask Project Manage 快捷入口大图" draggable="false">
        </section>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import statusbarGuideImage from "../assets/statusbar-guide.png";

defineOptions({
    name: "ProjectOnboardingGuide",
});

const isOpen = defineModel({ type: Boolean });
const emit = defineEmits<{
    finish: [];
}>();

const currentIndex = ref(0);
const previewImage = ref("");
const isPreviewOpen = computed({
    get: () => Boolean(previewImage.value),
    set: value => {
        if (!value) {
            previewImage.value = "";
        }
    },
});
const slides = [
    {
        key: "activation",
        icon: "mdi-rocket-launch-outline",
        title: "面板可以自动唤起，也可以保持安静",
        description: "默认会在打开项目后自动进入控制台。偏好设置里可以关闭它，之后项目启动时不会主动打开 Panel。",
    },
    {
        key: "statusbar",
        icon: "mdi-dock-bottom",
        title: "右下角有快捷入口",
        description: "状态栏右下角的 Ask Project Manage 可以快速打开或关闭面板，适合临时切换，不必每次打开命令面板。",
        image: statusbarGuideImage,
    },
    {
        key: "replay",
        icon: "mdi-compass-rose",
        title: "之后也能再次查看",
        description: "右上角设置按钮里保留了新手引导入口。看过一次后不会自动弹出，但你随时可以从设置里重新打开。",
    },
];

watch(isOpen, value => {
    if (value) {
        currentIndex.value = 0;
    }
});

const finishGuide = () => {
    emit("finish");
    isOpen.value = false;
};
</script>

<style lang="scss" scoped>
.apm-onboarding {
    position: relative;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 38%, transparent);
    border-radius: 22px 9px 22px 9px;
    background:
        radial-gradient(circle at 20% 4%, color-mix(in srgb, var(--apm-radio-silence) 20%, transparent), transparent 38%),
        radial-gradient(circle at 88% 90%, color-mix(in srgb, var(--apm-mamas-new-bag) 14%, transparent), transparent 42%),
        linear-gradient(180deg, rgba(11, 24, 31, .98), rgba(3, 8, 15, .98));
    box-shadow:
        0 30px 74px rgba(0, 0, 0, .62),
        0 0 42px color-mix(in srgb, var(--apm-radio-silence) 16%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .12);
    color: var(--apm-text-main);
}

.apm-onboarding__halo {
    position: absolute;
    inset: -34% -16% auto;
    height: 260px;
    pointer-events: none;
    background:
        radial-gradient(ellipse at 50% 78%, rgba(120, 240, 224, .2), transparent 42%),
        repeating-linear-gradient(90deg, rgba(255, 255, 255, .05) 0 1px, transparent 1px 30px);
    filter: blur(.4px);
    transform: perspective(540px) rotateX(62deg);
    opacity: .72;
}

.apm-onboarding__header,
.apm-onboarding__footer {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.apm-onboarding__header {
    padding: 26px 28px 18px;
    border-bottom: 1px solid color-mix(in srgb, var(--apm-radio-silence) 20%, transparent);

    span {
        display: block;
        margin-bottom: 5px;
        color: color-mix(in srgb, var(--apm-radio-silence) 72%, transparent);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .1em;
        text-transform: uppercase;
    }

    h2 {
        margin: 0;
        font-size: 26px;
        line-height: 1.2;
        letter-spacing: 0;
    }
}

.apm-onboarding__counter {
    min-width: 68px;
    padding: 8px 12px;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 26%, transparent);
    border-radius: 12px 6px 12px 6px;
    color: var(--apm-radio-silence);
    background: rgba(5, 14, 18, .62);
    text-align: center;
    font-weight: 800;
}

.apm-onboarding__stage {
    position: relative;
    z-index: 1;
    min-height: 286px;
    padding: 28px;
}

.apm-onboarding-slide {
    position: absolute;
    inset: 28px;
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 28px;
    align-items: center;
    opacity: 0;
    transform: translateX(22px) scale(.98);
    pointer-events: none;
    transition: opacity 220ms ease, transform 220ms ease;
}

.apm-onboarding-slide--active {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: auto;
}

.apm-onboarding-slide__visual {
    position: relative;
    min-height: 188px;
    display: grid;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--slide-accent, var(--apm-radio-silence)) 34%, transparent);
    border-radius: 50%;
    background:
        radial-gradient(circle at 50% 44%, color-mix(in srgb, var(--slide-accent, var(--apm-radio-silence)) 22%, transparent), transparent 38%),
        linear-gradient(180deg, rgba(255, 255, 255, .07), rgba(0, 0, 0, .08));
    box-shadow:
        0 18px 42px rgba(0, 0, 0, .32),
        0 0 28px color-mix(in srgb, var(--slide-accent, var(--apm-radio-silence)) 18%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .1);

    .v-icon {
        position: relative;
        z-index: 2;
        color: var(--slide-accent, var(--apm-radio-silence));
        font-size: 58px;
        filter: drop-shadow(0 0 18px currentColor);
    }

    span {
        position: absolute;
        border: 1px solid color-mix(in srgb, var(--slide-accent, var(--apm-radio-silence)) 36%, transparent);
        border-radius: 50%;
        animation: apm-onboarding-orbit 9s linear infinite;

        &:nth-of-type(1) {
            inset: 26px;
        }

        &:nth-of-type(2) {
            inset: 52px;
            animation-duration: 6s;
            animation-direction: reverse;
        }
    }
}

.apm-onboarding-slide__visual--activation {
    --slide-accent: var(--apm-radio-silence);
}

.apm-onboarding-slide__visual--statusbar {
    --slide-accent: var(--apm-mamas-new-bag);
}

.apm-onboarding-slide__visual--replay {
    --slide-accent: var(--apm-riviera);
}

.apm-onboarding-slide__copy {
    h3 {
        margin: 0 0 12px;
        font-size: 28px;
        line-height: 1.18;
        letter-spacing: 0;
    }

    p {
        max-width: 420px;
        margin: 0;
        color: color-mix(in srgb, var(--apm-faded-letter) 76%, transparent);
        font-size: 15px;
        line-height: 1.8;
    }
}

.apm-onboarding-thumb {
    position: relative;
    display: block;
    width: min(320px, 100%);
    margin-top: 14px;
    padding: 0;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--apm-mamas-new-bag) 36%, transparent);
    border-radius: 14px 7px 14px 7px;
    background: rgba(3, 8, 15, .72);
    box-shadow:
        0 16px 34px rgba(0, 0, 0, .32),
        0 0 22px color-mix(in srgb, var(--apm-mamas-new-bag) 12%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, .08);
    cursor: zoom-in;

    img {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 6;
        object-fit: cover;
        object-position: right bottom;
        opacity: .9;
        transition: transform 180ms ease, opacity 180ms ease;
    }

    span {
        position: absolute;
        right: 8px;
        bottom: 8px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 8px;
        border: 1px solid color-mix(in srgb, var(--apm-mamas-new-bag) 28%, transparent);
        border-radius: 999px;
        color: var(--apm-text-main);
        background: rgba(5, 8, 14, .78);
        box-shadow: 0 0 16px color-mix(in srgb, var(--apm-mamas-new-bag) 14%, transparent);
        font-size: 11px;
        line-height: 1;
        font-weight: 800;
    }

    &:hover img {
        transform: scale(1.035);
        opacity: 1;
    }
}

.apm-onboarding-preview {
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--apm-radio-silence) 34%, transparent);
    border-radius: 18px 8px 18px 8px;
    background:
        linear-gradient(180deg, rgba(11, 24, 31, .98), rgba(3, 8, 15, .98));
    box-shadow:
        0 28px 70px rgba(0, 0, 0, .64),
        0 0 34px color-mix(in srgb, var(--apm-radio-silence) 14%, transparent);

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px 12px 18px;
        border-bottom: 1px solid color-mix(in srgb, var(--apm-radio-silence) 20%, transparent);
        color: var(--apm-text-main);
    }

    header span {
        color: color-mix(in srgb, var(--apm-radio-silence) 78%, transparent);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .1em;
        text-transform: uppercase;
    }

    img {
        display: block;
        width: 100%;
        max-height: 72vh;
        object-fit: contain;
        background: rgba(0, 0, 0, .28);
    }
}

.apm-onboarding__dots {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: 9px;
    padding: 0 28px 18px;

    button {
        width: 28px;
        height: 6px;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--apm-faded-letter) 24%, transparent);
        cursor: pointer;
        transition: width 180ms ease, background 180ms ease, box-shadow 180ms ease;
    }

    .apm-onboarding__dot--active {
        width: 44px;
        background: var(--apm-radio-silence);
        box-shadow: 0 0 14px color-mix(in srgb, var(--apm-radio-silence) 42%, transparent);
    }
}

.apm-onboarding__footer {
    padding: 18px 28px 26px;
    border-top: 1px solid color-mix(in srgb, var(--apm-radio-silence) 18%, transparent);

    > div {
        display: flex;
        gap: 10px;
    }
}

@keyframes apm-onboarding-orbit {
    from {
        transform: rotate(0deg) scaleX(1.04);
    }
    to {
        transform: rotate(360deg) scaleX(1.04);
    }
}

@media (max-width: 720px) {
    .apm-onboarding-slide {
        grid-template-columns: 1fr;
        gap: 18px;
        align-content: center;
    }

    .apm-onboarding-slide__visual {
        min-height: 148px;
        max-width: 180px;
        width: 180px;
        justify-self: center;
    }

    .apm-onboarding-slide__copy {
        text-align: center;

        p {
            max-width: none;
        }
    }

    .apm-onboarding-thumb {
        margin-inline: auto;
    }
}
</style>
