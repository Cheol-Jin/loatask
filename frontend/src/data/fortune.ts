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
  {
    id: 'seed',
    name: '잠든 씨앗',
    icon: 'mdi-sprout-outline',
    keyword: '성장 · 기다림',
    message: '작아 보이는 가능성에도 자랄 자리가 필요합니다.',
    readings: {
      adventure: '눈에 띄지 않던 수집 목표 하나를 챙겨 보세요. 작은 발견을 쌓는 하루가 어울립니다.',
      raid: '지금 당장 완벽한 플레이를 기대하지 마세요. 익숙하지 않은 패턴을 한 번 더 보는 것도 성장입니다.',
      expedition:
        '당장 쓰지 않을 재료도 목적을 정해 모아 보세요. 쌓이는 자원을 보며 다음 성장 시점을 차분히 정하세요.',
    },
  },
  {
    id: 'sprout',
    name: '돌틈의 새싹',
    icon: 'mdi-sprout-outline',
    keyword: '회복 · 용기',
    message: '어려운 틈에서도 새로운 잎은 올라옵니다.',
    readings: {
      adventure:
        '실패한 활동을 가볍게 다시 시작해 보세요. 지난번과 달리 해볼 한 가지면 충분합니다.',
      raid: '이전 실수 때문에 위축될 필요는 없습니다. 이번 도전에서는 자신 있게 신호를 말해 보세요.',
      expedition:
        '멈춰 둔 성장 목표를 작은 단위로 다시 꺼내 보세요. 이번 주 가능한 분량만 새로 정하세요.',
    },
  },
  {
    id: 'forest',
    name: '속삭이는 숲',
    icon: 'mdi-sprout-outline',
    keyword: '경청 · 단서',
    message: '바쁘게 지나친 곳에 이야기가 남아 있습니다.',
    readings: {
      adventure:
        '퀘스트 대화와 주변 소리를 천천히 따라가 보세요. 보상 외의 즐거움을 발견할 수 있습니다.',
      raid: '다른 파티원의 설명을 끝까지 들어 보세요. 자신이 놓친 시야를 서로 채우는 시간이 됩니다.',
      expedition:
        '함께 플레이하는 사람들의 의견을 물어보세요. 혼자 세운 일정에 좋은 조정점을 찾을 수 있습니다.',
    },
  },
  {
    id: 'dew',
    name: '잎새의 이슬',
    icon: 'mdi-sprout-outline',
    keyword: '정리 · 새 출발',
    message: '흐린 시야를 닦으면 가까운 길부터 보입니다.',
    readings: {
      adventure:
        '가방에서 쓰지 않는 물건을 정리해 보세요. 가벼워진 공간만큼 오늘의 계획도 단순하게 만드세요.',
      raid: '연습 전에 화면과 단축키를 점검해 보세요. 중요한 신호가 잘 보이는 배치가 집중을 돕습니다.',
      expedition:
        '주간 계획에서 이미 끝낸 일을 지워 보세요. 남은 일을 정확히 보면 불필요한 부담이 줄어듭니다.',
    },
  },
  {
    id: 'chest',
    name: '낡은 보물상자',
    icon: 'mdi-sprout-outline',
    keyword: '기억 · 재발견',
    message: '새로운 보물은 오래된 기억 안에도 있습니다.',
    readings: {
      adventure:
        '창고나 오래된 퀘스트 목록을 돌아보세요. 잊었던 목표를 다시 발견하는 재미가 있습니다.',
      raid: '전에 잘 넘겼던 장면을 떠올려 보세요. 성공했던 위치와 움직임을 이번에도 차분히 적용하세요.',
      expedition:
        '원정대 창고의 보유 재료부터 확인하세요. 새로 구하기 전에 이미 가진 것을 활용할 계획을 세우세요.',
    },
  },
  {
    id: 'crystal',
    name: '별빛 결정',
    icon: 'mdi-sprout-outline',
    keyword: '집중 · 선명함',
    message: '흩어진 빛도 한곳에 모이면 밝아집니다.',
    readings: {
      adventure:
        '여러 활동을 동시에 열어두기보다 하나를 마무리해 보세요. 집중하는 시간이 만족을 남깁니다.',
      raid: '오늘은 꼭 익히고 싶은 패턴 하나에 집중하세요. 매 도전 후 달라진 점을 짧게 기록해 보세요.',
      expedition:
        '이번 주 자원을 집중할 캐릭터를 골라 보세요. 선택한 이유를 적으면 충동적인 변경을 줄일 수 있습니다.',
    },
  },
  {
    id: 'feather',
    name: '돌아오는 깃털',
    icon: 'mdi-sprout-outline',
    keyword: '회복 · 다음 기회',
    message: '한 번의 넘어짐이 여행의 끝은 아닙니다.',
    readings: {
      adventure:
        '뜻대로 되지 않은 일에서 잠시 떨어져 보세요. 돌아올 때의 여유를 위해 쉬운 활동을 먼저 즐기세요.',
      raid: '실패 뒤에는 무엇을 바꿀지 한 가지씩 나눠 보세요. 다음 시도까지 마음을 추스를 시간을 주세요.',
      expedition:
        '놓친 하루를 한꺼번에 만회하려 하지 마세요. 남은 일정으로 무리 없이 다시 시작해 보세요.',
    },
  },
  {
    id: 'portal',
    name: '푸른 균열',
    icon: 'mdi-sprout-outline',
    keyword: '전환 · 도전',
    message: '낯선 문은 다른 가능성으로 이어집니다.',
    readings: {
      adventure:
        '평소 선택하지 않던 콘텐츠를 가볍게 살펴보세요. 처음부터 보상까지 모두 챙길 필요는 없습니다.',
      raid: '새로운 공략을 적용한다면 파티와 먼저 상의하세요. 서로 준비된 변화가 좋은 연습이 됩니다.',
      expedition:
        '기존 루틴에 작은 변화를 하나 넣어 보세요. 새로운 캐릭터를 늘리기 전 체험할 시간을 확보하세요.',
    },
  },
  {
    id: 'campfire',
    name: '모닥불 곁',
    icon: 'mdi-sprout-outline',
    keyword: '온기 · 교류',
    message: '긴 여정에는 함께 앉을 자리가 필요합니다.',
    readings: {
      adventure:
        '친구나 길드원에게 먼저 안부를 건네 보세요. 목적 없는 대화가 모험의 좋은 기억이 됩니다.',
      raid: '출발 전에 편하게 대화할 틈을 만들어 보세요. 모르는 점을 묻기 쉬운 분위기가 협력을 돕습니다.',
      expedition:
        '이번 주에는 같이 즐길 시간을 먼저 정해 보세요. 혼자 남은 숙제보다 사람과의 약속을 돌아보세요.',
    },
  },
  {
    id: 'bridge',
    name: '안개 속 다리',
    icon: 'mdi-sprout-outline',
    keyword: '신뢰 · 연결',
    message: '다리를 건너는 동안 서로의 속도를 살펴보세요.',
    readings: {
      adventure:
        '함께하는 사람에게 길을 설명하거나 도움을 구해 보세요. 작은 안내가 다음 만남을 이어줍니다.',
      raid: '서로 맡은 역할을 확인하고 믿고 움직여 보세요. 불안한 부분은 입장 전에 짧게 공유하세요.',
      expedition:
        '여러 캐릭터의 일정을 연결해 생각해 보세요. 이동과 준비 시간을 줄일 수 있는 순서를 찾아보세요.',
    },
  },
  {
    id: 'sail',
    name: '접어 둔 돛',
    icon: 'mdi-sprout-outline',
    keyword: '준비 · 재개',
    message: '바람을 기다리는 시간도 항해의 일부입니다.',
    readings: {
      adventure:
        '오랫동안 미룬 항해를 준비해 보세요. 오늘은 목적지를 정하고 필요한 조건만 확인해도 좋습니다.',
      raid: '연습을 바로 시작하기보다 공략을 먼저 읽을 시간을 주세요. 준비한 만큼 긴장을 덜 수 있습니다.',
      expedition:
        '지금 열리지 않은 목표를 위해 필요한 조건을 정리하세요. 이번 주에 준비할 일과 나중 일을 나누세요.',
    },
  },
  {
    id: 'island',
    name: '이름 없는 섬',
    icon: 'mdi-sprout-outline',
    keyword: '탐색 · 여백',
    message: '아직 이름 붙이지 않은 즐거움이 기다립니다.',
    readings: {
      adventure:
        '지도에서 눈길이 가는 곳을 골라 둘러보세요. 효율표 밖에서 자신의 취향을 찾는 하루를 보내세요.',
      raid: '고정된 방식이 답답하다면 다른 시점의 공략을 읽어 보세요. 새 관찰을 파티와 이야기해 보세요.',
      expedition:
        '새로운 목표를 바로 정하지 않아도 괜찮습니다. 이번 주 가장 즐거운 활동을 살피는 데 시간을 쓰세요.',
    },
  },
  {
    id: 'bell',
    name: '작은 종소리',
    icon: 'mdi-sprout-outline',
    keyword: '신호 · 집중',
    message: '작은 신호를 놓치지 않는 마음이 길을 엽니다.',
    readings: {
      adventure:
        '일정과 안내를 한 번만 차분히 확인하세요. 알림을 계속 살피기보다 정한 활동에 머물러 보세요.',
      raid: '보스의 소리와 동작에서 패턴 신호를 찾아보세요. 익숙한 시각 신호 외의 단서도 활용하세요.',
      expedition:
        '중요한 일정 하나만 알림으로 남겨 보세요. 너무 많은 알림 대신 정말 필요한 약속을 챙기세요.',
    },
  },
  {
    id: 'rune',
    name: '새긴 룬',
    icon: 'mdi-sprout-outline',
    keyword: '이해 · 다듬기',
    message: '나에게 맞는 쓰임을 알 때 힘이 생깁니다.',
    readings: {
      adventure:
        '자주 쓰는 기능 하나의 설정을 살펴보세요. 작은 조정으로 플레이가 더 편안해질 수 있습니다.',
      raid: '스킬과 룬의 선택 이유를 돌아보세요. 다른 사람의 세팅을 따라가기보다 자신의 플레이와 연결하세요.',
      expedition:
        '캐릭터별 세팅을 한 번 정리해 보세요. 급한 교체보다 필요한 이유가 분명한 개선부터 선택하세요.',
    },
  },
  {
    id: 'clock',
    name: '멈춘 모래시계',
    icon: 'mdi-sprout-outline',
    keyword: '속도 · 여유',
    message: '잠시 멈추어도 시간은 적이 되지 않습니다.',
    readings: {
      adventure:
        '한 콘텐츠가 오래 걸리면 마칠 시각을 먼저 정하세요. 남은 시간을 모두 채울 필요는 없습니다.',
      raid: '시도 횟수보다 집중 상태를 살펴보세요. 피로가 쌓이면 잠시 쉬는 편이 다음 연습에 도움이 됩니다.',
      expedition:
        '주간 숙제에 쓸 시간의 상한을 정해 보세요. 계획한 종료 시간을 지키는 것도 중요한 성과입니다.',
    },
  },
  {
    id: 'letter',
    name: '배달되지 않은 편지',
    icon: 'mdi-sprout-outline',
    keyword: '표현 · 배려',
    message: '전하지 않은 마음은 작은 말에서 시작됩니다.',
    readings: {
      adventure:
        '도움을 받은 사람이 떠오르면 고마움을 전해 보세요. 짧은 인사도 오래 남는 연결이 됩니다.',
      raid: '필요한 요청은 혼자 참지 말고 미리 이야기하세요. 명확한 부탁이 서로의 오해를 줄여 줍니다.',
      expedition:
        '함께할 일정이 바뀌면 일찍 알려주세요. 작은 배려가 다음 주의 약속을 편안하게 만듭니다.',
    },
  },
  {
    id: 'flower',
    name: '길가의 꽃',
    icon: 'mdi-sprout-outline',
    keyword: '발견 · 만족',
    message: '목적지로 가는 길에도 머물 이유가 있습니다.',
    readings: {
      adventure:
        '풍경이 마음에 들면 잠깐 멈춰 화면을 남겨 보세요. 오늘의 기록은 보상 목록과 달라도 좋습니다.',
      raid: '잘한 움직임을 서로 한 가지씩 말해 보세요. 실수만 보는 것보다 좋은 습관을 이어가기 쉽습니다.',
      expedition:
        '주간 성과에 즐거웠던 순간도 적어 보세요. 숫자 외의 만족이 다음 모험의 이유가 됩니다.',
    },
  },
  {
    id: 'rain',
    name: '지나가는 소나기',
    icon: 'mdi-sprout-outline',
    keyword: '감정 · 환기',
    message: '불편한 마음도 지나갈 자리가 필요합니다.',
    readings: {
      adventure:
        '원하는 결과가 나오지 않았다면 다른 일을 잠깐 해 보세요. 기분이 가라앉은 뒤 선택을 이어가세요.',
      raid: '연속된 실패를 누군가의 잘못으로만 보지 마세요. 잠시 쉬고 다음 시도에서 맞출 부분을 나누세요.',
      expedition:
        '이번 주 일정이 어긋났다면 계획을 다시 써 보세요. 지난 시간보다 남은 여유를 기준으로 정하세요.',
    },
  },
  {
    id: 'sunrise',
    name: '수평선의 아침',
    icon: 'mdi-sprout-outline',
    keyword: '기대 · 시작',
    message: '새로운 하루는 어제의 결과로 정해지지 않습니다.',
    readings: {
      adventure:
        '어제 남긴 아쉬움 대신 오늘 해보고 싶은 일을 골라 보세요. 작은 목표로 가볍게 출발하세요.',
      raid: '이전 파티와 이번 파티는 다를 수 있습니다. 역할을 새로 확인하고 첫 패턴부터 차분히 맞추세요.',
      expedition:
        '주초의 계획이 무거우면 가장 쉬운 일부터 시작하세요. 하나를 끝낸 기분으로 다음 순서를 정하세요.',
    },
  },
  {
    id: 'book',
    name: '모험의 기록장',
    icon: 'mdi-sprout-outline',
    keyword: '복기 · 축적',
    message: '남겨 둔 한 줄이 다음 길의 표지가 됩니다.',
    readings: {
      adventure:
        '오늘 발견한 장소나 필요한 정보를 한 줄 남겨 보세요. 다음 모험에서 찾기 쉬운 자신만의 기록을 만드세요.',
      raid: '어려웠던 패턴의 안전 위치를 짧게 적어 보세요. 다음 입장 전 읽을 수 있는 분량이면 충분합니다.',
      expedition:
        '이번 주 소비와 목표를 간단히 기록해 보세요. 스스로 지킬 수 있는 계획인지 돌아보는 자료가 됩니다.',
    },
  },
  {
    id: 'lantern',
    name: '손안의 등불',
    icon: 'mdi-sprout-outline',
    keyword: '안내 · 용기',
    message: '멀리 보이지 않아도 다음 한 걸음은 밝힐 수 있습니다.',
    readings: {
      adventure:
        '긴 연속 퀘스트가 부담되면 오늘 할 단계만 정하세요. 작은 진행도 이야기의 일부입니다.',
      raid: '모든 패턴을 외우지 못했어도 맡은 역할부터 확인하세요. 모르는 부분을 말하는 용기를 가져보세요.',
      expedition:
        '원정대 전체보다 이번 주 한 캐릭터의 작은 목표를 정하세요. 완수한 뒤 다음 범위를 넓혀 보세요.',
    },
  },
  {
    id: 'key',
    name: '맞지 않던 열쇠',
    icon: 'mdi-sprout-outline',
    keyword: '관점 · 해법',
    message: '힘을 주기보다 맞는 방향을 먼저 찾아보세요.',
    readings: {
      adventure:
        '막힌 진행 조건을 다시 읽어 보세요. 서두르며 지나친 작은 단서에서 실마리를 찾을 수 있습니다.',
      raid: '반복되는 실수는 움직임의 시작 지점부터 살펴보세요. 같은 시도를 더 빠르게 하기보다 방법을 바꿔 보세요.',
      expedition:
        '자원이 부족하다면 목표 시점을 조정해 보세요. 계획을 늦추는 것도 현재 상황에 맞는 해법입니다.',
    },
  },
  {
    id: 'tree',
    name: '뿌리 깊은 나무',
    icon: 'mdi-sprout-outline',
    keyword: '안정 · 지속',
    message: '성장은 보이지 않는 뿌리에서도 이어집니다.',
    readings: {
      adventure:
        '익숙하고 편안한 활동을 하나 즐겨 보세요. 새로운 도전만이 오늘의 의미를 만드는 것은 아닙니다.',
      raid: '기본 이동과 생존을 안정시키는 데 집중하세요. 익숙한 동작이 어려운 상황에서 힘이 됩니다.',
      expedition:
        '오래 즐길 수 있는 분량인지 주간 루틴을 돌아보세요. 조금 적게 하더라도 편안히 이어 갈 기준을 만드세요.',
    },
  },
  {
    id: 'picnic',
    name: '새싹의 소풍',
    icon: 'mdi-sprout-outline',
    keyword: '즐거움 · 동행',
    message: '잘 놀고 돌아오는 하루도 훌륭한 모험입니다.',
    readings: {
      adventure:
        '목적 없이 좋아하는 장소를 산책해 보세요. 오늘만큼은 효율보다 마음이 가는 풍경을 따라가세요.',
      raid: '출발 전에 파티의 목표가 연습인지 완주인지 맞춰 보세요. 같은 기대를 나누면 과정도 편안해집니다.',
      expedition:
        '이번 주에는 보상과 무관한 놀이를 하나 넣어 보세요. 함께 웃을 시간을 남겨 두는 것도 좋은 계획입니다.',
    },
  },
]

export function shuffleFortuneCards(
  random: () => number = Math.random,
  excludedIds: readonly string[] = [],
): FortuneCard[] {
  const deck = fortuneCards.filter((card) => !excludedIds.includes(card.id))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const current = deck[i]!
    deck[i] = deck[j]!
    deck[j] = current
  }
  return deck
}
