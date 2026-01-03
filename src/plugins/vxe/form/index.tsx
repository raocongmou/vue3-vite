
import { VxeUI } from 'vxe-pc-ui'

VxeUI.renderer.add('ListSearchBtn', {
  renderFormItemContent () {
    return <span>
      <vxe-button type="submit" status="primary" icon="vxe-icon-search">查询</vxe-button>
      <vxe-button type="reset" icon="vxe-icon-repeat">重置</vxe-button>
    </span>
  }
})