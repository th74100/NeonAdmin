<template>
    <neon-charts
        ref="chart"
        :option="options"
        width="100%"
        height="320px" />
</template>

<script setup>
const options = {
    color: ['#019680', '#5AB1EF'],
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '1%',
        right: '1%',
        bottom: '0%',
        containLabel: true,
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: [
                '6:00',
                '7:00',
                '8:00',
                '9:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00',
            ],
        },
    ],
    yAxis: [
        {
            type: 'value',
        },
    ],
    series: [
        {
            type: 'line',
            smooth: true,
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series',
            },
            data: [
                1200, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230,
                210, 132, 230, 210, 101,
            ],
        },
        {
            type: 'line',
            smooth: true,
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series',
            },
            data: [
                220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330,
                310, 182, 290, 234, 182,
            ],
        },
    ],
}
</script>
