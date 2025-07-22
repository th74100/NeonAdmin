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

const labels = ['视频广告', '联盟广告', '邮件营销', '搜索引擎', '直接访问']
const getData = () => {
    // 随机出一个数组，长度为7
    const data = []
    for (let i = 0; i < 5; i++) {
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
    },
    color: ['#F2637B', '#4E88F3', '#36CBCB', '#4ECB73', '#FBD437'],
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
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
