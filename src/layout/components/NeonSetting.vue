<template>
    <div class="fx-col py-3">
        <h3 class="mb-3 font-semibold tracking-tight">布局</h3>
        <div class="flex w-full flex-wrap gap-5">
            <div
                v-for="(item, index) in layouts"
                :key="index"
                class="flex w-[100px] h-[100px] cursor-pointer flex-col"
                @click="handleChangeLayout(item.value)">
                <div
                    class="h-[75px] border-2 rounded-md p-1"
                    :class="
                        item.value === globalStore.layout
                            ? 'border-primary'
                            : 'border-default'
                    ">
                    <component :is="item.component" />
                </div>
                <div
                    class="mt-2 text-center text-xs text-[var(--ne-foreground)] hover:text-black transition-all">
                    {{ item.label }}
                </div>
            </div>
        </div>
    </div>
    <div class="fx-col py-3">
        <h3 class="mb-3 font-semibold tracking-tight">主题</h3>
        <div
            class="fx-between gap-[5px] py-1 px-2 mx-1 leading-7 text-sm rounded-md hover:bg-[var(--ne-accent)] transition-all">
            <span>深色侧边栏</span>
            <el-switch
                v-model="darkSlide"
                @change="handleChangeSlide" />
        </div>
    </div>
    <div class="fx-col py-3">
        <h3 class="mb-3 font-semibold tracking-tight">内置主题</h3>
        <div class="grid grid-cols-3 gap-[10px]">
            <div
                v-for="(item, index) in colors"
                :key="index"
                class="fx-col cursor-pointer"
                @click="handleChangeColor(item.color)">
                <div
                    class="fx-center p-1 border border-2 hover:border-[var(--ne-primary)] rounded-md"
                    :class="
                        globalStore.colorPrimary === item.color
                            ? 'border-primary'
                            : 'border-default'
                    ">
                    <div
                        class="p-2 my-2 size-5 rounded-md"
                        :style="{
                            background: item.color,
                        }"></div>
                </div>
                <div class="my-2 text-center text-xs">{{ item.label }}</div>
            </div>
            <div class="fx-col cursor-pointer">
                <div
                    class="fx-center p-1 border border-2 hover:border-[var(--ne-primary)] rounded-md"
                    :class="
                        isCustomActive ? 'border-primary' : 'border-default'
                    ">
                    <div class="size-full px-10 py-2">
                        <div class="flex-center relative size-5 rounded-sm">
                            <neon-customize class="size-5" />
                            <div
                                class="absolute inset-0 opacity-0 cursor-pointer">
                                <el-color-picker
                                    v-model="colorValue"
                                    :predefine="[
                                        '#ff4500',
                                        '#ff8c00',
                                        '#ffd700',
                                        '#90ee90',
                                        '#00ced1',
                                        '#1e90ff',
                                        '#c71585',
                                        '#FF4500',
                                        '#409eff',
                                    ]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="my-2 text-center text-xs">自定义</div>
            </div>
        </div>
    </div>
    <div class="fx-col py-3">
        <h3 class="mb-3 font-semibold tracking-tight">动画</h3>
        <div
            class="fx-between gap-[5px] py-1 px-2 mx-1 leading-7 text-sm rounded-md hover:bg-[var(--ne-accent)] transition-all">
            <span>页面切换动画</span>
            <el-select
                v-model="transition"
                @change="handleChangeTransition"
                style="width: 150px">
                <el-option
                    label="淡出滑动"
                    value="fade-slide" />
                <el-option
                    label="淡入淡出"
                    value="fade" />
                <el-option
                    label="向下淡出"
                    value="fade-down" />
                <el-option
                    label="淡出缩放"
                    value="fade-scale" />
            </el-select>
        </div>
    </div>
    <div class="fx-col py-3">
        <h3 class="mb-3 font-semibold tracking-tight">其它</h3>
        <div
            class="fx-between gap-[5px] py-1 px-2 mx-1 leading-7 text-sm rounded-md hover:bg-[var(--ne-accent)] transition-all">
            <span>色弱模式</span>
            <el-switch
                v-model="invertMode"
                @change="handleInvertMode" />
        </div>
        <div
            class="fx-between gap-[5px] py-1 px-2 mx-1 leading-7 text-sm rounded-md hover:bg-[var(--ne-accent)] transition-all">
            <span>灰色模式</span>
            <el-switch
                v-model="grayMode"
                @change="handleGrayMode" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import useGlobalStore from '@/stores/modules/global'
import DefaultImage from '@/assets/layout/default'
import VerticalImage from '@/assets/layout/vertical'

const { reload } = inject('reload')
const globalStore = useGlobalStore()

const colors = computed(() => globalStore.predefineColors)

const colorValue = ref(globalStore.colorPrimary)
const isCustomActive = computed(() => {
    return colors.value.every((item) => item.color !== colorValue.value)
})

/** layout */
const layouts = [
    {
        label: '默认',
        value: 'default',
        component: DefaultImage,
    },
    {
        label: '垂直',
        value: 'vertical',
        component: VerticalImage,
    },
]

const handleChangeLayout = (value) => {
    globalStore.set('layout', value)
}

/** 切换主题色 */
const handleChangeColor = (color) => {
    colorValue.value = color
    globalStore.theme(color)
}

watch(colorValue, (val) => globalStore.theme(val))

/** 浅色侧边栏 */
const darkSlide = ref(globalStore.darkSlide)
const handleChangeSlide = (val) => {
    globalStore.set('darkSlide', val)
}

/** 动画 */
const transition = ref(globalStore.transition)
const handleChangeTransition = (val) => {
    globalStore.set('transition', val)
    reload()
}

/** 色弱模式 */
const invertMode = ref(globalStore.invertMode)
const handleInvertMode = (val) => {
    const el = document.documentElement
    globalStore.set('invertMode', val)
    if (val) {
        el.classList.add('invert')
    } else {
        el.classList.remove('invert')
    }
}

/** 灰色模式 */
const grayMode = ref(globalStore.grayMode)
const handleGrayMode = (val) => {
    const el = document.documentElement
    globalStore.set('grayMode', val)
    console.log(val)
    if (val) {
        el.classList.add('grayscale')
    } else {
        el.classList.remove('grayscale')
    }
}
</script>
