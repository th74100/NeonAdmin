import { h, ref, reactive } from 'vue'
import { scrollIntoError } from '@/utils'
import NeonForm from '@/components/NeonForm'

export const useNeonForm = (props) => {
    const formRef = ref(null)
    const Component = (_, { slots }) => {
        return h(NeonForm, { ...reactive(props), ref: formRef }, slots)
    }

    const componentApi = {
        validate() {
            return new Promise((resolve, reject) => {
                formRef.value?.validate((valid) => {
                    if (valid) {
                        resolve(valid)
                    } else {
                        scrollIntoError()
                        reject(valid)
                    }
                })
            })
        },
        resetFields() {
            formRef.value?.resetFields()
        },
        clearValidate() {
            formRef.value?.clearValidate()
        },
        validateField(...args) {
            formRef.value?.validateField(args)
        },
        setState(opts) {
            formRef.value?.setState(opts)
        },
    }

    return [Component, componentApi]
}
