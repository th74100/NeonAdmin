<template>
    <div class="flex-col wh-full">
        <div class="fx-col h-full overflow-hidden">
            <div
                v-if="$slots.header"
                class="py-[18px] px-[25px] border-b border-default bg-[var(--ne-card)]">
                <slot name="header"></slot>
            </div>
            <div class="flex-1 p-[15px] shadow-xs overflow-hidden">
                <div
                    v-if="$slots.default"
                    class="fx-col h-full p-[10px] border border-default rounded-md bg-[var(--ne-card)] overflow-hidden">
                    <slot></slot>
                </div>
                <slot
                    v-else
                    name="content"></slot>
            </div>
        </div>
        <div
            v-if="$slots.footer"
            class="pt-[15px]">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
