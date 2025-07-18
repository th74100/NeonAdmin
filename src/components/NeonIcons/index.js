/** 导入所有图标 */

const icons = import.meta.glob('./*.vue', { eager: true })

const neonIcons = {}

for (const path in icons) {
    const name = path.replace(/^\.\/(.*)\.vue$/, '$1')
    neonIcons[name] = icons[path].default
}

export default neonIcons
