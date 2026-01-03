import type { App } from 'vue'
import type { componentInter } from './type'
import SvgIcon from './SvgIcon/index.vue'
import RTable from './RTable/index.vue'

const components: componentInter[] = [
  { name: 'SvgIcon', component: SvgIcon },
  { name: 'RTable', component: RTable },
]

const install = (app: App) => {
  for (const component of components) {
    app.component(component.name, component)
  }
}

export default { ...components, install }
