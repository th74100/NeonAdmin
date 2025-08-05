<template>
    <neon-container>
        <template #content>
            <div class="h-full border">
                <neon-editor
                    v-model="value"
                    height="500px" />
            </div>
        </template>
    </neon-container>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(
    '<h1>一级标题</h1><h2>二级标题</h2><h3>三级标题</h3><h4>四级标题</h4><h5>五级标题</h5><p>hello world ~~~ </p><blockquote>blockquote</blockquote><pre><code class="language-javascript">const a = 10</code></pre><p><img src="https://q8.itc.cn/q_70/images03/20250112/e19cd6a0ea5343579358504d57503334.jpeg" alt="" data-href="" style="width: 706.00px;height: 418.19px;"/></p>',
)
</script>
