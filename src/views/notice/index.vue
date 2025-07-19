<template>
    <neon-container>
        <template #content>
            <el-alert
                type="error"
                style="margin-bottom: 20px">
                <template #title>
                    配置项参数，请查阅Element Plus文档：
                    <a
                        href="https://element-plus.org/"
                        target="_blank">
                        https://element-plus.org/zh-CN/
                    </a>
                </template>
            </el-alert>
            <div class="fx-col gap-5">
                <div
                    class="border border-default rounded-md bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">
                        Message 消息提示（默认）
                    </h2>
                    <div class="px-4 py-5">
                        <el-button
                            type="primary"
                            @click="$message.info('这是一条消息提示')">
                            消 息
                        </el-button>
                        <el-button
                            type="success"
                            @click="$message.success('这是一条成功消息提示')">
                            成 功
                        </el-button>
                        <el-button
                            type="warning"
                            @click="$message.warning('这是一条警告消息提示')">
                            警 告
                        </el-button>
                        <el-button
                            type="danger"
                            @click="$message.error('这是一条错误消息提示')">
                            错 误
                        </el-button>
                    </div>
                </div>

                <div
                    class="border border-default rounded-md bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">
                        Message 消息提示（自定义）
                    </h2>
                    <div class="px-4 py-5">
                        <el-button
                            type="primary"
                            @click="
                                $message.info(
                                    '这是一条自定义消息提示， 持续 1.5 秒',
                                    {
                                        duration: 1500,
                                        plain: false,
                                    },
                                )
                            ">
                            消 息
                        </el-button>
                        <el-button
                            type="success"
                            @click="
                                $message.success(
                                    '这是一条成功消息提示， 不自动关闭',
                                    {
                                        duration: 0,
                                        plain: false,
                                        showClose: true,
                                    },
                                )
                            ">
                            成 功
                        </el-button>
                        <el-button
                            type="warning"
                            @click="
                                $message.warning(
                                    '这是一条警告消息提示, 不分组',
                                    {
                                        plain: false,
                                        grouping: false,
                                    },
                                )
                            ">
                            警 告
                        </el-button>
                        <el-button
                            type="danger"
                            @click="
                                $message.error(
                                    '<em>这是一条错误消息提示，可以自定义HTML片段</em>',
                                    {
                                        dangerouslyUseHTMLString: true,
                                        plain: false,
                                    },
                                )
                            ">
                            错 误
                        </el-button>
                    </div>
                </div>

                <div
                    class="border border-default rounded-md bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">
                        Notification 消息提示
                    </h2>
                    <div class="px-4 py-5">
                        <el-button
                            type="primary"
                            @click="
                                $notification.primary('默认', '这是默认通知')
                            ">
                            默 认
                        </el-button>
                        <el-button
                            type="info"
                            @click="$notification.info('消息', '这是消息通知')">
                            消 息
                        </el-button>
                        <el-button
                            type="success"
                            @click="
                                $notification.success('成功', '这是成功通知')
                            ">
                            成 功
                        </el-button>
                        <el-button
                            type="warning"
                            @click="
                                $notification.warning('警告', '这是警告通知')
                            ">
                            警 告
                        </el-button>
                        <el-button
                            type="danger"
                            @click="
                                $notification.error('错误', '这是错误通知')
                            ">
                            错 误
                        </el-button>
                    </div>
                </div>

                <div
                    class="border border-default rounded-md bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">
                        Message Box 消息弹框
                    </h2>
                    <div class="px-4 py-5">
                        <el-button
                            type="info"
                            @click="$msgbox.info('这是一条消息')">
                            消 息
                        </el-button>
                        <el-button
                            type="success"
                            @click="$msgbox.success('这是一条成功消息')">
                            成 功
                        </el-button>
                        <el-button
                            type="warning"
                            @click="$msgbox.warning('这是一条警告消息')">
                            警 告
                        </el-button>
                        <el-button
                            type="danger"
                            @click="$msgbox.error('这是一条错误消息')">
                            错 误
                        </el-button>
                        <el-button
                            type="primary"
                            @click="
                                $msgbox.confirm('这是一条确认消息', {
                                    title: '确认消息',
                                    onConfirm: () => {
                                        $message.success('确认动作')
                                    },
                                    onCancel: () => {
                                        $message.info('取消动作')
                                    },
                                })
                            ">
                            确 认 消 息
                        </el-button>
                    </div>
                </div>

                <div
                    class="border border-default rounded-md bg-[var(--ne-card)]">
                    <h2 class="border-b border-default p-4">弹窗</h2>
                    <div class="px-4 py-5">
                        <el-button type="primary">打 开</el-button>
                    </div>
                </div>
            </div>
        </template>
    </neon-container>
</template>

<script setup>
import { $message, $notification, $msgbox } from '@/utils'
</script>
