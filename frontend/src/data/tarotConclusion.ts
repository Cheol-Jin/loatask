import { readTarotCard, tarotTopics, validTarotReading, type TarotReading } from '@/data/tarot'
type Theme = 'action' | 'connection' | 'clarity' | 'balance' | 'change' | 'recovery'
const majorThemes: Record<string, Theme> = {
  fool: 'change',
  magician: 'action',
  priestess: 'clarity',
  empress: 'connection',
  emperor: 'balance',
  hierophant: 'clarity',
  lovers: 'connection',
  chariot: 'action',
  strength: 'recovery',
  hermit: 'clarity',
  wheel: 'change',
  justice: 'balance',
  hanged: 'change',
  death: 'change',
  temperance: 'balance',
  devil: 'balance',
  tower: 'change',
  star: 'recovery',
  moon: 'clarity',
  sun: 'action',
  judgement: 'change',
  world: 'balance',
}
const suitThemes: Record<string, Theme> = {
  wands: 'action',
  cups: 'connection',
  swords: 'clarity',
  pentacles: 'balance',
}
const themes: Record<Theme, { label: string; forward: string; pause: string; mixed: string }> = {
  action: {
    label: '실행',
    forward: '작은 시도를 행동으로 옮겨 보세요',
    pause: '속도보다 시작할 조건을 먼저 갖춰 보세요',
    mixed: '확인할 것은 확인하고 작게 움직여 보세요',
  },
  connection: {
    label: '관계와 소통',
    forward: '마음을 나누는 대화에서 실마리를 찾아보세요',
    pause: '상대의 반응보다 내 마음과 경계를 먼저 살펴보세요',
    mixed: '기대와 실제로 나눈 말을 구분해 대화해 보세요',
  },
  clarity: {
    label: '사실과 판단',
    forward: '확인한 사실을 기준으로 방향을 정해 보세요',
    pause: '생각을 늘리기보다 사실 한 가지를 먼저 확인해 보세요',
    mixed: '직감과 사실을 구분한 뒤 판단해 보세요',
  },
  balance: {
    label: '현실적인 균형',
    forward: '지속할 수 있는 범위를 정하고 차근차근 쌓아 보세요',
    pause: '더 채우기 전에 부담과 자원의 배분을 조정해 보세요',
    mixed: '원하는 것과 감당할 수 있는 범위를 맞춰 보세요',
  },
  change: {
    label: '변화와 전환',
    forward: '지금의 변화를 작은 전환의 계기로 삼아 보세요',
    pause: '한 번에 뒤집기보다 끝낼 것과 남길 것을 정리해 보세요',
    mixed: '바꿀 부분 하나를 정하고 나머지는 지켜보세요',
  },
  recovery: {
    label: '회복과 여유',
    forward: '회복한 힘을 믿고 나의 속도로 이어가 보세요',
    pause: '스스로를 밀어붙이기보다 회복할 자리를 먼저 마련해 보세요',
    mixed: '쉬는 시간과 이어 갈 행동을 함께 계획해 보세요',
  },
}
const bridges: Record<string, string> = {
  'action,clarity':
    '움직이고 싶은 마음과 신중히 확인하려는 마음이 함께 보입니다. 사실 하나를 확인한 뒤 작은 시도를 해 보는 순서가 어울립니다.',
  'action,balance':
    '추진력과 현실적인 자원 배분이 함께 중요합니다. 의욕만으로 밀기보다 감당할 범위를 정해 실행해 보세요.',
  'clarity,connection':
    '관계에서 느끼는 감정과 머릿속 해석이 함께 나타납니다. 상대를 추측하기보다 직접 확인할 질문으로 바꿔 보세요.',
  'change,recovery':
    '변화를 원하는 마음과 회복이 필요한 마음이 함께 있습니다. 먼저 여유를 확보하고 바꿀 부분 하나를 고르는 흐름으로 읽을 수 있습니다.',
  'balance,connection':
    '사람을 향한 마음과 현실적인 경계가 함께 중요합니다. 배려할 수 있는 범위와 나의 필요를 같이 말해 보세요.',
}
export function summarizeTarotReading(reading: TarotReading) {
  if (!validTarotReading(reading)) throw new Error('완료된 상담만 종합할 수 있습니다.')
  const topic = tarotTopics.find((item) => item.id === reading.topicId)!
  const items = reading.cards.map((_, index) => readTarotCard(reading, index))
  const signals = items.map((item) => majorThemes[item.card.id] ?? suitThemes[item.card.suit]!)
  const scores = new Map<Theme, number>()
  signals.forEach((theme, index) =>
    scores.set(theme, (scores.get(theme) ?? 0) + (index === signals.length - 1 ? 2 : 1)),
  )
  const ordered = [...scores.keys()].sort(
    (a, b) => scores.get(b)! - scores.get(a)! || signals.lastIndexOf(b) - signals.lastIndexOf(a),
  )
  const dominant = ordered[0]!
  const reversed = items.filter((item) => item.reversed).length
  const tone =
    reversed === 0 ? 'forward' : reversed >= Math.ceil(items.length / 2) ? 'pause' : 'mixed'
  const pair = ordered.slice(0, 2).sort().join(',')
  const connection =
    items.length === 1
      ? `한 장의 핵심은 ‘${items[0]!.card.keyword}’입니다. ${items[0]!.message}`
      : ordered.length === 1
        ? `고른 카드들이 ‘${themes[dominant].label}’라는 공통 주제를 반복합니다. 서로 다른 위치의 카드가 같은 방향을 강조하므로 이 부분을 상담의 중심으로 읽었습니다.`
        : (bridges[pair] ??
          `‘${themes[ordered[0]!].label}’와 ‘${themes[ordered[1]!].label}’가 함께 나타납니다. 한쪽에만 힘을 쏟기보다 두 필요를 조율하는 것이 이번 조합의 중심입니다.`)
  const journey =
    items.length > 1
      ? items
          .map(
            (item, index) =>
              `${index === 0 ? '먼저' : index === items.length - 1 ? '마지막으로' : '그다음'} ${item.position}에 나온 ‘${item.card.name}’ 카드는 ‘${item.card.subtitle}’${item.reversed ? '에서 조정할 부분' : '을 활용할 가능성'}을 보여줍니다.`,
          )
          .join(' ')
      : ''
  const pace =
    tone === 'forward'
      ? '정방향이 이어져 각 카드의 자원을 작게 활용해 보는 흐름으로 읽었습니다.'
      : tone === 'pause'
        ? '역방향이 절반 이상이라 결과를 서두르기보다 걸리는 조건을 먼저 조정하는 결론으로 읽었습니다. 실패가 정해졌다는 뜻은 아닙니다.'
        : '정방향과 역방향이 섞여 있어 활용할 힘과 조정할 부분을 함께 보는 결론입니다.'
  const last = items.at(-1)!
  return {
    headline: themes[dominant][tone],
    message: `${topic.label}에 관해서는 ${topic.reflection} ${connection}`,
    journey,
    reasoning: pace,
    evidence: items.map((item) => ({
      name: item.card.name,
      position: item.position,
      direction: item.reversed ? '역방향' : '정방향',
      keyword: item.card.keyword,
    })),
    nextStep: `${last.position}에 놓인 ‘${last.card.name}’${last.reversed ? '의 역방향은 속도를 조절할 여지에 주목하게 합니다.' : '의 정방향은 지금 활용할 수 있는 힘에 주목하게 합니다.'} ${last.card.action}`,
    topicAction: topic.action,
    theme: dominant,
    tone,
  }
}
