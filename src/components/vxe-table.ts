import {
  VxeTable,
  VxeColumn,
  VxeColgroup,
  VxeGrid,
  VxeToolbar,
} from 'vxe-table'
import type { App } from 'vue'

const vxeTableComponents = [
  VxeTable,
  VxeColumn,
  VxeColgroup,
  VxeGrid,
  VxeToolbar,
]

export const lazyVxeTable = (app: App) => {
  for (const component of vxeTableComponents) {
    app.use(component)
  }
}
