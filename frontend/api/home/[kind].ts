// 이 파일은 Vercel 서버에서만 실행됩니다. Vite의 src 번들에 포함하지 않습니다.
interface Dependencies {
  apiKey?: () => string | undefined
  fetch?: typeof fetch
  timeout?: () => AbortSignal
}
const upstream = 'https://developer-lostark.game.onstove.com/news/'
const text = (value: unknown) => (typeof value === 'string' ? value : '')
function normalize(value: unknown, kind: string) {
  if (!Array.isArray(value) || value.length > 500) throw new Error('Invalid news')
  return value.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Invalid news')
    const row = item as Record<string, unknown>
    if (typeof row.Title !== 'string' || typeof row.Link !== 'string')
      throw new Error('Invalid news')
    const common = { title: row.Title, link: row.Link }
    if (kind === 'notices') {
      if (typeof row.Date !== 'string') throw new Error('Invalid notice date')
      return { ...common, date: row.Date, type: text(row.Type) }
    }
    if (typeof row.StartDate !== 'string' || typeof row.EndDate !== 'string')
      throw new Error('Invalid event dates')
    return {
      ...common,
      thumbnail: text(row.Thumbnail),
      startDate: row.StartDate,
      endDate: row.EndDate,
      rewardDate: typeof row.RewardDate === 'string' ? row.RewardDate : null,
    }
  })
}
function failure(status: number, code: string) {
  // 외부 응답 본문·인증 헤더·키는 응답이나 로그에 남기지 않습니다.
  return Response.json(
    { code, message: '공식 소식을 불러오지 못했습니다.' },
    {
      status,
      headers: { 'Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' },
    },
  )
}
export function createHomeNewsHandler(dependencies: Dependencies = {}) {
  const getKey = dependencies.apiKey ?? (() => process.env.LOSTARK_API_KEY)
  const request = dependencies.fetch ?? fetch
  const timeout = dependencies.timeout ?? (() => AbortSignal.timeout(5_000))
  return async (incoming: Request): Promise<Response> => {
    if (incoming.method !== 'GET') {
      const response = failure(405, 'METHOD_NOT_ALLOWED')
      response.headers.set('Allow', 'GET')
      return response
    }
    const path = new URL(incoming.url).pathname
    const kind =
      path === '/api/home/notices' ? 'notices' : path === '/api/home/events' ? 'events' : null
    if (!kind) return failure(404, 'NOT_FOUND')
    const key = getKey()
      ?.trim()
      .replace(/^Bearer\s+/i, '')
    if (!key) return failure(503, 'NEWS_NOT_CONFIGURED')
    try {
      // 목적지와 경로를 고정해 임의 API 프록시로 사용되지 않게 합니다.
      const response = await request(upstream + kind, {
        headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
        signal: timeout(),
        redirect: 'error',
      })
      if (!response.ok) return failure(response.status === 429 ? 429 : 502, 'NEWS_UNAVAILABLE')
      const data = normalize(await response.json(), kind)
      return Response.json(data, {
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Vercel-CDN-Cache-Control':
            'public, s-maxage=600, stale-while-revalidate=3000, stale-if-error=3000',
          'X-Content-Type-Options': 'nosniff',
        },
      })
    } catch {
      return failure(502, 'NEWS_UNAVAILABLE')
    }
  }
}
export default { fetch: createHomeNewsHandler() }
