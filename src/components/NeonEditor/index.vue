<template>
    <Toolbar
        :editor="editorRef"
        :mode="mode"
        :class="actionClass" />
    <Editor
        v-model="editorValue"
        :mode="mode"
        @onCreated="handleCreated"
        :style="{
            width,
            height,
        }" />
</template>

<script setup>
import { shallowRef, onMounted, onBeforeUnmount } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

defineProps({
    mode: {
        type: String,
        default: 'default',
    },
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: '300px',
    },
    disabled: {
        type: Boolean,
        default: true,
    },
    actionClass: {
        type: String,
        default: 'border-b',
    },
})

const editorRef = shallowRef()
const editorValue = defineModel()

const handleCreated = (editor) => {
    editorRef.value = editor
}

onMounted(() => {
    handleCreated()
})

onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
</script>
