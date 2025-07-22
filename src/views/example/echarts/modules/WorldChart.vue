<template>
    <neon-charts
        :option="options"
        height="600px" />
</template>

<script setup>
import { registerMap } from 'echarts/core'
import world from '@/map/world.json'

registerMap('world', world)
const options = {
    tooltip: {
        trigger: 'item',
    },
    geo: {
        type: 'map', // 系列列表。每个系列通过 type 决定自己的图表类型
        map: 'world', // 地图。china 为中国全国地图+右下角南海诸岛，china1 为中国全国地图
        aspectScale: 0.75, // 用于 scale 地图的长宽比
        zoom: 1, // 地图缩放多少倍
        roam: true, // 允许缩放和平移
    },
}
</script>
