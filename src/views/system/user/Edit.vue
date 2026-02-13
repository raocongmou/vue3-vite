<template>
  <vxe-modal
    v-model="visible"
    :title="setTitle"
    width="800"
    destroy-on-close
    @close="handleClose"
  >
    <!-- @vue-ignore -->
    <vxe-form
      ref="formRef"
      :data="formData"
      :rules="formRules"
      title-align="right"
      title-width="100"
      padding
      @submit="submitEvent"
      :disabled="editStatus === 'view'"
    >
      <vxe-form-item title="用户名" field="username" span="12">
        <template #default>
          <vxe-input
            v-model="formData.username as any"
            placeholder="请输入用户名"
            clearable
            :disabled="editStatus !== 'add'"
          />
        </template>
      </vxe-form-item>

      <vxe-form-item title="昵称" field="nickname" span="12">
        <template #default>
          <vxe-input
            v-model="formData.nickname as any"
            placeholder="请输入昵称"
            clearable
          />
        </template>
      </vxe-form-item>

      <vxe-form-item title="手机号码" field="phone" span="12">
        <template #default>
          <vxe-input
            v-model="formData.phone as any"
            placeholder="请输入手机号"
            clearable
          />
        </template>
      </vxe-form-item>

      <vxe-form-item title="邮箱" field="email" span="12">
        <template #default>
          <vxe-input
            v-model="formData.email as any"
            placeholder="请输入邮箱"
            clearable
          />
        </template>
      </vxe-form-item>

      <vxe-form-item title="创建时间" field="createTime" span="12">
        <template #default>
          <vxe-date-picker
            v-model="formData.createTime as any"
            type="datetime"
            value-format="date"
            placeholder="系统自动生成"
            disabled
          />
        </template>
      </vxe-form-item>

      <vxe-form-item title="性别" field="gender" span="12">
        <template #default>
          <vxe-radio
            v-model="formData.gender"
            :disabled="editStatus === 'view'"
            :checked-value="1"
          >
            男
          </vxe-radio>
          <vxe-radio
            v-model="formData.gender"
            :disabled="editStatus === 'view'"
            :checked-value="0"
          >
            女
          </vxe-radio>
        </template>
      </vxe-form-item>

      <vxe-form-item title="头像" field="avatar" span="12">
        <template #default>
          <vxe-upload
            v-model="formData.avatar as any"
            mode="image"
            show-progress
            size="mini"
            :limit-count="1"
            :upload-method="uploadMethod"
            :show-button-text="false"
            :multiple="false"
            single-mode
            auto-hidden-button
          />
        </template>
      </vxe-form-item>

      <vxe-form-item align="right" span="24">
        <template #default>
          <vxe-button v-if="editStatus !== 'view'" type="submit" status="primary" :loading="loading">
            确定
          </vxe-button>
          <vxe-button @click="visible = false">取消</vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>
  </vxe-modal>
</template>

<script setup lang="ts">
  import {
    VxeFormInstance,
    VxeFormPropTypes,
    VxeUI,
    VxeUploadPropTypes,
  } from 'vxe-pc-ui'
  import { uploadFile } from '@/api/common' // 假设你有一个上传 API
  import { addUser, updateUser } from '@/api/system/user'

  // 定义表单数据接口，确保 TS 知道每个字段的类型
  interface FormData {
    id?: number | null
    username: string | null // 允许 null
    nickname: string | null
    phone: string | null
    email: string | null
    gender: number | string | null // 根据你 option 的 value 类型定
    status: number | null // 重点：允许为 null，兼容 clearable
    avatar: string | null
    createTime: string | null
  }

  const visible = ref(false)
  const loading = ref(false)
  const formRef = ref<VxeFormInstance>()
  // 初始化默认值
  const defaultFormData = {
    id: null,
    username: '',
    nickname: '',
    phone: '',
    email: '',
    gender: null,
    status: 1,
    avatar: '',
    createTime: '',
  }
  const formData = ref({ ...defaultFormData })
  const editStatus = ref('')
  const formRules = reactive<VxeFormPropTypes.Rules>({
    username: [{ required: true, message: '用户名不能为空' }],
    nickname: [{ required: true, message: '昵称不能为空' }],
  })

  const setTitle = computed(() => {
    let title = ''
    switch (editStatus.value) {
      case 'add':
        title = '新增'
        break
      case 'edit':
        title = '编辑'
        break
      case 'view':
        title = '查看'
        break
      default:
        title = ''
    }
    return title
  })

  const uploadMethod: VxeUploadPropTypes.UploadMethod = async ({
    file,
    updateProgress,
  }) => {
    const data = new FormData()

    data.append('file', file)

    const res = await uploadFile(data, updateProgress)

    formData.value.avatar = res.data
    return { url: res.data }
  }

  // 暴露给父组件的方法
  const open = (row?: FormData, editStatusStr: string = 'add') => {
    editStatus.value = editStatusStr
    visible.value = true
    if (row && Object.keys(row).length > 0) {
      // 编辑：合并数据
      Object.assign(formData.value, row)
    } else {
      // 新增：重置数据
      Object.assign(formData.value, defaultFormData)
    }
  }

  const handleClose = () => {
    formRef.value?.reset()
  }

  const emit = defineEmits<{
    (e: 'reload'): void
  }>()

  const submitEvent = async () => {
    loading.value = true
    console.log('formData.value', formData.value)

    try {
      if (editStatus.value === 'edit') {
        await updateUser(formData.value)
      } else if (editStatus.value === 'add') {
        await addUser(formData.value)
      }
      VxeUI.modal.message({ content: '保存成功', status: 'success' })
      visible.value = false
      emit('reload') // 通知父组件刷新列表
    } finally {
      loading.value = false
    }
  }

  // 必须导出 open 方法，父组件才能通过 ref 调用
  defineExpose({ open })
</script>
