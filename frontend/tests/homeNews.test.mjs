import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const src = await readFile(new URL('../src/utils/homeNews.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { latestNotices, ongoingEvents, newsTime, newsDate, officialLink, officialThumbnail } =
  await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const link = 'https://lostark.game.onstove.com/News/Notice/List'
test('공지 최신 5개만 정렬하며 원본은 변경하지 않는다', () => {
  const values = Array.from({ length: 6 }, (_, i) => ({
    title: String(i),
    date: `2026-11-0${i + 1}T10:00:00`,
    link,
  }))
  assert.deepEqual(
    latestNotices(values).map((x) => x.title),
    ['5', '4', '3', '2', '1'],
  )
  assert.equal(values[0].title, '0')
})
test('오프셋 없는 일정은 한국 시간이며 종료된 이벤트와 시작 전 이벤트는 숨긴다', () => {
  assert.equal(newsTime('2026-11-13T00:00:00'), Date.parse('2026-11-12T15:00:00Z'))
  const values = [
    { title: '종료', startDate: '2026-11-01T00:00:00', endDate: '2026-11-12T23:59:59', link },
    { title: '진행', startDate: '2026-11-01T00:00:00', endDate: '2026-11-14T00:00:00', link },
    { title: '예정', startDate: '2026-11-14T00:00:00', endDate: '2026-11-20T00:00:00', link },
  ]
  assert.deepEqual(
    ongoingEvents(values, newsTime('2026-11-13T00:00:00')).map((x) => x.title),
    ['진행'],
  )
  assert.equal(newsDate('bad'), '일정 확인')
})
test('공식 HTTPS 링크만 노출한다', () => {
  for (const url of [
    'javascript:alert(1)',
    'https://lostark.game.onstove.com.evil.test/',
    'http://lostark.game.onstove.com/',
  ])
    assert.equal(officialLink(url), null)
  assert.ok(officialLink(link))
  assert.ok(officialThumbnail('https://cdn-lostark.game.onstove.com/test.jpg'))
  assert.equal(officialThumbnail('https://example.com/test.jpg'), null)
  assert.deepEqual(
    latestNotices([{ title: '잘못된 링크', link: 'javascript:alert(1)', date: '' }]),
    [],
  )
})
