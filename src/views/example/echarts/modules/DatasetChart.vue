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

const labels = ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie']
const getSource = () => {
    const data = [['product', '2015', '2016', '2017']]
    for (let i = 0; i < labels.length; i++) {
        for (let j = 0; j < 3; j++) {
            data.push([
                labels[i],
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100),
            ])
        }
    }
    return data
}

const options = {
    legend: {},
    tooltip: {},
    dataset: {
        source: getSource(),
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
}

onMounted(() => {
    timer.value = setInterval(() => {
        chart.value.setOption({
            dataset: {
                source: getSource(),
            },
        })
    }, 2000)
})

onBeforeUnmount(() => {
    clearInterval(timer.value)
})
</script>
