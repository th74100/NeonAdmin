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

const getDayAll = (starDay, endDay) => {
    var arr = []
    var dates = []

    // 设置两个日期UTC时间
    var db = new Date(starDay)
    var de = new Date(endDay)

    // 获取两个日期GTM时间
    var s = db.getTime() - 24 * 60 * 60 * 1000
    var d = de.getTime() - 24 * 60 * 60 * 1000

    // 获取到两个日期之间的每一天的毫秒数
    for (var i = s; i <= d; ) {
        i = i + 24 * 60 * 60 * 1000
        arr.push(parseInt(i))
    }

    // 获取每一天的时间  YY-MM-DD
    for (var j in arr) {
        var time = new Date(arr[j])
        var year = time.getFullYear(time)
        var mouth =
            time.getMonth() + 1 >= 10
                ? time.getMonth() + 1
                : '0' + (time.getMonth() + 1)
        var day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
        // year + '-' +
        var YYMMDD = year + '-' + mouth + '-' + day
        dates.push(YYMMDD)
    }
    dates.pop()
    return dates
}

const getPreSevenDate = () => {
    var end = new Date()
    var year = end.getFullYear()
    var month = end.getMonth() + 1 //0-11表示1-12月
    var day = end.getDate()
    var dateObj = {}
    dateObj.end = year + '-' + month + '-' + day
    if (day - 7 <= 0) {
        //如果在当月7日之前
        var startMonthDay = new Date(year, parseInt(month) - 1, 0).getDate()
        //1周前所在月的总天数
        if (month - 1 <= 0) {
            //如果在当年的1月份
            dateObj.start = year - 1 + '-' + 12 + '-' + (31 - (7 - day))
        } else {
            dateObj.start =
                year + '-' + (month - 1) + '-' + (startMonthDay - (7 - day))
        }
    } else {
        dateObj.start = year + '-' + month + '-' + (day - 7)
    }

    return dateObj
}

const day = getPreSevenDate()
const days = getDayAll(day.start, day.end)
const getData = () => {
    const data = []
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < 6; j++) {
            data.push([
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100),
            ])
        }
    }
    return data
}

const options = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false,
            type: 'cross',
        },
    },
    xAxis: {
        data: days,
    },
    yAxis: {},
    series: [
        {
            type: 'candlestick',
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
