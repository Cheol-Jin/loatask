import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('../src/utils/roster.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { rosterItemLevel, sortedRoster, rosterServers } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)

const characters = [
  { serverName: '카제로스', characterName: 'A', itemAvgLevel: '999.00' },
  { serverName: '루페온', characterName: 'B', itemAvgLevel: '1,751.66' },
  { serverName: '카제로스', characterName: 'C', itemAvgLevel: '1,600.00' },
  { serverName: '카제로스', characterName: 'D', itemAvgLevel: null },
]

test('아이템 레벨을 쉼표 문자열이 아닌 숫자로 비교하고 원본은 보존한다', () => {
  assert.deepEqual(
    sortedRoster(characters, '').map((item) => item.characterName),
    ['B', 'C', 'A', 'D'],
  )
  assert.deepEqual(
    characters.map((item) => item.characterName),
    ['A', 'B', 'C', 'D'],
  )
  assert.equal(rosterItemLevel('1,751.66'), 1751.66)
})

test('서버 선택은 해당 서버만 보여주며 전체 서버와 빈 목록도 처리한다', () => {
  assert.deepEqual(
    sortedRoster(characters, '카제로스').map((item) => item.characterName),
    ['C', 'A', 'D'],
  )
  assert.deepEqual(sortedRoster(characters, '없는 서버'), [])
  assert.deepEqual(sortedRoster([], ''), [])
  assert.deepEqual(rosterServers(characters, '카제로스'), ['루페온', '카제로스'])
  assert.deepEqual(rosterServers([], '카제로스'), ['카제로스'])
})

test('누락·잘못된 레벨은 마지막에 표시하고 같은 레벨이면 이름으로 정렬한다', () => {
  for (const value of [null, '', ' ', 'unknown', '-5', 'Infinity'])
    assert.equal(rosterItemLevel(value), -1)
  assert.equal(rosterItemLevel('0'), 0)
  const same = [
    { ...characters[0], characterName: 'Z' },
    { ...characters[0], characterName: 'A' },
  ]
  assert.deepEqual(
    sortedRoster(same, '').map((item) => item.characterName),
    ['A', 'Z'],
  )
})
