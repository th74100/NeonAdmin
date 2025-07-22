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

const getData = () => {
    // 随机出一个数组，长度为7
    const data = []
    for (let i = 0; i < 22; i++) {
        data.push([
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 100),
        ])
    }
    return data
}
const options = {
    tooltip: {
        trigger: 'item',
    },
    xAxis: {},
    yAxis: {},
    series: [
        {
            symbolSize: 10,
            data: getData(),
            type: 'scatter',
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
