import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const source = await readFile(new URL('../src/data/tarot.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const {
  tarotCards,
  tarotTopics,
  tarotSpreads,
  tarotGroups,
  createTarotDeck,
  readTarotCard,
  validTarotReading,
} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const record = (spreadId = 'mind') => ({
  version: 1,
  topicId: 'crush',
  spreadId,
  createdAt: '2026-11-19T00:00:00Z',
  cards: tarotCards
    .slice(0, tarotSpreads.find((item) => item.id === spreadId).positions.length)
    .map((item) => ({ cardId: item.id, reversed: false })),
})
test('78장은 중복 없이 22 메이저와 56 마이너로 구성되며 정·역방향 해석이 다르다', () => {
  assert.equal(tarotCards.length, 78)
  assert.equal(new Set(tarotCards.map((item) => item.id)).size, 78)
  assert.equal(tarotCards.filter((item) => item.suit === 'major').length, 22)
  for (const suit of ['wands', 'cups', 'swords', 'pentacles'])
    assert.equal(tarotCards.filter((item) => item.suit === suit).length, 14)
  assert.equal(new Set(tarotCards.map((item) => item.upright)).size, 78)
  for (const card of tarotCards) {
    assert.notEqual(card.upright, card.reversed)
    assert.ok(card.name && card.action && card.subtitle)
  }
})
test('24개 상담 주제와 6개 배열이 모든 카드 위치에서 유효한 해석을 만든다', () => {
  assert.equal(tarotTopics.length, 24)
  assert.equal(tarotSpreads.length, 6)
  assert.equal(new Set(tarotTopics.map((item) => item.id)).size, 24)
  for (const group of tarotGroups)
    assert.equal(tarotTopics.filter((item) => item.group === group.id).length, 4)
  for (const topic of tarotTopics)
    for (const spread of tarotSpreads) {
      const reading = { ...record(spread.id), topicId: topic.id }
      assert.equal(validTarotReading(reading), true)
      reading.cards.forEach((_, index) => {
        const text = readTarotCard(reading, index)
        assert.equal(text.position, spread.positions[index])
        assert.match(text.reflection, new RegExp(topic.label))
        assert.doesNotMatch(text.reflection, /undefined/)
      })
    }
})
test('셔플은 원본을 바꾸지 않으며 난수 경계에서도 중복 카드를 만들지 않는다', () => {
  const before = tarotCards.map((item) => item.id)
  for (const random of [() => 0, () => 1 - Number.EPSILON, Math.random]) {
    const deck = createTarotDeck(random)
    assert.equal(deck.length, 78)
    assert.equal(new Set(deck.map((item) => item.cardId)).size, 78)
    assert.deepEqual(
      tarotCards.map((item) => item.id),
      before,
    )
  }
  for (const invalid of [1, -0.1, NaN]) assert.throws(() => createTarotDeck(() => invalid))
})
test('배열 길이·중복·카드·날짜·주제·방향이 손상된 저장 기록을 거부한다', () => {
  const good = record()
  for (const bad of [
    null,
    {},
    { ...good, version: 2 },
    { ...good, topicId: 'missing' },
    { ...good, spreadId: 'missing' },
    { ...good, createdAt: 'bad' },
    { ...good, cards: [] },
    { ...good, cards: [good.cards[0], good.cards[0], good.cards[0]] },
    { ...good, cards: [null, ...good.cards.slice(1)] },
    { ...good, cards: [{ cardId: 'missing', reversed: false }, ...good.cards.slice(1)] },
    {
      ...good,
      cards: [{ cardId: good.cards[0].cardId, reversed: 'false' }, ...good.cards.slice(1)],
    },
  ])
    assert.equal(validTarotReading(bad), false)
})
test('방향·위치·상담 주제가 각각 해석에 반영된다', () => {
  const reading = record()
  const first = readTarotCard(reading, 0)
  const reversed = readTarotCard(
    { ...reading, cards: reading.cards.map((item) => ({ ...item, reversed: true })) },
    0,
  )
  assert.notEqual(first.message, reversed.message)
  assert.notEqual(first.reflection, readTarotCard(reading, 1).reflection)
  assert.notEqual(first.reflection, readTarotCard({ ...reading, topicId: 'raid' }, 0).reflection)
  assert.throws(() => readTarotCard(reading, 99))
})

const artSource = await readFile(new URL('../src/data/tarotChoiceArt.ts', import.meta.url), 'utf8')
const artCompiled = ts.transpileModule(artSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { topicScenes, spreadLayouts } = await import(
  `data:text/javascript;base64,${Buffer.from(artCompiled).toString('base64')}`
)
test('모든 상담 주제에는 서로 다른 삽화가 있으며 배열 그림은 실제 뽑는 장수와 일치한다', () => {
  assert.deepEqual(Object.keys(topicScenes).sort(), tarotTopics.map((item) => item.id).sort())
  assert.equal(
    new Set(Object.values(topicScenes).map((paths) => paths.join(' '))).size,
    tarotTopics.length,
  )
  for (const topic of tarotTopics) {
    assert.ok(topicScenes[topic.id].length > 0)
    for (const path of topicScenes[topic.id]) assert.match(path, /^M/)
  }
  assert.deepEqual(Object.keys(spreadLayouts).sort(), tarotSpreads.map((item) => item.id).sort())
  for (const spread of tarotSpreads) {
    assert.equal(spreadLayouts[spread.id].length, spread.positions.length)
    for (const card of spreadLayouts[spread.id]) {
      const halfWidth = card.rotate ? 18 : 12
      const halfHeight = card.rotate ? 12 : 18
      assert.ok(card.x - halfWidth >= 8 && card.x + halfWidth <= 172)
      assert.ok(card.y - halfHeight >= 7 && card.y + halfHeight <= 183)
    }
  }
})
