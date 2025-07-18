<template>
    <el-table
        :data="dataSource"
        v-loading="loading"
        :element-loading-text="loadingText"
        v-bind="{ ...$attrs, ..._options }"
        class="neon-table">
        <template
            v-for="(col, index) in columns"
            :key="index">
            <el-table-column
                v-if="
                    col.type === 'index' ||
                    col.type === 'selection' ||
                    col.type === 'expand'
                "
                :index="indexMethod"
                v-bind="col">
                <!-- 当type等于expand时， 配置通过h函数渲染、txs语法或者插槽自定义内容 -->
                <template #default="{ row, $index }">
                    <component
                        :is="renderColumnExpand({ row, col, $index })"
                        :row="row"
                        :index="$index" />
                </template>
            </el-table-column>
            <table-column
                v-else
                :col="col">
                <template
                    v-for="slot in Object.keys($slots)"
                    #[slot]="scope">
                    <slot
                        :name="slot"
                        v-bind="scope" />
                </template>
            </table-column>
        </template>
        <template #empty>
            <div class="neon-table__empty">
                <el-empty
                    :image-size="60"
                    description="暂无数据">
                    <template #image>
                        <component :is="'neon-empty'" />
                    </template>
                </el-empty>
            </div>
        </template>
    </el-table>
    <div
        v-if="_pagination.showPagination"
        class="fx-end pt-[10px]">
        <el-pagination
            v-bind="tool.omit(_pagination, ['showPagination'])"
            @size-change="pageSizeChange"
            @current-change="currentPageChange">
        </el-pagination>
    </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import { tool } from '@/utils'
import { useRenderHelper } from './TableColumn/render-helper'
import TableColumn from './TableColumn'
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/config'

const { renderColumnExpand } = useRenderHelper(useSlots())

const emit = defineEmits(['sizeChange', 'currentChange', 'paginationChange'])

const { options } = defineProps({
    columns: {
        type: Array,
        default: () => [],
    },
    dataSource: {
        type: Array,
        default: () => [],
    },
    options: {
        type: Object,
        default: () => ({}),
    },
    loading: {
        type: Boolean,
        default: false,
    },
    loadingText: {
        type: String,
        default: '加载中...',
    },
})

const _options = computed(() => {
    const config = {
        rowKey: 'id',
        border: true,
        stripe: false,
    }
    return Object.assign(config, tool.omit(options, ['pagination']))
})

// 合并分页配置
const _pagination = computed(() => {
    const config = {
        showPagination: true,
        total: 0,
        currentPage: 1,
        pageSize: PAGE_SIZE,
        pageSizes: PAGE_SIZE_OPTIONS,
        background: true,
        layout: 'total, sizes, prev, pager, next, jumper',
    }
    return Object.assign(config, options?.pagination)
})

// 自定义索引
const indexMethod = (index) => {
    return (
        index +
        (_pagination.value.currentPage - 1) * _pagination.value.pageSize +
        1
    )
}

// 切换pageSize
const pageSizeChange = (pageSize) => {
    emit('sizeChange', pageSize)
    emit('paginationChange', 1, pageSize)
}

// 切换currentPage
const currentPageChange = (currentPage) => {
    emit('currentChange', currentPage)
    emit('paginationChange', currentPage, _pagination.value.pageSize)
}
</script>
