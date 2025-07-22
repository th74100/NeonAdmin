<template>
    <neon-charts
        ref="chart"
        :option="options"
        height="300px" />
</template>

<script setup>
import { shallowRef, ref, onMounted, onBeforeUnmount } from 'vue'
const timer = ref(null)
const chart = shallowRef(null)

const random = () => Math.floor(Math.random() * 1000)

const getData = () => {
    return [
        {
            children: [
                {
                    value: random(),
                    children: [
                        { value: random() },
                        {
                            value: random(),
                            children: [{ value: random() }],
                        },
                        { value: random() },
                    ],
                },
                {
                    value: random(),
                    children: [{ value: random() }, { value: random() }],
                },
            ],
        },
        {
            children: [
                {
                    children: [
                        { value: random(), children: [{ value: random() }] },
                        { value: random() },
                    ],
                },
            ],
        },
        {
            children: [
                {
                    children: [
                        { value: random() },
                        { value: random() },
                        { value: random() },
                    ],
                },
            ],
        },
        {
            children: [
                {
                    children: [
                        { value: random() },
                        { value: random() },
                        { value: random() },
                    ],
                },
            ],
        },
    ]
}
const options = {
    tooltip: {
        trigger: 'item',
    },
    series: [
        {
            radius: [30, '90%'],
            type: 'sunburst',
            itemStyle: {
                borderRadius: 6,
                borderWidth: 1,
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
