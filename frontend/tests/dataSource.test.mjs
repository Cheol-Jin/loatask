import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const source = await readFile(new URL('../src/utils/dataSource.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { readDataSource, dataSourceTime } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
test('마지막 공식 성공 시각과 이전 데이터 여부를 읽고 잘못된 시각은 표시하지 않는다', () => {
  const time = '2026-11-17T21:00:00Z'
  assert.deepEqual(readDataSource({ 'x-lostark-updated-at': time, 'x-lostark-stale': 'true' }), {
    updatedAt: time,
    stale: true,
  })
  assert.equal(readDataSource({ 'x-lostark-updated-at': 'bad' }), undefined)
  assert.equal(dataSourceTime('bad'), '')
  assert.match(dataSourceTime(time), /2026.*11.*18/)
  assert.match(dataSourceTime(time), /06:00/)
})
