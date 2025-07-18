<template>
    <neon-container>
        <template #content>
            <div
                class="fx-between border border-default rounded-md p-6 bg-[var(--ne-card)]">
                <div class="flex items-center gap-5">
                    <el-avatar
                        :size="80"
                        :src="AvatarImage" />
                    <div class="fx-col">
                        <h1 class="text-md font-semibold">
                            早安, NeonAdmin, 开始您一天的工作吧！
                        </h1>
                        <span
                            class="mt-3 text-xs text-[var(--ne-muted-foreground)]">
                            今日晴，20℃ - 32℃！
                        </span>
                    </div>
                </div>
                <div class="fx-center gap-12">
                    <div class="fx-col gap-2 text-right">
                        <span class="text-sm text-[var(--ne-muted-foreground)]">
                            待办
                        </span>
                        <span class="text-2xl">2/10</span>
                    </div>
                    <div class="fx-col gap-2 text-right">
                        <span class="text-sm text-[var(--ne-muted-foreground)]">
                            项目
                        </span>
                        <span class="text-2xl">8</span>
                    </div>
                    <div class="fx-col gap-2 text-right">
                        <span class="text-sm text-[var(--ne-muted-foreground)]">
                            团队
                        </span>
                        <span class="text-2xl">300</span>
                    </div>
                </div>
            </div>
        </template>
    </neon-container>
</template>

<script setup>
import AvatarImage from '@/assets/images/admin_avatar.png'
</script>
