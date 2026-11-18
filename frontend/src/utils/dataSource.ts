export interface DataSource {
  updatedAt: string
  stale: boolean
}
export function readDataSource(headers: Record<string, unknown>): DataSource | undefined {
  const value = headers['x-lostark-updated-at']
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return undefined
  return { updatedAt: value, stale: headers['x-lostark-stale'] === 'true' }
}
export function sourceTime(value: string): string {
  const time = Date.parse(value)
  if (!Number.isFinite(time)) return '확인 시각 없음'
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(time)
}
export function dataSourceTime(value?: string): string {
  const time = value ? Date.parse(value) : NaN
  if (!Number.isFinite(time)) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(time)
}
