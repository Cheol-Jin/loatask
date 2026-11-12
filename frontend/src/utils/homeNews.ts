export interface HomeNotice {
  title: string
  date: string
  link: string
  type: string
}
export interface HomeEvent {
  title: string
  thumbnail: string
  link: string
  startDate: string
  endDate: string
  rewardDate: string | null
}

// 시차가 없는 공식 일정은 한국 시간으로 해석합니다.
export function newsTime(value: string): number {
  if (!value) return NaN
  return Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : value + '+09:00')
}
export function officialLink(value: string): string | null {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'lostark.game.onstove.com'
      ? url.href
      : null
  } catch {
    return null
  }
}
export function officialThumbnail(value: string): string | null {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'cdn-lostark.game.onstove.com'
      ? url.href
      : null
  } catch {
    return null
  }
}
export function latestNotices(items: HomeNotice[]): HomeNotice[] {
  return items
    .filter((item) => item?.title && officialLink(item.link))
    .sort((a, b) => (newsTime(b.date) || 0) - (newsTime(a.date) || 0))
    .slice(0, 5)
}
export function ongoingEvents(items: HomeEvent[], now = Date.now()): HomeEvent[] {
  return items
    .filter(
      (item) =>
        item?.title &&
        officialLink(item.link) &&
        newsTime(item.startDate) <= now &&
        newsTime(item.endDate) >= now,
    )
    .sort((a, b) => newsTime(a.endDate) - newsTime(b.endDate))
    .slice(0, 2)
}
export function newsDate(value: string): string {
  const time = newsTime(value)
  if (!Number.isFinite(time)) return '일정 확인'
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
  }).format(time)
}
