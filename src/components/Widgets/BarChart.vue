<template>
    <neon-charts
        :option="options"
        height="320px" />
</template>

<script setup>
const getData = () => {
    // 随机出一个数组，长度为12
    const data = []
    for (let i = 0; i < 12; i++) {
        data.push(Math.floor(Math.random() * 100))
    }
    return data
}

const options = {
    color: ['#5470C6'],
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        type: 'category',
        data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
        ],
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            data: getData(),
            type: 'bar',
        },
    ],
}
</script>
