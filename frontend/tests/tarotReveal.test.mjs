import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const source = await readFile(new URL('../src/utils/tarotReveal.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { animateTarotReveal } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)
function setup(failSecond = false) {
  const calls = []
  const animations = []
  const element = {
    getBoundingClientRect: () => ({ left: 300, top: 200, width: 200, height: 260 }),
    animate(frames, options) {
      if (failSecond && calls.length === 1) throw new Error('unsupported')
      calls.push({ frames, options })
      let finish, cancel
      const finished = new Promise((resolve, reject) => {
        finish = resolve
        cancel = reject
      })
      const animation = {
        finished,
        finish: () => finish(),
        cancel: () => cancel(new Error('cancelled')),
      }
      animations.push(animation)
      return animation
    },
  }
  return { element, calls, animations }
}
test('동작 줄이기는 이벤트를 기다리지 않고 최종 상태로 진행한다', async () => {
  const { element, calls } = setup()
  const motion = animateTarotReveal(element, element, undefined, true)
  await motion.finished
  motion.finish()
  motion.cancel()
  assert.equal(calls.length, 0)
})
test('애니메이션 API가 없어도 결과 대기가 멈추지 않는다', async () => {
  const motion = animateTarotReveal({}, {}, undefined, false)
  await motion.finished
  motion.cancel()
})
test('선택 위치에서 중앙으로 이동·확대하고 건너뛰기가 두 애니메이션을 끝낸다', async () => {
  const { element, calls } = setup()
  const motion = animateTarotReveal(
    element,
    element,
    { left: 20, top: 30, width: 100, height: 130 },
    false,
  )
  assert.match(calls[0].frames[0].transform, /translate\(-330px, -235px\).*scale\(0.5\)/)
  assert.match(calls[0].frames.at(-1).transform, /scale\(1\)/)
  assert.equal(calls[1].frames.at(-1).transform, 'rotateY(180deg)')
  assert.equal(calls[0].options.duration, 1800)
  motion.finish()
  const result = await motion.finished
  assert.equal(
    result.every((item) => item.status === 'fulfilled'),
    true,
  )
})
test('닫기·화면 이동으로 취소해도 완료 대기가 해제된다', async () => {
  const { element } = setup()
  const motion = animateTarotReveal(element, element, undefined, false)
  motion.cancel()
  assert.equal(
    (await motion.finished).every((item) => item.status === 'rejected'),
    true,
  )
})
test('두 번째 효과 생성 실패도 이미 만든 효과를 정리하고 종료한다', async () => {
  const { element, calls } = setup(true)
  const motion = animateTarotReveal(element, element, undefined, false)
  assert.equal(calls.length, 1)
  assert.equal((await motion.finished)[0].status, 'rejected')
})
