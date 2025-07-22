<template>
    <v-chart
        ref="chart"
        :option="option"
        :theme="CONFIG_THEME"
        :autoresize="autoresize"
        :style="{
            width: tool.isNumber(width) ? `${width}px` : width,
            height: tool.isNumber(height) ? `${height}px` : height,
        }"
        v-bind="$attrs" />
</template>

<script setup>
import { shallowRef } from 'vue'
import { tool } from '@/utils'
import CONFIG_THEME from './config-theme'
import VChart from 'vue-echarts'

defineProps({
    width: {
        type: [String, Number],
        default: '100%',
    },
    height: {
        type: [String, Number],
        default: '100%',
    },
    option: {
        type: Object,
        default: () => {},
    },
    autoresize: {
        type: Boolean,
        default: true,
    },
})

const chart = shallowRef(null)

defineExpose(
    new Proxy(
        {},
        {
            get: (target, key) => {
                if (key in target) {
                    return target[key]
                } else {
                    return chart.value?.[key]
                }
            },
            has: (target, key) => {
                return key in target || key in chart.value
            },
        },
    ),
)
</script>
