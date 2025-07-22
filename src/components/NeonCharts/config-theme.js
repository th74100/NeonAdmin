const CONFIG_THEME = {
    color: ['#4E88F3', '#13CE66', '#F2637B', '#FBD437', '#36CBCB', '#8D98B3'],
    grid: {
        left: '3%',
        right: '3%',
        bottom: '10',
        top: '40',
        containLabel: true,
    },
    legend: {
        textStyle: {
            color: '#999',
        },
        inactiveColor: 'rgba(128,128,128,0.4)',
    },
    categoryAxis: {
        axisLine: {
            show: true,
            lineStyle: {
                color: 'rgba(128,128,128,0.2)',
                width: 1,
            },
        },
        axisTick: {
            show: false,
            lineStyle: {
                color: '#333',
            },
        },
        axisLabel: {
            color: '#999',
        },
        splitLine: {
            show: false,
            lineStyle: {
                color: ['#eee'],
            },
        },
        splitArea: {
            show: false,
            areaStyle: {
                color: ['rgba(255,255,255,0.01)', 'rgba(0,0,0,0.01)'],
            },
        },
    },
    valueAxis: {
        axisLine: {
            show: false,
            lineStyle: {
                color: '#999',
            },
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: 'rgba(128,128,128,0.2)',
            },
        },
    },
}

export default CONFIG_THEME
