<template>
    <neon-container>
        <template #content>
            <div class="fx-col gap-4">
                <div
                    class="fx-between border border-default rounded-md p-6 bg-[var(--ne-card)]">
                    <div class="flex items-center gap-5">
                        <el-avatar
                            :size="80"
                            :src="user.avatar" />
                        <div class="fx-col">
                            <h1 class="text-md font-semibold">
                                {{ timeText }} 开始您一天的工作吧！
                            </h1>
                            <span
                                class="mt-3 text-xs text-[var(--ne-muted-foreground)]">
                                今日是 {{ timeNow }}
                            </span>
                        </div>
                    </div>
                    <div class="fx-center gap-12">
                        <div class="fx-col gap-2 text-right">
                            <span
                                class="text-sm text-[var(--ne-muted-foreground)]">
                                待审
                            </span>
                            <span class="text-2xl">2/10</span>
                        </div>
                        <div class="fx-col gap-2 text-right">
                            <span
                                class="text-sm text-[var(--ne-muted-foreground)]">
                                文章
                            </span>
                            <span class="text-2xl">8</span>
                        </div>
                        <div class="fx-col gap-2 text-right">
                            <span
                                class="text-sm text-[var(--ne-muted-foreground)]">
                                评论
                            </span>
                            <span class="text-2xl">300</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div
                        class="border border-default rounded-md bg-[var(--ne-card)]">
                        <div class="fx-col gap-y-1.5 p-6">
                            <h3 class="font-semibold tracking-tight text-xl">
                                用户量
                            </h3>
                        </div>
                        <div class="fx-between p-6 pt-0">
                            <span class="text-xl">2,000</span>
                            <el-icon :size="20">
                                <NeonUsers />
                            </el-icon>
                        </div>
                    </div>
                    <div
                        class="border border-default rounded-md bg-[var(--ne-card)]">
                        <div class="fx-col gap-y-1.5 p-6">
                            <h3 class="font-semibold tracking-tight text-xl">
                                访问量
                            </h3>
                        </div>
                        <div class="fx-between p-6 pt-0">
                            <span class="text-xl">2,000</span>
                            <el-icon>
                                <PieChart />
                            </el-icon>
                        </div>
                    </div>
                </div>

                <div
                    class="border border-default rounded-md p-6 bg-[var(--ne-card)]">
                    <div
                        class="inline-flex group p-1 rounded-lg text-sm bg-[var(--ne-accent)]">
                        <button
                            class="px-3 py-2 text-[var(--ne-muted-foreground)] rounded-md"
                            :class="{
                                'is-active bg-[var(--ne-background)]:active':
                                    activeTab === 1,
                            }"
                            @click="activeTab = 1">
                            流量趋势
                        </button>
                        <button
                            class="px-3 py-2 text-[var(--ne-muted-foreground)] rounded-md"
                            :class="{
                                'is-active bg-[var(--ne-background)]:active':
                                    activeTab === 2,
                            }"
                            @click="activeTab = 2">
                            月访问量
                        </button>
                    </div>
                    <WidgetsStackedChart v-if="activeTab === 1" />
                    <WidgetsBarChart v-else />
                </div>
            </div>
        </template>
    </neon-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useAuthStore from '@/stores/modules/auth'

const authStore = useAuthStore()

defineOptions({
    name: 'Dashboard',
})

const user = computed(() => authStore.getUserInfo)
const timeText = ref('')
const timeNow = ref('')

const timeFix = (name) => {
    const time = new Date()
    const hour = time.getHours()

    const timeText =
        hour < 9
            ? '早上好'
            : hour < 12
              ? '上午好'
              : hour < 14
                ? '中午好'
                : hour < 18
                  ? '下午好'
                  : hour < 20
                    ? '傍晚好'
                    : hour < 24
                      ? '晚上好'
                      : '已深夜'
    return `${timeText}, ${name}, `
}

const getSystemTime = () => {
    const time = new Date()
    const year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()
    let hour = time.getHours()
    let minute = time.getMinutes()
    let second = time.getSeconds()
    month = month < 10 ? `0${month}` : month
    day = day < 10 ? `0${day}` : day
    hour = hour < 10 ? `0${hour}` : hour
    minute = minute < 10 ? `0${minute}` : minute
    second = second < 10 ? `0${second}` : second
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
}

const activeTab = ref(1)

onMounted(() => {
    timeText.value = timeFix(user.value.username)
    timeNow.value = getSystemTime()

    setInterval(() => {
        timeNow.value = getSystemTime()
    }, 1000)
})
</script>
