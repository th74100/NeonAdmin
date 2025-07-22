<template>
    <neon-charts
        :option="options"
        height="300px" />
</template>

<script setup>
const options = {
    graphic: {
        elements: [
            {
                type: 'text',
                left: 'center',
                top: 'center',
                style: {
                    text: 'Vue NeonAdmin',
                    fontSize: 50,
                    fontWeight: 'bold',
                    lineDash: [0, 200],
                    lineDashOffset: 0,
                    fill: 'transparent',
                    stroke: '#006be6',
                    lineWidth: 1,
                },
                keyframeAnimation: {
                    duration: 3000,
                    loop: false,
                    keyframes: [
                        {
                            percent: 0.7,
                            style: {
                                fill: 'transparent',
                                lineDashOffset: 200,
                                lineDash: [200, 0],
                            },
                        },
                        {
                            // Stop for a while.
                            percent: 0.8,
                            style: {
                                fill: 'transparent',
                            },
                        },
                        {
                            percent: 1,
                            style: {
                                fill: '#006be6',
                            },
                        },
                    ],
                },
            },
        ],
    },
}
</script>
