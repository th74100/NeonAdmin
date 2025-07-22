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

const labels = ['DQ', 'TY', 'SS', 'QG', 'SY', 'DD']
const getData = () => {
    const data = []
    for (let i = 0; i < labels.length; i++) {
        for (let j = 0; j < 21; j++) {
            const n = (j + 1).toString()
            const time = '2015/11/' + n.padStart(2, '0')
            const value = Math.floor(Math.random() * 51)
            data.push([time, value, labels[i]])
        }
    }
    return data
}

const options = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: 'rgba(0,0,0,0.2)',
                width: 1,
                type: 'solid',
            },
        },
    },
    singleAxis: {
        top: 50,
        bottom: 50,
        axisTick: {},
        axisLabel: {},
        type: 'time',
        axisPointer: {
            animation: true,
            label: {
                show: true,
            },
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                opacity: 0.2,
            },
        },
    },
    series: [
        {
            type: 'themeRiver',
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.8)',
                },
            },
            data: getData(),
        },
    ],
}

onMounted(() => {
    timer.value = setInterval(() => {
        chart.value.setOption({
            series: [
                {
                    data: getData(),
                },
            ],
        })
    }, 2000)
})

onBeforeUnmount(() => {
    clearInterval(timer.value)
})
</script>
