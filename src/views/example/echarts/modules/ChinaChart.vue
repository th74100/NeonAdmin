<template>
    <neon-charts
        :option="options"
        height="600px" />
</template>

<script setup>
import { registerMap } from 'echarts/core'
import china from '@/map/china.json'

registerMap('china', china)
const options = {
    tooltip: {
        trigger: 'item',
    },
    visualMap: {
        // 视觉映射组件配置
        type: 'continuous', // 定义为连续型 visualMap
        show: true,
        bottom: '5%',
        left: '2%',
        text: ['高', '低'], // 两端的文本
        min: 0, // 指定 visualMapContinuous 组件的允许的最小值
        max: 100, // 指定 visualMapContinuous 组件的允许的最大值

        calculable: true, // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
    },
    geo: {
        type: 'map', // 系列列表。每个系列通过 type 决定自己的图表类型
        map: 'china', // 地图。china 为中国全国地图+右下角南海诸岛，china1 为中国全国地图
        name: '业务数据', // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列
        aspectScale: 0.75, // 用于 scale 地图的长宽比
        zoom: 1.8, // 地图缩放多少倍
        roam: true, // 允许缩放和平移
        top: '32%',
        label: {
            normal: {
                show: true,
                color: '#fff', // 图形的颜色
            },
            emphasis: {
                show: true,
                color: '#000',
            },
        },
        itemStyle: {
            normal: {
                areaColor: 'rgba(52, 66, 86, 1)',
                shadowBlur: 10,
                shadowColor: 'rgba(52, 66, 86, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.7)',
            },
            emphasis: {
                areaColor: '#F2D5AD',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                borderWidth: 1,
                borderColor: '#FE9502',
            },
        },
        select: {
            label: {
                fontWeight: 'bold',
                fontSize: 14,
                color: '#000',
            },
            itemStyle: {
                areaColor: '#ffcc00',
            },
        },
    },

    series: [
        {
            name: '业务数据',
            type: 'map',
            geoIndex: 0,
            data: [
                {
                    name: '北京市',
                    value: 20,
                },
                {
                    name: '青海省',
                    value: 40,
                },
                {
                    name: '甘肃省',
                    value: 20,
                },
                {
                    name: '四川省',
                    value: 80,
                },
                {
                    name: '江苏省',
                    value: 80,
                },
            ],
        },
    ],
}
</script>
