<template>
    <svg :style="{ width, height }">
        <use
            :xlink:href="prefix + name"
            :fill="color"></use>
    </svg>
</template>

<script setup lang="ts">
// 组件使用，图标需要放置@/icons文件夹下，图标名字需要跟name="图标名称"保持一致。
// <NeonSvg name="ne-home" width="30px" height="30px"/>
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
        type: String,
        default: '16px',
    },

    // svg高度
    height: {
        type: String,
        default: '16px',
    },
})
</script>
