import { h, renderSlot } from 'vue'

export function useRenderHelper(slots) {
    const renderColumn = ({ row, col, $index: index }) => {
        const key = col.prop

        // 插槽
        if (col.slot) {
            return renderSlot(slots, col.slot, { row, index })
        }

        // formatter
        if (col.formatter) {
            return col.formatter(row)
        }

        // render
        return col.render ? col.render({ row, index }) : row[key]
    }
    const renderColumnExpand = ({ row, col, $index: index }) => {
        if (col.slot) {
            return h('span', renderSlot(slots, 'expand', { row, index }))
        }
        return col.render
    }

    return { renderColumn, renderColumnExpand }
}
