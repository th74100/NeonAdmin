<template>
    <el-form
        ref="form"
        :model="_formData"
        v-bind="tool.omit(_options, ['wrapperClass'])"
        @submit.prevent="onSubmit(formInstance)"
        class="neon-form"
        :class="['neon-form', _options.wrapperClass]">
        <template
            v-for="(item, index) in fieldItems"
            :key="item.key">
            <el-form-item
                v-show="isCollapsed || index < collapseCount"
                :label="item.label"
                :prop="item.key"
                :rules="item.rules"
                :style="getStyle(item)">
                <template
                    v-if="item.help"
                    #label>
                    <div class="flex items-center gap-[5px]">
                        <span>{{ item.label }}</span>
                        <el-tooltip
                            :content="item.help"
                            placement="right">
                            <el-icon>
                                <Warning />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </template>
                <slot :name="item.key">
                    <component-item
                        :modelValue="_formData"
                        :item="item" />
                </slot>
            </el-form-item>
        </template>
        <el-form-item
            v-if="
                _buttons.submitButtonOptions.show ||
                _buttons.resetButtonOptions.show ||
                _buttons.cancelButtonOptions.show
            "
            :class="_buttons.actionWrapperClass">
            <slot name="buttons">
                <el-button
                    v-if="_buttons.submitButtonOptions.show"
                    v-bind="
                        tool.omit(_buttons.submitButtonOptions, [
                            'show',
                            'text',
                        ])
                    "
                    @click="onSubmit(formInstance)">
                    {{ _buttons.submitButtonOptions.text }}
                </el-button>
                <el-button
                    v-if="_buttons.resetButtonOptions.show"
                    v-bind="
                        tool.omit(_buttons.resetButtonOptions, ['show', 'text'])
                    "
                    @click="onReset(formInstance)">
                    {{ _buttons.resetButtonOptions.text }}
                </el-button>
                <el-button
                    v-if="_buttons.cancelButtonOptions.show"
                    v-bind="
                        tool.omit(_buttons.cancelButtonOptions, [
                            'show',
                            'text',
                        ])
                    "
                    @click="onCancel">
                    {{ _buttons.cancelButtonOptions.text }}
                </el-button>
            </slot>
            <!-- 折叠/展开按钮 -->

            <el-button
                v-if="showCollapseButton && schema.length > collapseCount"
                type="primary"
                link
                @click="toggleCollapsed">
                <span>
                    {{
                        !isCollapsed
                            ? collapseButtonText[0]
                            : collapseButtonText[1]
                    }}
                </span>
                <div
                    class="ml-1 transition-transform duration-300"
                    :class="{ 'rotate-180': isCollapsed }">
                    <el-icon>
                        <ArrowDown />
                    </el-icon>
                </div>
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { h, ref, useTemplateRef, computed, useSlots } from 'vue'
import { tool, scrollIntoError } from '@/utils'
import {
    ElInput,
    ElInputNumber,
    ElSelect,
    ElSelectV2,
    ElOption,
    ElRadioGroup,
    ElRadio,
    ElCheckboxGroup,
    ElCheckbox,
    ElDatePicker,
    ElTimePicker,
    ElTimeSelect,
    ElAutocomplete,
    ElCascader,
    ElInputTag,
    ElMention,
    ElRate,
    ElSlider,
    ElSwitch,
    ElTreeSelect,
} from 'element-plus'

const emit = defineEmits(['submit', 'reset', 'cancel'])

const { values, schema, commonConfig, collapsed } = defineProps({
    // 设置表单值
    values: {
        type: Object,
        default: () => ({}),
    },

    // 表单项配置
    schema: {
        type: Array,
        default: () => [],
    },

    // 公共配置
    commonConfig: {
        type: Object,
        default: () => ({}),
    },

    // 默认是否展开
    collapsed: {
        type: Boolean,
        default: true,
    },

    // 是否可折叠
    showCollapseButton: {
        type: Boolean,
        default: false,
    },

    collapseButtonText: {
        type: Array,
        default: () => ['展开', '收起'],
    },

    // 默认显示多少项
    collapseCount: {
        type: Number,
        default: 2,
    },
})

/** 转换 */
const transformOptions = (component, optionsComponent) => {
    return (props) => {
        const { options = [], prop = { label: 'label', value: 'value' } } =
            props

        const labelKey = prop.label
        const valueKey = prop.value

        return h(component, props, () => {
            const _options = typeof options === 'function' ? options() : options
            return _options.map((item) => {
                let _slots = item.slots
                if (typeof _slots === 'string') {
                    _slots = slots[_slots]
                }

                return h(
                    optionsComponent,
                    {
                        label: item[labelKey],
                        value: item[valueKey],
                    },
                    _slots,
                )
            })
        })
    }
}

/** 映射名 */
const componentMaps = {
    input: ElInput,
    number: ElInputNumber,
    select: h(transformOptions(ElSelect, ElOption), {
        popperClass: 'neon-select-popper',
    }),
    selectV2: ElSelectV2,
    radio: transformOptions(ElRadioGroup, ElRadio),
    checkbox: transformOptions(ElCheckboxGroup, ElCheckbox),
    date: ElDatePicker,
    time: ElTimePicker,
    timeSelect: ElTimeSelect,
    autocomplete: h(ElAutocomplete, {
        popperClass: 'neon-autocomplete-popper',
    }),
    cascader: h(ElCascader, {
        popperClass: 'neon-cascader-popper',
    }),
    inputTag: ElInputTag,
    mention: ElMention,
    rate: ElRate,
    slider: ElSlider,
    switch: ElSwitch,
    tree: h(ElTreeSelect, {
        popperClass: 'neon-tree-popper',
    }),
}

const formInstance = useTemplateRef('form')
const isCollapsed = ref(collapsed)
const slots = useSlots()

const _formData = ref({ ...values })

/** 展开/收起切换 */
const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value
}

/** form配置项 */
const _options = computed(() => {
    const config = {
        wrapperClass: '',
        labelPosition: 'right',
    }
    return Object.assign(
        config,
        tool.omit(commonConfig, [
            'actionWrapperClass',
            'submitButtonOptions',
            'resetButtonOptions',
            'cancelButtonOptions',
        ]),
    )
})

/** 按钮配置 */
const _buttons = computed(() => {
    const config = {
        actionWrapperClass: 'col-start--2 ml-auto',
        submitButtonOptions: {
            type: 'primary',
            text: '提交',
            show: true,
            disabled: false,
            loading: false,
        },
        resetButtonOptions: {
            plain: true,
            text: '重置',
            show: true,
            disabled: false,
        },
        cancelButtonOptions: {
            plain: true,
            text: '取消',
            show: false,
            disabled: false,
        },
    }
    const {
        actionWrapperClass = '',
        submitButtonOptions = {},
        resetButtonOptions = {},
        cancelButtonOptions = {},
    } = commonConfig

    return Object.assign(config, {
        actionWrapperClass: actionWrapperClass || config.actionWrapperClass,
        submitButtonOptions: Object.assign(
            config.submitButtonOptions,
            submitButtonOptions,
        ),
        resetButtonOptions: Object.assign(
            config.resetButtonOptions,
            resetButtonOptions,
        ),
        cancelButtonOptions: Object.assign(
            config.cancelButtonOptions,
            cancelButtonOptions,
        ),
    })
})

/** props */
const rootProps = ['label', 'key', 'type', 'style', 'rules', 'help']
const getProps = (item) => {
    if (item.props) {
        return Object.assign(item.props, {
            clearable: true,
            filterable: true,
        })
    }
    return tool.omit(
        Object.assign(item, {
            clearable: true,
            filterable: true,
        }),
        rootProps,
    )
}

/** 组件 */
const getComponent = (item) => {
    const { type } = item

    // type是一个函数或对象
    if (type && typeof type !== 'string') {
        return type
    }

    return componentMaps[item.type || 'input']
}

/** style */
const getStyle = (item) => {
    if (!item.style) return {}
    return { ...item.style }
}

/** 渲染组件 */
const ComponentItem = {
    props: {
        item: Object,
        modelValue: Object,
    },
    setup(props, { slots }) {
        return () => {
            // 动态收集插槽
            const { item } = props
            const _slots = Object.fromEntries(
                Object.entries(item.slots || {}).map(([key, value]) => [
                    key,
                    typeof value === 'string' && slots[value]
                        ? slots[value]
                        : value,
                ]),
            )

            return h(
                getComponent(item),
                {
                    ...getProps(item),
                    modelValue: _formData.value[item.key],
                    'onUpdate:modelValue': (val) => {
                        _formData.value[item.key] = val
                    },
                },
                _slots,
            )
        }
    },
}

/** 渲染字段项 */
const fieldItems = computed(() => {
    const visibleItems = schema.filter((item) => !item.hidden)
    return visibleItems
})

/** 提交按钮 */
const onSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (!valid) return scrollIntoError()
        emit('submit', _formData.value)
    })
}

/** 重置 */
const onReset = (formEl) => {
    if (!formEl) return
    formEl?.resetFields()
    emit('reset', _formData.value)
}

/** 设置表单组件的状态 props */
const setState = (opts) => {
    Object.assign(commonConfig, opts)
}

/** 获取formData */
const getValues = () => {
    return _formData.value
}

/** 取消 */
const onCancel = () => {
    emit('cancel')
}

/** 暴露出去 */
defineExpose({
    validate(...args) {
        return formInstance.value?.validate(...args)
    },
    validateFileds(...args) {
        return formInstance.value?.validateFields(...args)
    },
    resetFields() {
        formInstance.value?.resetFields()
    },
    clearValidate() {
        formInstance.value?.clearValidate()
    },
    setState,
    getValues,
})
</script>
