<template>
    <neon-charts
        ref="chart"
        :option="options"
        :options-update="{
            notMerge: true,
        }"
        height="300px" />
</template>

<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount } from 'vue'

const timer = ref(null)
const chart = shallowRef(null)

const options = {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
        {
            name: 'Pressure',
            type: 'gauge',
            progress: {
                show: true,
            },
            detail: {
                valueAnimation: true,
                formatter: '{value}',
                fontSize: 20,
            },
            data: [
                {
                    value: Math.round(Math.random() * 100),
                    name: '压力',
                },
            ],
        },
    ],
}

onMounted(() => {
    timer.value = setInterval(() => {
        chart.value.setOption({
            series: [
                {
                    data: [
                        {
                            value: Math.round(Math.random() * 100),
                            name: '压力',
                        },
                    ],
                },
            ],
        })
    }, 2000)
})

onBeforeUnmount(() => {
    clearInterval(timer.value)
})
</script>
