import { h, defineComponent } from 'vue'
import { ElTableColumn } from 'element-plus'
import { useRenderHelper } from './render-helper'
import { renderCustomHeader } from '../TableHeader'

export default defineComponent({
    props: {
        col: Object,
    },
    setup(props, { slots }) {
        const { renderColumn } = useRenderHelper(slots)

        // 返回属性
        const attr = (col) => {
            if (col.children?.length) {
                return {
                    label: col.label,
                    width: col.width,
                    align: col.align,
                }
            }
            return col
        }

        // 渲染行
        const renderTableColumn = (col) => {
            return h(ElTableColumn, attr(col), {
                default: ({ row, $index }) => {
                    // 如果有配置嵌套数据，则递归该组件，生成多级表头
                    if (col.children?.length) {
                        return col.children.map((item) =>
                            renderTableColumn(item),
                        )
                    }
                    return renderColumn({ row, col, $index })
                },

                // 自定义表头
                header: ({ column, $index }) =>
                    renderCustomHeader({ col, column, index: $index, slots }),
            })
        }
        return () => renderTableColumn(props.col)
    },
})
