import {
    defineConfig,
    presetWind3,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss'

export default defineConfig({
    shortcuts: {
        'wh-full': 'w-full h-full',
        'fx-start': 'flex items-center justify-start',
        'fx-center': 'flex items-center justify-center',
        'fx-between': 'flex items-center justify-between',
        'fx-end': 'flex items-center justify-end',
        'fx-col': 'flex flex-col',
    },
    theme: {
        extend: {
            gridColumnStart: {
                '-2': '2',
            },
            gridColumnEnd: {
                '-1': '-1',
            },
        },
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
        },
    },
    presets: [presetWind3()],
    transformers: [transformerDirectives(), transformerVariantGroup()],
})
