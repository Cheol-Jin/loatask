export type FortuneTopic = 'adventure' | 'raid' | 'expedition'
export const fortuneTopics: { id: FortuneTopic; label: string; description: string }[] = [
  { id: 'adventure', label: '오늘의 모험', description: '오늘 발걸음을 어디로 옮길까요?' },
  { id: 'raid', label: '레이드 전 한 장', description: '함께하는 전투에 필요한 마음가짐은?' },
  { id: 'expedition', label: '이번 주 원정대', description: '이번 주에는 무엇에 집중할까요?' },
]

export interface FortuneCard {
  id: string
  name: string
  icon: string
  keyword: string
  message: string
  readings: Record<FortuneTopic, string>
}

// 게임의 실제 확률과 무관한 창작 카드와 주제별 해석입니다.
export const fortuneCards: FortuneCard[] = [
  {
    id: 'voyager',
    name: '첫 항해',
    icon: 'mdi-compass-outline',
    keyword: '시작 · 호기심',
    message: '익숙한 항구를 벗어나야 새로운 풍경을 만납니다.',
    readings: {
      adventure:
        '미뤄 두었던 섬이나 퀘스트 하나를 골라 보세요. 모두 끝내기보다 처음 한 걸음을 내딛는 데 의미를 두세요.',
      raid: '새로운 레이드에 도전하고 싶다면 공략의 첫 패턴부터 살펴보세요. 모르는 점을 미리 나누는 것이 좋은 출발입니다.',
      expedition:
        '이번 주 목표는 하나만 새롭게 정해 보세요. 작은 목표를 마무리한 경험이 다음 도전의 바탕이 됩니다.',
    },
  },
  {
    id: 'lighthouse',
    name: '새벽의 등대',
    icon: 'mdi-lighthouse-outline',
    keyword: '방향 · 점검',
    message: '멀리 가기 전에, 지금 향하는 곳을 살펴보세요.',
    readings: {
      adventure:
        '할 일이 많아 보이면 오늘 가장 하고 싶은 활동부터 정해 보세요. 남의 속도보다 자신의 목적지가 중요합니다.',
      raid: '입장 전에 장비와 배틀 아이템을 점검해 보세요. 준비 과정에서 발견한 작은 빈틈이 불필요한 당황을 줄여 줍니다.',
      expedition:
        '원정대의 성장 방향을 돌아볼 시간입니다. 여러 캐릭터에 자원을 나누기 전에 우선순위를 적어 보세요.',
    },
  },
  {
    id: 'shield',
    name: '수호자의 방패',
    icon: 'mdi-shield-outline',
    keyword: '보호 · 여유',
    message: '한 걸음 물러서는 것도 모험의 일부입니다.',
    readings: {
      adventure:
        '피곤하다면 오늘의 숙제를 조금 덜어내도 괜찮습니다. 모험을 오래 즐기려면 쉬어 갈 여유도 필요합니다.',
      raid: '공격할 기회보다 안전한 자리를 먼저 살펴보세요. 살아남아 다음 패턴을 함께 보는 경험을 쌓아 보세요.',
      expedition:
        '일정을 가득 채우기보다 비워 둘 하루를 정해 보세요. 놓친 보상보다 지키고 싶은 즐거움에 집중하세요.',
    },
  },
  {
    id: 'flame',
    name: '꺼지지 않는 불씨',
    icon: 'mdi-fire',
    keyword: '끈기 · 연습',
    message: '작은 반복이 어둠 속에서 길을 밝힙니다.',
    readings: {
      adventure:
        '한 번에 끝내지 못했던 활동에 조금만 더 시간을 써 보세요. 어제보다 익숙해진 부분을 찾아보는 것도 성과입니다.',
      raid: '실수한 패턴 하나만 골라 복기해 보세요. 모든 것을 잘하려 하기보다 같은 실수를 줄이는 연습이 도움이 됩니다.',
      expedition:
        '매일 할 수 있는 작은 목표를 정해 보세요. 무리한 계획보다 이어 갈 수 있는 루틴이 편안합니다.',
    },
  },
  {
    id: 'companion',
    name: '맹세의 동료',
    icon: 'mdi-account-group-outline',
    keyword: '협력 · 대화',
    message: '혼자 풀리지 않던 길이 대화 속에서 열립니다.',
    readings: {
      adventure:
        '길드원이나 친구와 함께할 활동을 찾아보세요. 같은 풍경도 누군가와 나누면 다른 기억이 됩니다.',
      raid: '출발 전에 역할과 신호를 짧게 맞춰 보세요. 실수가 생기면 탓하기보다 다음에 어떻게 맞출지 이야기해 보세요.',
      expedition:
        '함께하는 사람의 일정도 물어보세요. 서로 가능한 시간을 맞추면 숙제에도 여유가 생깁니다.',
    },
  },
  {
    id: 'moon',
    name: '고요한 달',
    icon: 'mdi-moon-waning-crescent',
    keyword: '휴식 · 관찰',
    message: '조용해져야 보이는 신호가 있습니다.',
    readings: {
      adventure:
        '보상을 좇지 않는 산책 같은 플레이를 해 보세요. 음악이나 풍경을 잠깐 감상하는 것도 모험입니다.',
      raid: '연속된 실패로 마음이 급해지면 잠시 쉬어 가세요. 숨을 고른 뒤 눈에 들어오는 패턴이 있는지 살펴보세요.',
      expedition:
        '이번 주에는 쉬는 시간도 일정에 넣어 보세요. 게임을 마친 뒤의 기분을 기준으로 분량을 조절해 보세요.',
    },
  },
  {
    id: 'forge',
    name: '장인의 모루',
    icon: 'mdi-hammer',
    keyword: '기초 · 준비',
    message: '단단한 결과는 보이지 않는 준비에서 시작됩니다.',
    readings: {
      adventure:
        '창고나 장비를 정리하며 다음 모험을 준비해 보세요. 작은 정리가 하고 싶던 일을 시작하기 쉽게 만듭니다.',
      raid: '스킬의 쓰임과 순서를 다시 확인해 보세요. 익숙한 세팅에서도 자신에게 맞게 다듬을 부분이 있을 수 있습니다.',
      expedition:
        '필요한 재료와 보유 자원을 차분히 정리해 보세요. 소비는 미리 정한 범위 안에서 결정하세요.',
    },
  },
  {
    id: 'wind',
    name: '바람의 나침반',
    icon: 'mdi-weather-windy',
    keyword: '변화 · 유연함',
    message: '바람을 바꿀 수 없어도 돛의 방향은 바꿀 수 있습니다.',
    readings: {
      adventure:
        '계획한 활동이 잘 풀리지 않으면 다른 콘텐츠로 기분을 바꿔 보세요. 돌아가는 길에서도 재미를 찾을 수 있습니다.',
      raid: '예상과 다른 상황에서는 잠시 속도를 늦춰 보세요. 파티의 상황을 보고 자리를 조정하는 유연함을 떠올려 보세요.',
      expedition:
        '이번 주 일정에 변화가 생겨도 괜찮습니다. 꼭 해야 할 일과 다음으로 미뤄도 될 일을 나눠 보세요.',
    },
  },
  {
    id: 'star',
    name: '먼 별의 지도',
    icon: 'mdi-star-four-points-outline',
    keyword: '목표 · 시야',
    message: '먼 목표도 오늘의 작은 선택으로 이어집니다.',
    readings: {
      adventure:
        '언젠가 얻고 싶은 수집품이나 이루고 싶은 목표를 떠올려 보세요. 오늘 가능한 한 단계만 골라 시작하세요.',
      raid: '클리어 여부와 별개로 이번 도전에서 배울 것을 정해 보세요. 패턴 하나를 이해하는 것도 다음 도전의 자산입니다.',
      expedition:
        '장기 목표를 주간 단위로 작게 나눠 보세요. 목표에 가까워진 부분을 기록하면 변화를 보기 쉽습니다.',
    },
  },
  {
    id: 'balance',
    name: '균형의 저울',
    icon: 'mdi-scale-balance',
    keyword: '절제 · 선택',
    message: '모든 것을 얻기보다, 중요한 것을 남겨 보세요.',
    readings: {
      adventure:
        '오늘의 시간과 기분에 맞는 활동을 골라 보세요. 다른 사람의 보상 소식에 서두를 필요는 없습니다.',
      raid: '도전할 시간과 쉬어 갈 기준을 미리 정해 보세요. 팀의 집중력을 함께 살피는 것도 중요한 판단입니다.',
      expedition:
        '캐릭터마다 같은 양의 숙제를 할 필요는 없습니다. 즐겁게 할 수 있는 범위로 분량을 조절해 보세요.',
    },
  },
  {
    id: 'gate',
    name: '잊힌 관문',
    icon: 'mdi-gate',
    keyword: '발견 · 재도전',
    message: '닫혀 보이던 문 앞에 새로운 단서가 놓여 있습니다.',
    readings: {
      adventure:
        '오래전에 멈춘 퀘스트를 다시 살펴보세요. 지금은 그때와 다른 시선으로 이야기를 즐길 수 있습니다.',
      raid: '어려웠던 구간을 다른 설명이나 시점으로 살펴보세요. 자신에게 이해하기 쉬운 방식으로 정리해 보세요.',
      expedition:
        '잠시 쉬었던 캐릭터의 재미를 돌아보세요. 다시 시작할지, 더 쉬게 할지는 자신의 흥미를 기준으로 정하세요.',
    },
  },
  {
    id: 'harbor',
    name: '귀환의 항구',
    icon: 'mdi-anchor',
    keyword: '마무리 · 만족',
    message: '돌아와 쉬는 시간까지가 하나의 여행입니다.',
    readings: {
      adventure:
        '오늘 즐거웠던 장면 하나를 떠올려 보세요. 더 해야 한다는 마음 대신 충분히 즐긴 순간에서 마무리해도 좋습니다.',
      raid: '함께한 사람에게 수고했다는 말을 건네 보세요. 결과와 별개로 좋은 마무리는 다음 만남을 편안하게 합니다.',
      expedition:
        '이번 주에 해낸 일을 먼저 돌아보세요. 남은 목록보다 쌓인 경험을 확인하고 다음 주를 가볍게 준비하세요.',
    },
  },
]

export function shuffleFortuneCards(random: () => number = Math.random): FortuneCard[] {
  const deck = [...fortuneCards]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const current = deck[i]!
    deck[i] = deck[j]!
    deck[j] = current
  }
  return deck
}
