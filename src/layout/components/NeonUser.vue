<template>
    <button
        class="neon-button is-circle mr-1"
        @click="handleSetting">
        <el-icon :size="16">
            <Setting />
        </el-icon>
    </button>
    <button
        class="neon-button is-circle mr-1"
        @click="handleDark">
        <el-icon :size="16">
            <Moon v-if="!isDark" />
            <Sunny v-else />
        </el-icon>
    </button>
    <button
        class="neon-button is-circle mr-1"
        @click="handleFullScreen">
        <el-icon :size="16">
            <NeonMaximize v-if="!isFullscreen" />
            <NeonMinimize v-else />
        </el-icon>
    </button>
    <button class="bell-button neon-button is-circle">
        <el-popover
            trigger="click"
            :popper-style="{
                padding: '0',
                width: '360px',
            }">
            <template #reference>
                <el-icon :size="16">
                    <NeonBell />
                </el-icon>
            </template>
            <div class="fx-col">
                <div class="fx-between p-3 border-b border-default">
                    <span class="text-md">通知</span>
                    <button class="neon-button is-circle">
                        <el-tooltip
                            content="全部标记为已读"
                            placement="bottom">
                            <el-icon :size="18">
                                <Notification />
                            </el-icon>
                        </el-tooltip>
                    </button>
                </div>
                <div class="flex-1">
                    <el-scrollbar :max-height="387">
                        <ul
                            v-for="i in 5"
                            :key="i"
                            class="fx-col">
                            <li
                                class="relative flex gap-5 p-3 hover:bg-[var(--ne-accent)] cursor-pointer"
                                :class="[
                                    i > 1 && i <= 5
                                        ? 'border-t border-default'
                                        : '',
                                ]">
                                <span
                                    class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                    <img
                                        src="https://avatar.vercel.sh/vercel.svg?text=VC" />
                                </span>
                                <div class="flex flex-col gap-1 leading-none">
                                    <p class="my-1 text-md font-semibold">
                                        收到了 14 份新周报{{ i }}
                                    </p>
                                    <p
                                        class="my-1 line-clamp-2 text-xs text-[var(--ne-muted-foreground)]">
                                        描述信息描述信息描述信息
                                    </p>
                                    <p
                                        class="my-1 line-clamp-2 text-xs text-[var(--ne-muted-foreground)]">
                                        3小时前
                                    </p>
                                </div>
                                <span
                                    v-if="i > 1"
                                    class="absolute block top-[10px] right-[10px] w-[8px] h-[8px] rounded-full bg-[var(--el-color-primary)]"></span>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
                <div class="fx-between p-3 border-t border-default">
                    <button class="neon-button !px-5 text-xs">清空</button>
                    <el-button
                        type="primary"
                        size="small">
                        查看所有消息
                    </el-button>
                </div>
            </div>
        </el-popover>
        <span
            class="absolute block top-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-[var(--el-color-primary)]"></span>
    </button>
    <div
        class="relative inline-flex ml-4 cursor-pointer rounded-full p-1.2 transition-colors">
        <span
            class="absolute bottom-[2px] right-[2px] size-3 rounded-full border-2 border-white bg-green-500"></span>
        <el-popover
            :popper-style="{
                padding: '0',
                width: '200px',
            }">
            <template #reference>
                <el-avatar
                    :size="30"
                    :src="NeonAvatar" />
            </template>
            <div class="fx-start py-3 px-3">
                <div class="relative w-[48px] h-[48px]">
                    <el-avatar
                        :size="48"
                        :src="NeonAvatar" />
                    <span
                        class="absolute bottom-[2px] right-[2px] size-3 rounded-full border-2 border-white bg-green-500"></span>
                </div>
                <div class="fx-col gap-1 ml-2">
                    <span class="font-semibold">
                        {{ user.username }}
                    </span>
                    <span class="text-xs text-[var(--ne-muted-foreground)]">
                        {{ user.email }}
                    </span>
                </div>
            </div>
            <div class="border-t border-default my-1"></div>
            <div
                class="fx-start gap-[5px] py-1 px-2 mx-1 leading-7 rounded-md hover:bg-[var(--ne-accent)] transition-all cursor-pointer">
                <el-icon>
                    <NeonAccount />
                </el-icon>
                <span>账号信息</span>
            </div>
            <div
                class="fx-start gap-[5px] py-1 px-2 mx-1 mb-1 leading-7 rounded-md hover:bg-[var(--ne-accent)] transition-all cursor-pointer"
                @click="clearLocal">
                <el-icon>
                    <NeonBorderClear />
                </el-icon>
                <span>清除缓存</span>
            </div>
            <div class="border-t border-default my-1"></div>
            <div
                class="fx-start gap-[5px] py-1 px-2 mx-1 mb-1 leading-7 rounded-md hover:bg-[var(--ne-accent)] transition-all cursor-pointer"
                @click="loginOut">
                <el-icon>
                    <NeonOut />
                </el-icon>
                <span>退出登录</span>
            </div>
        </el-popover>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { $msgbox, tool } from '@/utils'
import { LOGIN_PATH } from '@/config'
import renderDialog from '@/utils/renderDialog'
import useGlobalStore from '@/stores/modules/global'
import useUserStore from '@/stores/modules/user'
import useAuthStore from '@/stores/modules/auth'
import NeonSetting from '@/layout/components/NeonSetting.vue'
import NeonAvatar from '@/assets/images/admin_avatar.png'

const router = useRouter()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const user = computed(() => authStore.getUserInfo)
const isDark = computed(() => globalStore.getDarkMode)

const isFullscreen = ref(false)
const handleFullScreen = () => {
    const el = document.documentElement
    tool.screen(el)
}

const handleSetting = () => {
    renderDialog(NeonSetting, {
        title: '偏好设置',
        size: '380px',
        useDrawer: true,
        showConfirmButton: false,
        showCancelButton: false,
    })
}

const handleDark = (e) => {
    const el = document.documentElement

    // 如果浏览器不支持 View Transition，则直接切换暗黑模式
    if (!document.startViewTransition) {
        el.classList.toggle('dark')
        globalStore.set('darkMode', !isDark.value)
        return
    }

    // 使用 View Transition 切换暗黑模式
    const transition = document.startViewTransition(() => {
        el.classList.toggle('dark')
    })

    // transition.ready 的 Promise 完成后，执行自定义动画
    transition.ready.then(() => {
        const { clientX, clientY } = e

        // 计算鼠标位置相对于窗口的半径
        const radius = Math.hypot(
            Math.max(clientX, window.innerWidth - clientX),
            Math.max(clientY, window.innerHeight - clientY),
        )

        const clipPath = [
            `circle(0% at ${clientX}px ${clientY}px)`,
            `circle(${radius}px at ${clientX}px ${clientY}px)`,
        ]
        const isDark = el.classList.contains('dark')

        el.animate(
            {
                clipPath: isDark ? clipPath.reverse() : clipPath,
            },
            {
                duration: 500,
                pseudoElement: isDark
                    ? '::view-transition-old(root)'
                    : '::view-transition-new(root)',
            },
        )

        globalStore.set('darkMode', isDark)

        tool.initTheme(globalStore, false)
    })
}

const loginOut = () => {
    $msgbox.confirm('是否退出登录？', {
        onConfirm: () => {
            tool.local.remove('USER')
            userStore.clearToken()
            tool.setTitle('登录')
            router.replace(LOGIN_PATH)
        },
    })
}

const clearLocal = () => {
    $msgbox.confirm(
        '清除缓存会将系统初始化，包括登录状态、主题设置等，是否继续？',
        {
            onConfirm: () => {
                tool.local.clear()
                userStore.clearToken()
                tool.setTitle('登录')
                router.replace(LOGIN_PATH)
            },
        },
    )
}
</script>
