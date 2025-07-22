<template>
    <neon-container>
        <el-scrollbar>
            <el-alert
                type="error"
                style="margin-bottom: 20px">
                <template #title>
                    扩展了Element
                    Plus图标库，可以在@/components/NeonIcons中新增自己的SVG图标组件，建议前往Iconify复制SVG代码
                    <a
                        href="https://icones.js.org/"
                        target="_blank">
                        https://icones.js.org/
                    </a>
                </template>
            </el-alert>
            <el-row
                :gutter="0"
                class="border-t border-l border-default">
                <el-col
                    :sm="8"
                    :md="4"
                    v-for="(icon, index) in icons"
                    :key="index"
                    @click="handleCopy(icon)"
                    class="py-[30px] px-[10px] border-r border-b border-default text-center hover:bg-[var(--ne-background-deep)] transition-all cursor-pointer">
                    <el-icon :size="20">
                        <component :is="icon" />
                    </el-icon>
                    <p class="mt-[10px] text-gray-400 text-sm">{{ icon }}</p>
                </el-col>
            </el-row>
        </el-scrollbar>
    </neon-container>
</template>

<script setup>
import { shallowRef } from 'vue'
import useClipboard from 'vue-clipboard3'
import { $message } from '@/utils'
import neonIcons from '@/components/NeonIcons'

defineOptions({
    name: 'Iconfont',
})

const { toClipboard } = useClipboard()

const icons = shallowRef([])
for (const icon in neonIcons) {
    const name = icon.replace(/([A-Z])/g, (match) => '-' + match.toLowerCase())
    icons.value.push(`neon` + name)
}

const handleCopy = async (icon) => {
    const iconName = icon.replace(/(?:^|-)([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
    )
    try {
        await toClipboard(`<el-icon><${iconName}/></el-icon>`)
        $message.success('已复制！')
    } catch (error) {
        $message.error(`复制失败！${error}`)
    }
}
</script>
