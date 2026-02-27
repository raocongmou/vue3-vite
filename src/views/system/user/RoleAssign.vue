<template>
  <vxe-modal
    v-model="visible"
    title="分配角色"
    width="900"
    destroy-on-close
    @close="handleClose"
  >
    <div class="role-assign">
      <div class="role-assign__meta">
        <span class="role-assign__label">用户：</span>
        <span class="role-assign__value">
          {{ currentUser?.username || '-' }}
          <span v-if="currentUser?.nickname">
            （{{ currentUser?.nickname }}）
          </span>
        </span>
        <span class="role-assign__count">已选：{{ selectedCount }}</span>
      </div>

      <!-- @vue-ignore -->
      <vxe-grid
        ref="gridRef"
        v-bind="gridOptions"
        v-on="gridEvents"
        :loading="loading"
      />

      <div class="role-assign__actions">
        <vxe-button status="primary" :loading="saving" @click="handleSubmit">
          保存
        </vxe-button>
        <vxe-button @click="visible = false">取消</vxe-button>
      </div>
    </div>
  </vxe-modal>
</template>

<script setup lang="ts" name="RoleAssign">
  import type {
    VxeGridInstance,
    VxeGridListeners,
    VxeGridProps,
  } from 'vxe-table'
  import { VxeUI } from 'vxe-pc-ui'
  import dayjs from 'dayjs'
  import { getRoleList } from '@/api/system/role'
  import { assignUserRoles, getUserRoleIds } from '@/api/system/user'

  type RoleItem = {
    id: number
    roleName: string
    roleKey: string
    sortOrder?: number
    status: number
    remark?: string
    createTime?: string
  }

  type UserItem = {
    id: number
    username?: string
    nickname?: string
  }

  const visible = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  const currentUser = ref<UserItem | null>(null)
  const roleRecords = ref<RoleItem[]>([])
  const gridRef = ref<VxeGridInstance<RoleItem> | null>(null)
  const checkedRoleIds = ref<number[]>([])

  const selectedCount = computed(() => checkedRoleIds.value.length)

  const syncCheckedFromGrid = () => {
    const $grid = gridRef.value
    if (!$grid) {
      checkedRoleIds.value = []
      return
    }
    checkedRoleIds.value = $grid.getCheckboxRecords().map((r) => r.id)
  }

  const gridEvents: VxeGridListeners = {
    checkboxChange() {
      syncCheckedFromGrid()
    },
    checkboxAll() {
      syncCheckedFromGrid()
    },
  }

  const gridOptions = computed<VxeGridProps<RoleItem>>(() => ({
    border: true,
    round: true,
    stripe: false,
    align: 'center',
    size: 'mini',
    height: 420,
    data: roleRecords.value,
    rowConfig: {
      isHover: true,
      useKey: true,
      keyField: 'id',
    },
    checkboxConfig: {
      trigger: 'row',
      highlight: true,
    },
    columns: [
      { type: 'checkbox', width: 60, fixed: 'left' },
      { type: 'seq', width: 70, fixed: 'left' },
      { field: 'roleName', title: '角色名称', minWidth: 120 },
      { field: 'roleKey', title: '角色标识', minWidth: 120 },
      {
        field: 'status',
        title: '状态',
        width: 90,
        formatter: ({ cellValue }) =>
          Number(cellValue) === 1 ? '启用' : '禁用',
      },
      { field: 'remark', title: '备注', minWidth: 160, showOverflow: true },
      {
        field: 'createTime',
        title: '创建时间',
        minWidth: 160,
        formatter: ({ cellValue }) =>
          cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '-',
      },
    ],
  }))

  const emit = defineEmits<{
    (e: 'reload'): void
  }>()

  const handleClose = () => {
    currentUser.value = null
    roleRecords.value = []
    gridRef.value?.clearCheckboxRow()
    checkedRoleIds.value = []
  }

  const syncCheckedRoles = async (roleIds: number[]) => {
    await nextTick()
    const $grid = gridRef.value
    if (!$grid) return
    $grid.clearCheckboxRow()
    const set = new Set((roleIds || []).map((n) => Number(n)))
    const rows = roleRecords.value.filter((r) => set.has(Number(r.id)))
    if (rows.length > 0) $grid.setCheckboxRow(rows, true)
    syncCheckedFromGrid()
  }

  const open = async (row?: UserItem) => {
    if (!row?.id) {
      VxeUI.modal.message({
        content: '请先选择要分配角色的用户',
        status: 'warning',
      })
      return
    }

    visible.value = true
    currentUser.value = row
    loading.value = true

    try {
      const [roleRes, userRoleRes] = await Promise.all([
        getRoleList({ pageNum: 1, pageSize: 9999 }),
        getUserRoleIds({ userId: row.id }),
      ])

      roleRecords.value = roleRes?.data?.records || []
      await syncCheckedRoles(userRoleRes?.data?.roleIds || [])
    } finally {
      loading.value = false
    }
  }

  const handleSubmit = async () => {
    const $grid = gridRef.value
    if (!currentUser.value?.id) return
    if (!$grid) return

    const roleIds = $grid.getCheckboxRecords().map((r) => r.id)
    saving.value = true
    try {
      await assignUserRoles({ userId: currentUser.value.id, roleIds })
      VxeUI.modal.message({ content: '保存成功', status: 'success' })
      visible.value = false
      emit('reload')
    } finally {
      saving.value = false
    }
  }

  defineExpose({ open })
</script>

<style scoped lang="scss">
  .role-assign {
    padding: 8px 8px 0;

    &__meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 14px;
    }

    &__label {
      color: var(--el-text-color-regular);
    }

    &__value {
      color: var(--el-text-color-primary);
      font-weight: 600;
    }

    &__count {
      margin-left: auto;
      color: var(--el-text-color-regular);
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 0 4px;
    }
  }
</style>
