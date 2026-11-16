import axios from 'axios'
import { getHomeNotices, getHomeEvents } from '@/api/lostarkApi'
import { createHomeResource } from '@/utils/homeResource'
import { validNotices, validEvents } from '@/utils/homeNews'

const retryable = (error: unknown) =>
  axios.isAxiosError(error) &&
  (!error.response ||
    error.response.status === 408 ||
    error.response.status === 429 ||
    error.response.status >= 500)

// 두 영역의 캐시·오류·요청은 서로 독립적입니다. 같은 영역의 중복 요청은 공유합니다.
export const noticeResource = createHomeResource({
  key: 'loatask.home.notices.v1',
  fetch: getHomeNotices,
  valid: validNotices,
  retryable,
})
export const eventResource = createHomeResource({
  key: 'loatask.home.events.v1',
  fetch: getHomeEvents,
  valid: validEvents,
  retryable,
})
