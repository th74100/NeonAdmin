<template>
    <neon-container>
        <template #content>
            <v-md-editor
                v-model="content"
                :codemirror-config="{
                    lineNumbers: false,
                }"
                height="800px" />
        </template>
    </neon-container>
</template>
<script setup>
import { ref } from 'vue'

const content = ref(`JavaScript中常用的排序算法有以下几种：

1. 冒泡排序

冒泡排序是一种简单的排序算法，它重复地遍历要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。遍历数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。

\`\`\`javascript
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
\`\`\`

## 什么是 Vue？

Vue (发音为 /vjuː/，类似 view) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vue 都可以胜任。

下面是一个最基本的示例：

\`\`\`js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
\`\`\`

\`\`\`md
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>
\`\`\`
`)
</script>
