<template>
    <div class="wh-full">
        <div class="login-layout">
            <div class="login-side fx-center flex-col">
                <div class="el-image w-[400px] h-[360px] mb-15 animate-float">
                    <img
                        src="@/assets/images/login.png"
                        class="el-image__inner" />
                </div>
                <div class="relative z-10">
                    <h1>欢迎登录 {{ APP_TITLE }} 管理平台</h1>
                </div>
                <div class="points-wrapper">
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                    <i class="point"></i>
                </div>
            </div>
            <div class="login-main fx-center">
                <div class="fx-col gap-[15px] w-full max-w-[500px]">
                    <el-divider class="bg-default is-primary">
                        NeonAdmin 管理平台
                    </el-divider>
                    <base-form>
                        <template #buttons>
                            <el-button
                                type="primary"
                                :loading="isLoading"
                                native-type="submit"
                                class="mt-5 w-full">
                                登录
                            </el-button>
                        </template>
                    </base-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useRef, useNeonForm } from '@/hooks'
import { $message, tool } from '@/utils'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import useUserStore from '@/stores/modules/user'
import { HOME_PATH } from '@/config'
import { userLogin } from '@/api'

defineOptions({
    name: 'LoginIndex',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const APP_TITLE = import.meta.env.VITE_APP_TITLE

/** 表单配置 */
const [formData] = useRef({
    username: '',
    password: '',
})

const schema = [
    {
        key: 'username',
        placeholder: '请输入用户名',
        clearable: true,
        rules: [
            {
                required: true,
                message: '请输入用户名',
                trigger: ['blur', 'change'],
            },
        ],
    },
    {
        key: 'password',
        props: {
            type: 'password',
            placeholder: '请输入密码',
            showPassword: true,
        },
        rules: [
            {
                required: true,
                message: '请输入密码',
                trigger: ['blur', 'change'],
            },
        ],
    },
]

const { state, execute } = useAsyncState(
    (args) => userLogin(args),
    {},
    { immediate: false },
)

const [BaseForm, formApi] = useNeonForm({
    modelValue: formData,
    schema,
    commonConfig: {
        size: 'large',
        resetButtonOptions: {
            show: false,
        },
    },
    onSubmit: (data) => handleSubmit(data),
})

const isLoading = ref(false)
const handleSubmit = async (formData) => {
    try {
        await formApi.validate()

        isLoading.value = true

        const { username, password } = formData
        await execute(0, {
            username,
            password: tool.crypto.MD5(password),
        })

        if (state.value.code != 200) {
            isLoading.value = false
            return
        }

        const { token = '' } = state.value
        userStore.setToken(token)
        if (userStore.token) {
            const query = route.query
            await initDynamicRouter()
            if (query?.redirect) {
                router.push(decodeURIComponent(query.redirect))
            } else {
                router.push(HOME_PATH)
            }
        }
    } catch (error) {
        $message.error(`登录失败:${error}`)
    }
}
</script>

<style lang="scss" scoped>
.login-layout {
    @apply flex h-full;

    .login-side {
        @apply flex-1 relative bg-gradient-to-b from-indigo-500 dark:from-black from-10% to-[var(--ne-primary)] dark:to-black before:content-[''] before:absolute before:inset-0 before:blur-[100px];
        &::before {
            background: linear-gradient(
                155deg,
                rgb(7 7 9 / 8%) 30%,
                rgb(0 107 230 / 20%) 48%,
                rgb(7 7 9 / 8%) 64%
            );
        }

        h1 {
            @apply text-white text-3xl;
        }
    }

    .login-main {
        @apply w-[40%] px-6 lg:px8 lg:flex-initial;
    }

    .points-wrapper {
        --border: 4px;
        --rounded: 16px;
        --w-card: 100%;
        --h-card: 300px;
        @apply absolute w-[calc(100%_-_(var(--border)_*_4))] h-[calc(100%_-_(var(--border)_*_4))] rounded-[calc(var(--rounded)_-_4px)] pointer-events-none z-[80] overflow-hidden;

        .point {
            --sz-point: 4px;
            @apply absolute top-[-8px] w-[var(--sz-point)] h-[var(--sz-point)] rounded-full animate-[floating-points_ease-in-out_infinite] bg-[#5ddcff] dark:bg-[#787979] pointer-events-none;

            &:nth-child(1) {
                @apply left-[10%] animate-duration-[2.35s] animate-delay-[0.2s] opacity-100;
            }

            &:nth-child(2) {
                @apply left-[30%] animate-duration-[2.5s] animate-delay-[0.5s] opacity-70;
            }

            &:nth-child(3) {
                @apply left-[25%] animate-duration-[2.2s] animate-delay-[0.1s] opacity-80;
            }

            &:nth-child(4) {
                @apply left-[44%] animate-duration-[2.05] opacity-60;
            }

            &:nth-child(5) {
                @apply left-[50%] animate-duration-[1.9s] opacity-100;
            }

            &:nth-child(6) {
                @apply left-[75%] animate-duration-[1.5s] animate-delay-[1.5s] opacity-50;
            }

            &:nth-child(7) {
                @apply left-[88%] animate-duration-[2.2s] animate-delay-[0.2s] opacity-90;
            }

            &:nth-child(8) {
                @apply left-[58%] animate-duration-[2.25s] animate-delay-[0.2s] opacity-80;
            }

            &:nth-child(9) {
                @apply left-[98%] animate-duration-[2.6s] animate-delay-[0.1s] opacity-60;
            }

            &:nth-child(10) {
                @apply left-[65%] animate-duration-[2.5s] animate-delay-[0.2s] opacity-100;
            }
        }
    }
}

.animate-float {
    animation: float 5s linear 0ms infinite;
}

@keyframes float {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
    100% {
        transform: translateY(0);
    }
}
</style>
