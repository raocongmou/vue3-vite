import request from '@/utils/request'
import type { fileResponseInter } from './type'

export function uploadFile(
  data: FormData,
  updateProgress: (percent: number) => void,
) {
  return request<any, fileResponseInter>({
    url: '/common/upload',
    method: 'post',
    onUploadProgress(progressEvent: any) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 0),
      )
      updateProgress(percentCompleted)
    },
    data,
  })
}
