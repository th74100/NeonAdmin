import { ref } from "vue"
import { useCloned } from "@vueuse/core"

export const useRef = (value) => {
    const formState = ref(value)

    const { cloned } = useCloned(value)
    const _initRefValue = cloned.value

    const resetForm = () => {
        const { cloned } = useCloned(_initRefValue)
        formState.value = cloned.value
    }

    return [formState, resetForm]
}
