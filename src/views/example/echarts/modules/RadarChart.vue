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

const values = [80, 70, 50, 61, 90]
const getData = () => {
    const data = [...values]
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)) // 随机索引
        ;[data[i], data[j]] = [data[j], data[i]] // 交换元素
    }
    return data
}

const options = {
    tooltip: {
        trigger: 'item',
    },
    radar: {
        // shape: 'circle',
        indicator: [
            { name: '销售', max: 100 },
            { name: '研发', max: 100 },
            { name: '管理', max: 100 },
            { name: '客服', max: 100 },
            { name: '信息技术', max: 100 },
        ],
    },
    series: {
        name: '预算',
        type: 'radar',
        tooltip: {
            trigger: 'item',
        },
        areaStyle: {
            opacity: 0.1,
        },
        data: [
            {
                value: values,
                name: '预算',
            },
        ],
    },
}

onMounted(() => {
    timer.value = setInterval(() => {
        chart.value.setOption({
            series: [
                {
                    data: [
                        {
                            value: getData(),
                            name: '预算',
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
