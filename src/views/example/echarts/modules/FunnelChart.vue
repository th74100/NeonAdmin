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

const labels = ['点击', '访问', '咨询', '订单', '展示']
const getData = () => {
    const data = []
    for (let i = 0; i < labels.length; i++) {
        data.push({
            value: Math.floor(Math.random() * 100),
            name: labels[i],
        })
    }
    return data
}

const options = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
        {
            name: 'Funnel',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
            },
            emphasis: {
                label: {
                    fontSize: 20,
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
