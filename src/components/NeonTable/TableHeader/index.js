import { h, renderSlot } from 'vue'

// 渲染默认标题
const renderDefaultHeader = (column) => {
    return h('span', {}, column.label)
}

export const renderCustomHeader = ({ col, column, index, slots }) => {
    // 插槽自定义表头
    if (col.headerSlot) {
        return h(
            'span',
            {},
            renderSlot(slots, col.headerSlot, { column, index }),
        )
    }

    // render 自定义表头
    return col?.headerRender?.({ column, index }) || renderDefaultHeader(column)
}
