import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const source = await readFile(new URL('../api/home/[kind].ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { createHomeNewsHandler } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
const req = (path = 'notices', method = 'GET') =>
  new Request(`https://example.test/api/home/${path}`, { method })
const notice = {
  Title: '공지',
  Link: 'https://lostark.game.onstove.com/News/Notice/List',
  Date: '2026-11-17T10:00:00',
  Type: '공지',
}
const event = {
  Title: '이벤트',
  Link: 'https://lostark.game.onstove.com/News/Event/Now',
  StartDate: '2026-11-01T00:00:00',
  EndDate: '2026-11-30T00:00:00',
  Thumbnail: 'https://cdn-lostark.game.onstove.com/test.jpg',
}
test('키는 서버에서만 보내고 고정된 공식 경로로 공지를 조회하며 공용 캐시를 설정한다', async () => {
  let calls = 0
  const handler = createHomeNewsHandler({
    apiKey: () => 'test-key',
    fetch: async (url, options) => {
      calls++
      assert.equal(url, 'https://developer-lostark.game.onstove.com/news/notices')
      assert.equal(options.headers.Authorization, 'Bearer test-key')
      assert.equal(options.redirect, 'error')
      assert.ok(options.signal)
      return Response.json([{ ...notice, UnexpectedSecret: 'private' }])
    },
  })
  const response = await handler(req())
  assert.equal(calls, 1)
  assert.equal(response.status, 200)
  assert.ok(Number.isFinite(Date.parse(response.headers.get('X-Lostark-Updated-At'))))
  assert.match(response.headers.get('Vercel-CDN-Cache-Control'), /s-maxage=600/)
  assert.match(response.headers.get('Vercel-CDN-Cache-Control'), /stale-while-revalidate=85800/)
  assert.deepEqual(await response.json(), [
    { title: notice.Title, link: notice.Link, date: notice.Date, type: notice.Type },
  ])
})
test('이벤트 응답을 기존 화면 형식으로 변환하고 없는 보상 날짜는 null로 보낸다', async () => {
  const handler = createHomeNewsHandler({
    apiKey: () => 'Bearer test-key',
    fetch: async (url, options) => {
      assert.equal(url, 'https://developer-lostark.game.onstove.com/news/events')
      assert.equal(options.headers.Authorization, 'Bearer test-key')
      return Response.json([event])
    },
  })
  const response = await handler(req('events'))
  assert.deepEqual(await response.json(), [
    {
      title: event.Title,
      link: event.Link,
      thumbnail: event.Thumbnail,
      startDate: event.StartDate,
      endDate: event.EndDate,
      rewardDate: null,
    },
  ])
})
test('키 미설정은 외부 요청 없이 명확한 비캐시 오류로 응답한다', async () => {
  let calls = 0
  const handler = createHomeNewsHandler({
    apiKey: () => '',
    fetch: async () => {
      calls++
      return Response.json([])
    },
  })
  const response = await handler(req())
  assert.equal(response.status, 503)
  assert.equal((await response.json()).code, 'NEWS_NOT_CONFIGURED')
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.equal(calls, 0)
})
test('임의 경로·메서드는 API 호출을 허용하지 않는다', async () => {
  let calls = 0
  const handler = createHomeNewsHandler({
    apiKey: () => 'test-key',
    fetch: async () => {
      calls++
      return Response.json([])
    },
  })
  assert.equal((await handler(req('characters'))).status, 404)
  const response = await handler(req('notices', 'POST'))
  assert.equal(response.status, 405)
  assert.equal(response.headers.get('Allow'), 'GET')
  assert.equal(calls, 0)
})
test('429·인증·서버 오류 응답은 캐시하지 않으며 외부 본문을 노출하지 않는다', async () => {
  for (const status of [401, 403, 429, 500]) {
    const handler = createHomeNewsHandler({
      apiKey: () => 'test-key',
      fetch: async () => new Response('private test-key', { status }),
    })
    const response = await handler(req())
    assert.equal(response.status, status === 429 ? 429 : 502)
    assert.equal(response.headers.get('Vercel-CDN-Cache-Control'), 'no-store')
    assert.doesNotMatch(await response.text(), /private|test-key/)
  }
})
test('타임아웃과 손상 응답은 안전한 오류로 끝내고 성공 캐시에 넣지 않는다', async () => {
  for (const fetch of [
    async () => {
      throw new Error('secret timeout')
    },
    async () => new Response('not-json'),
    async () => Response.json({}),
    async () => Response.json([null]),
    async () => Response.json([{ Title: 'no link' }]),
  ]) {
    const response = await createHomeNewsHandler({ apiKey: () => 'test-key', fetch })(req())
    assert.equal(response.status, 502)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
    assert.doesNotMatch(await response.text(), /secret|test-key/)
  }
})
test('빈 목록도 유효한 성공 응답이다', async () => {
  const response = await createHomeNewsHandler({
    apiKey: () => 'test-key',
    fetch: async () => Response.json([]),
  })(req('events'))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), [])
})
