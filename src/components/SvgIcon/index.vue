<template>
    <svg :style="{ width: `${width}${unit}`, height: `${height}${unit}` }">
        <use
            :xlink:href="prefix + name"
            :fill="color"></use>
    </svg>
</template>

<script setup lang="ts">
// 组件使用，图标需要放置@/icons文件夹下，图标名字需要跟name="图标名称"保持一致。
// <SvgIcon name="ne-home" width="30" height="30"/>
defineProps({
    // xlink:href属性值的前缀
    prefix: {
        type: String,
        default: '#icon-',
    },

    // svg矢量图的名字
    name: String,

    // svg图标的颜色
    color: {
        type: String,
        default: '',
    },

    // svg宽度
    width: {
        type: [String, Number],
        default: 16,
    },

    // svg高度
    height: {
        type: [String, Number],
        default: 16,
    },

    // 单位
    unit: {
        type: String,
        default: 'px',
    },
})
</script>
