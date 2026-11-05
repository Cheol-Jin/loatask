import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
const source = await readFile(new URL('../src/utils/armory.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { plainText, tooltipLines, equipmentQuality } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
)

test('HTML 설명을 실행하지 않고 읽을 수 있는 텍스트로 변환한다', () => {
  assert.equal(
    plainText('<font color="#fff">장비 &amp; 옵션</font><br>피해 &#43;10%'),
    '장비 & 옵션\n피해 +10%',
  )
  assert.equal(plainText('<script>alert(1)</script><img src=x onerror=alert(1)>원한'), '원한')
  assert.equal(plainText(null), '')
})
test('중첩 툴팁에서 표시할 설명만 추출하고 순서를 유지한다', () => {
  const tooltip = JSON.stringify({
    Element_0: { type: 'NameTagBox', value: '<font>무기</font>' },
    Element_1: {
      type: 'ItemTitle',
      value: {
        qualityValue: 0,
        leftStr0: '아이템 레벨 1700',
        iconPath: 'https://example.com/icon',
      },
    },
    Element_2: {
      type: 'ItemPartBox',
      value: { Element_000: '추가 효과', Element_001: '<font>공격력 +10</font>' },
    },
  })
  assert.deepEqual(tooltipLines(tooltip), ['무기', '아이템 레벨 1700', '추가 효과', '공격력 +10'])
  assert.equal(equipmentQuality(tooltip), 0)
})
test('정보가 없거나 손상된 툴팁과 품질 범위 밖의 값을 처리한다', () => {
  assert.deepEqual(tooltipLines(null), [])
  assert.deepEqual(tooltipLines('<font>설명</font>'), ['설명'])
  assert.equal(equipmentQuality('not-json'), null)
  assert.equal(equipmentQuality('{"qualityValue":-1}'), null)
  assert.equal(equipmentQuality('{"qualityValue":101}'), null)
  assert.equal(equipmentQuality('{"qualityValue":100}'), 100)
})
