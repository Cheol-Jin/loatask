// 전통 타로의 78장 구성을 참고한 창작 해석입니다. 외부 API를 호출하지 않습니다.
export interface TarotCard {
  id: string
  name: string
  subtitle: string
  suit: string
  number: string
  keyword: string
  upright: string
  reversed: string
  action: string
}
export interface TarotTopic {
  id: string
  group: string
  label: string
  angle: string
  reflection: string
  action: string
}
export interface TarotSpread {
  id: string
  label: string
  description: string
  positions: string[]
}
export interface DrawnTarotCard {
  cardId: string
  reversed: boolean
}
export interface TarotReading {
  version: 1
  topicId: string
  spreadId: string
  createdAt: string
  cards: DrawnTarotCard[]
}
export const tarotCards: TarotCard[] = [
  {
    id: 'fool',
    name: '바보',
    subtitle: '새로운 발걸음',
    suit: 'major',
    number: '0',
    keyword: '가능성',
    upright: '작은 호기심을 행동으로 옮기기 좋은 장면입니다.',
    reversed: '충분히 살피기 전에 출발하려는 마음이 앞설 수 있습니다.',
    action: '부담 없는 첫 시도를 하나 정해 보세요.',
  },
  {
    id: 'magician',
    name: '마법사',
    subtitle: '손안의 도구',
    suit: 'major',
    number: '1',
    keyword: '실행',
    upright: '이미 가진 경험과 도구를 연결하면 시작할 실마리가 보입니다.',
    reversed: '준비할 것이 부족하다고 느끼며 시작을 미루고 있을 수 있습니다.',
    action: '지금 쓸 수 있는 자원 세 가지를 적어 보세요.',
  },
  {
    id: 'priestess',
    name: '여사제',
    subtitle: '조용한 직감',
    suit: 'major',
    number: '2',
    keyword: '관찰',
    upright: '급히 결론짓기보다 아직 말로 옮기지 못한 느낌을 살펴볼 때입니다.',
    reversed: '추측과 확인한 사실이 뒤섞여 판단을 흐릴 수 있습니다.',
    action: '아는 사실과 짐작을 나누어 써 보세요.',
  },
  {
    id: 'empress',
    name: '여황제',
    subtitle: '마음을 기르는 정원',
    suit: 'major',
    number: '3',
    keyword: '돌봄',
    upright: '편안한 환경과 꾸준한 돌봄이 힘을 길러 줍니다.',
    reversed: '다른 사람을 돌보느라 자신의 필요를 뒤로 미루고 있을 수 있습니다.',
    action: '나를 편하게 하는 작은 조건 하나를 챙겨 보세요.',
  },
  {
    id: 'emperor',
    name: '황제',
    subtitle: '흔들리지 않는 기준',
    suit: 'major',
    number: '4',
    keyword: '질서',
    upright: '나만의 기준과 지킬 수 있는 약속이 중심을 잡아 줍니다.',
    reversed: '모든 것을 통제하려는 태도가 여유를 줄일 수 있습니다.',
    action: '반드시 지킬 기준과 양보할 부분을 나눠 보세요.',
  },
  {
    id: 'hierophant',
    name: '교황',
    subtitle: '먼저 걸어간 사람',
    suit: 'major',
    number: '5',
    keyword: '배움',
    upright: '경험자의 조언이나 검증된 기본기를 참고할 수 있습니다.',
    reversed: '익숙한 정답을 그대로 따르는 것이 지금도 맞는지 점검할 때입니다.',
    action: '조언을 하나 듣고 내 상황에 맞게 바꿔 보세요.',
  },
  {
    id: 'lovers',
    name: '연인',
    subtitle: '마음이 향하는 쪽',
    suit: 'major',
    number: '6',
    keyword: '가치',
    upright: '중요하게 여기는 가치가 선택의 기준이 될 수 있습니다.',
    reversed: '마음과 행동이 서로 다른 방향을 향하고 있을 수 있습니다.',
    action: '이번 선택에서 지키고 싶은 가치를 한 문장으로 정해 보세요.',
  },
  {
    id: 'chariot',
    name: '전차',
    subtitle: '고삐를 잡는 시간',
    suit: 'major',
    number: '7',
    keyword: '집중',
    upright: '다른 방향으로 끌리는 힘을 한 목표로 모을 때입니다.',
    reversed: '속도를 내느라 방향과 컨디션을 놓치고 있을 수 있습니다.',
    action: '한 번에 달릴 목표를 하나로 줄여 보세요.',
  },
  {
    id: 'strength',
    name: '힘',
    subtitle: '부드러운 용기',
    suit: 'major',
    number: '8',
    keyword: '인내',
    upright: '강하게 밀어붙이기보다 차분함으로 상황을 다룰 수 있습니다.',
    reversed: '자신에게 너무 높은 기준을 요구하고 있을 수 있습니다.',
    action: '잘하지 못한 부분보다 견뎌 낸 부분을 먼저 인정해 보세요.',
  },
  {
    id: 'hermit',
    name: '은둔자',
    subtitle: '작은 등불',
    suit: 'major',
    number: '9',
    keyword: '성찰',
    upright: '혼자 생각을 정리하는 시간이 판단을 또렷하게 합니다.',
    reversed: '정리할 시간을 넘어서 도움받을 통로까지 닫고 있을 수 있습니다.',
    action: '잠깐 혼자 정리한 뒤 믿을 만한 사람 한 명과 나눠 보세요.',
  },
  {
    id: 'wheel',
    name: '운명의 수레바퀴',
    subtitle: '돌아오는 계절',
    suit: 'major',
    number: '10',
    keyword: '흐름',
    upright: '상황이 달라지고 있다는 사실을 인정하면 대응할 여지가 생깁니다.',
    reversed: '통제할 수 없는 일에 힘을 너무 쏟고 있을 수 있습니다.',
    action: '바꿀 수 있는 일 하나에 오늘의 힘을 써 보세요.',
  },
  {
    id: 'justice',
    name: '정의',
    subtitle: '균형을 재는 저울',
    suit: 'major',
    number: '11',
    keyword: '공정',
    upright: '느낌뿐 아니라 사실과 서로의 책임을 함께 살펴볼 때입니다.',
    reversed: '한쪽 관점만으로 자신이나 상대를 판단하고 있을 수 있습니다.',
    action: '확인할 사실과 내가 맡을 책임을 구분해 보세요.',
  },
  {
    id: 'hanged',
    name: '매달린 사람',
    subtitle: '다르게 보는 풍경',
    suit: 'major',
    number: '12',
    keyword: '전환',
    upright: '잠시 멈추면 같은 상황에서도 다른 해석이 보입니다.',
    reversed: '기다림 자체가 해결이라고 생각하며 필요한 행동을 미룰 수 있습니다.',
    action: '관점을 바꿔 보고 기다릴 기한도 정해 보세요.',
  },
  {
    id: 'death',
    name: '죽음',
    subtitle: '다음 장을 여는 문',
    suit: 'major',
    number: '13',
    keyword: '정리',
    upright: '끝내야 할 습관이나 역할을 정리하면 새 공간이 생깁니다.',
    reversed: '익숙하다는 이유로 이미 끝난 방식을 붙들고 있을 수 있습니다.',
    action: '놓아줄 것 하나와 이어갈 것 하나를 적어 보세요.',
  },
  {
    id: 'temperance',
    name: '절제',
    subtitle: '알맞은 온도',
    suit: 'major',
    number: '14',
    keyword: '조율',
    upright: '서로 다른 필요를 조금씩 맞추는 과정에 의미가 있습니다.',
    reversed: '무리한 속도나 한쪽으로 치우친 배분을 돌아볼 때입니다.',
    action: '지금의 리듬을 조금 더 지속 가능한 쪽으로 조절해 보세요.',
  },
  {
    id: 'devil',
    name: '악마',
    subtitle: '묶여 있는 매듭',
    suit: 'major',
    number: '15',
    keyword: '경계',
    upright: '당연한 의무처럼 느끼는 일이 정말 선택 불가능한지 살펴보세요.',
    reversed: '반복되는 패턴을 알아차리면서도 익숙함 때문에 돌아갈 수 있습니다.',
    action: '스스로에게 허용할 작은 경계선을 하나 정해 보세요.',
  },
  {
    id: 'tower',
    name: '탑',
    subtitle: '금이 간 오래된 벽',
    suit: 'major',
    number: '16',
    keyword: '재점검',
    upright: '기존 계획의 빈틈을 발견했다면 다시 세울 기회로 삼을 수 있습니다.',
    reversed: '문제가 보이는데도 계획을 바꾸기 어려워하고 있을 수 있습니다.',
    action: '실패를 예언하지 말고 계획의 취약점 하나를 보완해 보세요.',
  },
  {
    id: 'star',
    name: '별',
    subtitle: '밤하늘의 이정표',
    suit: 'major',
    number: '17',
    keyword: '회복',
    upright: '작지만 믿을 수 있는 희망과 회복의 단서를 찾을 때입니다.',
    reversed: '당장의 성과가 없어 스스로의 가능성을 작게 보고 있을 수 있습니다.',
    action: '다시 해 볼 수 있을 만큼 작은 목표를 정해 보세요.',
  },
  {
    id: 'moon',
    name: '달',
    subtitle: '안개 낀 물가',
    suit: 'major',
    number: '18',
    keyword: '확인',
    upright: '모호한 상황에서는 감정과 확인할 사실을 함께 다뤄야 합니다.',
    reversed: '불안한 상상을 사실처럼 받아들이고 있을 수 있습니다.',
    action: '추측을 늘리기보다 확인할 질문 하나를 골라 보세요.',
  },
  {
    id: 'sun',
    name: '태양',
    subtitle: '햇빛이 드는 자리',
    suit: 'major',
    number: '19',
    keyword: '명료',
    upright: '솔직한 표현과 드러난 작은 성과가 힘을 보탭니다.',
    reversed: '잘한 일을 인정하지 못하거나 밝게 보여야 한다는 부담이 있을 수 있습니다.',
    action: '작은 진전 하나를 구체적으로 인정해 보세요.',
  },
  {
    id: 'judgement',
    name: '심판',
    subtitle: '다시 들려오는 부름',
    suit: 'major',
    number: '20',
    keyword: '재평가',
    upright: '지난 경험을 비난이 아닌 배움의 재료로 볼 수 있습니다.',
    reversed: '과거의 한 장면으로 현재의 나를 단정하고 있을 수 있습니다.',
    action: '그때 배운 점과 지금 바꿀 수 있는 점을 나눠 보세요.',
  },
  {
    id: 'world',
    name: '세계',
    subtitle: '이어지는 원',
    suit: 'major',
    number: '21',
    keyword: '완성',
    upright: '한 구간을 마친 경험을 정리하면 다음 방향이 선명해집니다.',
    reversed: '마무리를 미루느라 다음 단계로 넘어갈 여유가 줄 수 있습니다.',
    action: '이번 구간의 완료 기준을 하나 정하고 정리해 보세요.',
  },
  {
    id: 'wands-ace',
    name: '완드 에이스',
    subtitle: '작은 시작',
    suit: 'wands',
    number: '1',
    keyword: '의욕과 실행',
    upright: '하고 싶은 일에 힘을 모으는 모습입니다. 아직 작은 가능성을 직접 시험해 볼 때입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 시작을 너무 크게 잡아 첫 걸음을 어렵게 만들 수 있습니다.',
    action: '오늘 안에 해 볼 수 있는 가장 작은 시도를 정해 보세요.',
  },
  {
    id: 'wands-two',
    name: '완드 2',
    subtitle: '두 가지 균형',
    suit: 'wands',
    number: '2',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 서로 다른 두 필요를 비교하며 균형을 잡을 때입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 두 가지 모두를 놓치지 않으려다 피곤해질 수 있습니다.',
    action: '이번 주에 먼저 챙길 필요를 하나 골라 보세요.',
  },
  {
    id: 'wands-three',
    name: '완드 3',
    subtitle: '함께 만드는 과정',
    suit: 'wands',
    number: '3',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 다른 사람의 시선과 협력이 도움이 되는 구간입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 도움이나 의견을 구하는 일이 부담스러울 수 있습니다.',
    action: '함께 점검해 줄 사람에게 구체적인 질문을 해 보세요.',
  },
  {
    id: 'wands-four',
    name: '완드 4',
    subtitle: '쉬어 갈 기반',
    suit: 'wands',
    number: '4',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 안정된 기반과 잠깐의 휴식이 다음 움직임을 받쳐 줍니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 안정을 지키려다 새로운 가능성까지 닫을 수 있습니다.',
    action: '유지할 것과 작게 바꿀 것을 각각 정해 보세요.',
  },
  {
    id: 'wands-five',
    name: '완드 5',
    subtitle: '다름을 마주하기',
    suit: 'wands',
    number: '5',
    keyword: '의욕과 실행',
    upright: '하고 싶은 일에 힘을 모으는 모습입니다. 차이나 불편함을 구체적으로 알아볼 때입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 불편함을 덮어 두거나 필요 이상으로 크게 보고 있을 수 있습니다.',
    action: '엇갈린 지점을 하나씩 사실로 정리해 보세요.',
  },
  {
    id: 'wands-six',
    name: '완드 6',
    subtitle: '주고받는 마음',
    suit: 'wands',
    number: '6',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 도움과 인정이 오가는 방식을 돌아볼 수 있습니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 주고받는 무게가 한쪽에 쏠려 있을 수 있습니다.',
    action: '감사할 일과 요청할 도움을 각각 하나 떠올려 보세요.',
  },
  {
    id: 'wands-seven',
    name: '완드 7',
    subtitle: '나의 기준',
    suit: 'wands',
    number: '7',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 여러 가능성 속에서도 나만의 기준을 지키는 연습입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 많은 선택지를 계속 비교하느라 결정을 미루고 있을 수 있습니다.',
    action: '비교에 쓸 기준을 두 개만 남겨 보세요.',
  },
  {
    id: 'wands-eight',
    name: '완드 8',
    subtitle: '차곡차곡의 힘',
    suit: 'wands',
    number: '8',
    keyword: '의욕과 실행',
    upright: '하고 싶은 일에 힘을 모으는 모습입니다. 작은 반복과 꾸준한 점검이 변화를 만듭니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 반복이 목적이 되어 필요한 조정을 놓칠 수 있습니다.',
    action: '반복 중인 행동 하나의 효과를 확인해 보세요.',
  },
  {
    id: 'wands-nine',
    name: '완드 9',
    subtitle: '쌓아 온 경험',
    suit: 'wands',
    number: '9',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 지금까지 쌓은 경험과 지켜 낸 것을 확인할 때입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 마지막 한 걸음에 대한 부담으로 자신을 몰아붙일 수 있습니다.',
    action: '이미 해낸 것 세 가지를 적고 다음 한 걸음만 정해 보세요.',
  },
  {
    id: 'wands-ten',
    name: '완드 10',
    subtitle: '한 구간의 끝',
    suit: 'wands',
    number: '10',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 성과와 책임을 정리하며 다음 구간을 준비할 때입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 맡은 것을 모두 혼자 끝내야 한다고 느낄 수 있습니다.',
    action: '완료할 일과 나눠 맡을 일을 구분해 보세요.',
  },
  {
    id: 'wands-page',
    name: '완드 페이지',
    subtitle: '배우는 사람',
    suit: 'wands',
    number: '11',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 익숙하지 않은 것을 가볍게 탐색할 여지가 있습니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 미숙함을 감추느라 배울 기회를 놓칠 수 있습니다.',
    action: '모르는 점 하나를 솔직하게 질문해 보세요.',
  },
  {
    id: 'wands-knight',
    name: '완드 나이트',
    subtitle: '움직이는 사람',
    suit: 'wands',
    number: '12',
    keyword: '의욕과 실행',
    upright: '하고 싶은 일에 힘을 모으는 모습입니다. 생각을 구체적인 행동으로 옮기는 단계입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 성급한 행동과 지나친 망설임 사이를 오갈 수 있습니다.',
    action: '행동 전에 확인할 조건을 하나만 정해 보세요.',
  },
  {
    id: 'wands-queen',
    name: '완드 퀸',
    subtitle: '돌보는 사람',
    suit: 'wands',
    number: '13',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 상황을 세심하게 읽고 자신과 타인을 배려할 수 있습니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 배려가 자신의 필요를 지우는 방식이 될 수 있습니다.',
    action: '내가 지킬 여유도 함께 포함해 계획해 보세요.',
  },
  {
    id: 'wands-king',
    name: '완드 킹',
    subtitle: '책임지는 사람',
    suit: 'wands',
    number: '14',
    keyword: '의욕과 실행',
    upright:
      '하고 싶은 일에 힘을 모으는 모습입니다. 경험을 바탕으로 방향을 정하고 책임을 나눌 때입니다.',
    reversed:
      '의욕이 분산되거나 속도가 부담이 될 수 있습니다. 정답을 혼자 내야 한다는 부담이 생길 수 있습니다.',
    action: '결정의 근거를 설명하고 다른 의견도 받아 보세요.',
  },
  {
    id: 'cups-ace',
    name: '컵 에이스',
    subtitle: '작은 시작',
    suit: 'cups',
    number: '1',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 아직 작은 가능성을 직접 시험해 볼 때입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 시작을 너무 크게 잡아 첫 걸음을 어렵게 만들 수 있습니다.',
    action: '오늘 안에 해 볼 수 있는 가장 작은 시도를 정해 보세요.',
  },
  {
    id: 'cups-two',
    name: '컵 2',
    subtitle: '두 가지 균형',
    suit: 'cups',
    number: '2',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 서로 다른 두 필요를 비교하며 균형을 잡을 때입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 두 가지 모두를 놓치지 않으려다 피곤해질 수 있습니다.',
    action: '이번 주에 먼저 챙길 필요를 하나 골라 보세요.',
  },
  {
    id: 'cups-three',
    name: '컵 3',
    subtitle: '함께 만드는 과정',
    suit: 'cups',
    number: '3',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 다른 사람의 시선과 협력이 도움이 되는 구간입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 도움이나 의견을 구하는 일이 부담스러울 수 있습니다.',
    action: '함께 점검해 줄 사람에게 구체적인 질문을 해 보세요.',
  },
  {
    id: 'cups-four',
    name: '컵 4',
    subtitle: '쉬어 갈 기반',
    suit: 'cups',
    number: '4',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 안정된 기반과 잠깐의 휴식이 다음 움직임을 받쳐 줍니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 안정을 지키려다 새로운 가능성까지 닫을 수 있습니다.',
    action: '유지할 것과 작게 바꿀 것을 각각 정해 보세요.',
  },
  {
    id: 'cups-five',
    name: '컵 5',
    subtitle: '다름을 마주하기',
    suit: 'cups',
    number: '5',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 차이나 불편함을 구체적으로 알아볼 때입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 불편함을 덮어 두거나 필요 이상으로 크게 보고 있을 수 있습니다.',
    action: '엇갈린 지점을 하나씩 사실로 정리해 보세요.',
  },
  {
    id: 'cups-six',
    name: '컵 6',
    subtitle: '주고받는 마음',
    suit: 'cups',
    number: '6',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 도움과 인정이 오가는 방식을 돌아볼 수 있습니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 주고받는 무게가 한쪽에 쏠려 있을 수 있습니다.',
    action: '감사할 일과 요청할 도움을 각각 하나 떠올려 보세요.',
  },
  {
    id: 'cups-seven',
    name: '컵 7',
    subtitle: '나의 기준',
    suit: 'cups',
    number: '7',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 여러 가능성 속에서도 나만의 기준을 지키는 연습입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 많은 선택지를 계속 비교하느라 결정을 미루고 있을 수 있습니다.',
    action: '비교에 쓸 기준을 두 개만 남겨 보세요.',
  },
  {
    id: 'cups-eight',
    name: '컵 8',
    subtitle: '차곡차곡의 힘',
    suit: 'cups',
    number: '8',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 작은 반복과 꾸준한 점검이 변화를 만듭니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 반복이 목적이 되어 필요한 조정을 놓칠 수 있습니다.',
    action: '반복 중인 행동 하나의 효과를 확인해 보세요.',
  },
  {
    id: 'cups-nine',
    name: '컵 9',
    subtitle: '쌓아 온 경험',
    suit: 'cups',
    number: '9',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 지금까지 쌓은 경험과 지켜 낸 것을 확인할 때입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 마지막 한 걸음에 대한 부담으로 자신을 몰아붙일 수 있습니다.',
    action: '이미 해낸 것 세 가지를 적고 다음 한 걸음만 정해 보세요.',
  },
  {
    id: 'cups-ten',
    name: '컵 10',
    subtitle: '한 구간의 끝',
    suit: 'cups',
    number: '10',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 성과와 책임을 정리하며 다음 구간을 준비할 때입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 맡은 것을 모두 혼자 끝내야 한다고 느낄 수 있습니다.',
    action: '완료할 일과 나눠 맡을 일을 구분해 보세요.',
  },
  {
    id: 'cups-page',
    name: '컵 페이지',
    subtitle: '배우는 사람',
    suit: 'cups',
    number: '11',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 익숙하지 않은 것을 가볍게 탐색할 여지가 있습니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 미숙함을 감추느라 배울 기회를 놓칠 수 있습니다.',
    action: '모르는 점 하나를 솔직하게 질문해 보세요.',
  },
  {
    id: 'cups-knight',
    name: '컵 나이트',
    subtitle: '움직이는 사람',
    suit: 'cups',
    number: '12',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 생각을 구체적인 행동으로 옮기는 단계입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 성급한 행동과 지나친 망설임 사이를 오갈 수 있습니다.',
    action: '행동 전에 확인할 조건을 하나만 정해 보세요.',
  },
  {
    id: 'cups-queen',
    name: '컵 퀸',
    subtitle: '돌보는 사람',
    suit: 'cups',
    number: '13',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 상황을 세심하게 읽고 자신과 타인을 배려할 수 있습니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 배려가 자신의 필요를 지우는 방식이 될 수 있습니다.',
    action: '내가 지킬 여유도 함께 포함해 계획해 보세요.',
  },
  {
    id: 'cups-king',
    name: '컵 킹',
    subtitle: '책임지는 사람',
    suit: 'cups',
    number: '14',
    keyword: '감정과 관계',
    upright:
      '마음을 알아차리고 나누는 과정이 중심입니다. 경험을 바탕으로 방향을 정하고 책임을 나눌 때입니다.',
    reversed:
      '감정을 혼자 짐작하거나 억누르는 모습을 살펴보세요. 정답을 혼자 내야 한다는 부담이 생길 수 있습니다.',
    action: '결정의 근거를 설명하고 다른 의견도 받아 보세요.',
  },
  {
    id: 'swords-ace',
    name: '소드 에이스',
    subtitle: '작은 시작',
    suit: 'swords',
    number: '1',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 아직 작은 가능성을 직접 시험해 볼 때입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 시작을 너무 크게 잡아 첫 걸음을 어렵게 만들 수 있습니다.',
    action: '오늘 안에 해 볼 수 있는 가장 작은 시도를 정해 보세요.',
  },
  {
    id: 'swords-two',
    name: '소드 2',
    subtitle: '두 가지 균형',
    suit: 'swords',
    number: '2',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 서로 다른 두 필요를 비교하며 균형을 잡을 때입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 두 가지 모두를 놓치지 않으려다 피곤해질 수 있습니다.',
    action: '이번 주에 먼저 챙길 필요를 하나 골라 보세요.',
  },
  {
    id: 'swords-three',
    name: '소드 3',
    subtitle: '함께 만드는 과정',
    suit: 'swords',
    number: '3',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 다른 사람의 시선과 협력이 도움이 되는 구간입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 도움이나 의견을 구하는 일이 부담스러울 수 있습니다.',
    action: '함께 점검해 줄 사람에게 구체적인 질문을 해 보세요.',
  },
  {
    id: 'swords-four',
    name: '소드 4',
    subtitle: '쉬어 갈 기반',
    suit: 'swords',
    number: '4',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 안정된 기반과 잠깐의 휴식이 다음 움직임을 받쳐 줍니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 안정을 지키려다 새로운 가능성까지 닫을 수 있습니다.',
    action: '유지할 것과 작게 바꿀 것을 각각 정해 보세요.',
  },
  {
    id: 'swords-five',
    name: '소드 5',
    subtitle: '다름을 마주하기',
    suit: 'swords',
    number: '5',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 차이나 불편함을 구체적으로 알아볼 때입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 불편함을 덮어 두거나 필요 이상으로 크게 보고 있을 수 있습니다.',
    action: '엇갈린 지점을 하나씩 사실로 정리해 보세요.',
  },
  {
    id: 'swords-six',
    name: '소드 6',
    subtitle: '주고받는 마음',
    suit: 'swords',
    number: '6',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 도움과 인정이 오가는 방식을 돌아볼 수 있습니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 주고받는 무게가 한쪽에 쏠려 있을 수 있습니다.',
    action: '감사할 일과 요청할 도움을 각각 하나 떠올려 보세요.',
  },
  {
    id: 'swords-seven',
    name: '소드 7',
    subtitle: '나의 기준',
    suit: 'swords',
    number: '7',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 여러 가능성 속에서도 나만의 기준을 지키는 연습입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 많은 선택지를 계속 비교하느라 결정을 미루고 있을 수 있습니다.',
    action: '비교에 쓸 기준을 두 개만 남겨 보세요.',
  },
  {
    id: 'swords-eight',
    name: '소드 8',
    subtitle: '차곡차곡의 힘',
    suit: 'swords',
    number: '8',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 작은 반복과 꾸준한 점검이 변화를 만듭니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 반복이 목적이 되어 필요한 조정을 놓칠 수 있습니다.',
    action: '반복 중인 행동 하나의 효과를 확인해 보세요.',
  },
  {
    id: 'swords-nine',
    name: '소드 9',
    subtitle: '쌓아 온 경험',
    suit: 'swords',
    number: '9',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 지금까지 쌓은 경험과 지켜 낸 것을 확인할 때입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 마지막 한 걸음에 대한 부담으로 자신을 몰아붙일 수 있습니다.',
    action: '이미 해낸 것 세 가지를 적고 다음 한 걸음만 정해 보세요.',
  },
  {
    id: 'swords-ten',
    name: '소드 10',
    subtitle: '한 구간의 끝',
    suit: 'swords',
    number: '10',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 성과와 책임을 정리하며 다음 구간을 준비할 때입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 맡은 것을 모두 혼자 끝내야 한다고 느낄 수 있습니다.',
    action: '완료할 일과 나눠 맡을 일을 구분해 보세요.',
  },
  {
    id: 'swords-page',
    name: '소드 페이지',
    subtitle: '배우는 사람',
    suit: 'swords',
    number: '11',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 익숙하지 않은 것을 가볍게 탐색할 여지가 있습니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 미숙함을 감추느라 배울 기회를 놓칠 수 있습니다.',
    action: '모르는 점 하나를 솔직하게 질문해 보세요.',
  },
  {
    id: 'swords-knight',
    name: '소드 나이트',
    subtitle: '움직이는 사람',
    suit: 'swords',
    number: '12',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 생각을 구체적인 행동으로 옮기는 단계입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 성급한 행동과 지나친 망설임 사이를 오갈 수 있습니다.',
    action: '행동 전에 확인할 조건을 하나만 정해 보세요.',
  },
  {
    id: 'swords-queen',
    name: '소드 퀸',
    subtitle: '돌보는 사람',
    suit: 'swords',
    number: '13',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 상황을 세심하게 읽고 자신과 타인을 배려할 수 있습니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 배려가 자신의 필요를 지우는 방식이 될 수 있습니다.',
    action: '내가 지킬 여유도 함께 포함해 계획해 보세요.',
  },
  {
    id: 'swords-king',
    name: '소드 킹',
    subtitle: '책임지는 사람',
    suit: 'swords',
    number: '14',
    keyword: '생각과 판단',
    upright:
      '말과 사실을 정리해 판단을 또렷하게 하는 과정입니다. 경험을 바탕으로 방향을 정하고 책임을 나눌 때입니다.',
    reversed:
      '생각이 많아지거나 날 선 표현이 문제를 키울 수 있습니다. 정답을 혼자 내야 한다는 부담이 생길 수 있습니다.',
    action: '결정의 근거를 설명하고 다른 의견도 받아 보세요.',
  },
  {
    id: 'pentacles-ace',
    name: '펜타클 에이스',
    subtitle: '작은 시작',
    suit: 'pentacles',
    number: '1',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 아직 작은 가능성을 직접 시험해 볼 때입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 시작을 너무 크게 잡아 첫 걸음을 어렵게 만들 수 있습니다.',
    action: '오늘 안에 해 볼 수 있는 가장 작은 시도를 정해 보세요.',
  },
  {
    id: 'pentacles-two',
    name: '펜타클 2',
    subtitle: '두 가지 균형',
    suit: 'pentacles',
    number: '2',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 서로 다른 두 필요를 비교하며 균형을 잡을 때입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 두 가지 모두를 놓치지 않으려다 피곤해질 수 있습니다.',
    action: '이번 주에 먼저 챙길 필요를 하나 골라 보세요.',
  },
  {
    id: 'pentacles-three',
    name: '펜타클 3',
    subtitle: '함께 만드는 과정',
    suit: 'pentacles',
    number: '3',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 다른 사람의 시선과 협력이 도움이 되는 구간입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 도움이나 의견을 구하는 일이 부담스러울 수 있습니다.',
    action: '함께 점검해 줄 사람에게 구체적인 질문을 해 보세요.',
  },
  {
    id: 'pentacles-four',
    name: '펜타클 4',
    subtitle: '쉬어 갈 기반',
    suit: 'pentacles',
    number: '4',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 안정된 기반과 잠깐의 휴식이 다음 움직임을 받쳐 줍니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 안정을 지키려다 새로운 가능성까지 닫을 수 있습니다.',
    action: '유지할 것과 작게 바꿀 것을 각각 정해 보세요.',
  },
  {
    id: 'pentacles-five',
    name: '펜타클 5',
    subtitle: '다름을 마주하기',
    suit: 'pentacles',
    number: '5',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 차이나 불편함을 구체적으로 알아볼 때입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 불편함을 덮어 두거나 필요 이상으로 크게 보고 있을 수 있습니다.',
    action: '엇갈린 지점을 하나씩 사실로 정리해 보세요.',
  },
  {
    id: 'pentacles-six',
    name: '펜타클 6',
    subtitle: '주고받는 마음',
    suit: 'pentacles',
    number: '6',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 도움과 인정이 오가는 방식을 돌아볼 수 있습니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 주고받는 무게가 한쪽에 쏠려 있을 수 있습니다.',
    action: '감사할 일과 요청할 도움을 각각 하나 떠올려 보세요.',
  },
  {
    id: 'pentacles-seven',
    name: '펜타클 7',
    subtitle: '나의 기준',
    suit: 'pentacles',
    number: '7',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 여러 가능성 속에서도 나만의 기준을 지키는 연습입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 많은 선택지를 계속 비교하느라 결정을 미루고 있을 수 있습니다.',
    action: '비교에 쓸 기준을 두 개만 남겨 보세요.',
  },
  {
    id: 'pentacles-eight',
    name: '펜타클 8',
    subtitle: '차곡차곡의 힘',
    suit: 'pentacles',
    number: '8',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 작은 반복과 꾸준한 점검이 변화를 만듭니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 반복이 목적이 되어 필요한 조정을 놓칠 수 있습니다.',
    action: '반복 중인 행동 하나의 효과를 확인해 보세요.',
  },
  {
    id: 'pentacles-nine',
    name: '펜타클 9',
    subtitle: '쌓아 온 경험',
    suit: 'pentacles',
    number: '9',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 지금까지 쌓은 경험과 지켜 낸 것을 확인할 때입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 마지막 한 걸음에 대한 부담으로 자신을 몰아붙일 수 있습니다.',
    action: '이미 해낸 것 세 가지를 적고 다음 한 걸음만 정해 보세요.',
  },
  {
    id: 'pentacles-ten',
    name: '펜타클 10',
    subtitle: '한 구간의 끝',
    suit: 'pentacles',
    number: '10',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 성과와 책임을 정리하며 다음 구간을 준비할 때입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 맡은 것을 모두 혼자 끝내야 한다고 느낄 수 있습니다.',
    action: '완료할 일과 나눠 맡을 일을 구분해 보세요.',
  },
  {
    id: 'pentacles-page',
    name: '펜타클 페이지',
    subtitle: '배우는 사람',
    suit: 'pentacles',
    number: '11',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 익숙하지 않은 것을 가볍게 탐색할 여지가 있습니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 미숙함을 감추느라 배울 기회를 놓칠 수 있습니다.',
    action: '모르는 점 하나를 솔직하게 질문해 보세요.',
  },
  {
    id: 'pentacles-knight',
    name: '펜타클 나이트',
    subtitle: '움직이는 사람',
    suit: 'pentacles',
    number: '12',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 생각을 구체적인 행동으로 옮기는 단계입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 성급한 행동과 지나친 망설임 사이를 오갈 수 있습니다.',
    action: '행동 전에 확인할 조건을 하나만 정해 보세요.',
  },
  {
    id: 'pentacles-queen',
    name: '펜타클 퀸',
    subtitle: '돌보는 사람',
    suit: 'pentacles',
    number: '13',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 상황을 세심하게 읽고 자신과 타인을 배려할 수 있습니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 배려가 자신의 필요를 지우는 방식이 될 수 있습니다.',
    action: '내가 지킬 여유도 함께 포함해 계획해 보세요.',
  },
  {
    id: 'pentacles-king',
    name: '펜타클 킹',
    subtitle: '책임지는 사람',
    suit: 'pentacles',
    number: '14',
    keyword: '생활과 꾸준함',
    upright:
      '시간과 자원을 현실적으로 쌓는 과정이 중요합니다. 경험을 바탕으로 방향을 정하고 책임을 나눌 때입니다.',
    reversed:
      '눈앞의 성과에 쫓겨 지속 가능한 배분을 놓칠 수 있습니다. 정답을 혼자 내야 한다는 부담이 생길 수 있습니다.',
    action: '결정의 근거를 설명하고 다른 의견도 받아 보세요.',
  },
]
export const tarotGroups = [
  {
    id: 'love',
    label: '마음과 연애',
  },
  {
    id: 'people',
    label: '관계와 대화',
  },
  {
    id: 'work',
    label: '일과 배움',
  },
  {
    id: 'change',
    label: '선택과 변화',
  },
  {
    id: 'self',
    label: '나의 마음',
  },
  {
    id: 'game',
    label: '아크라시아',
  },
]
export const tarotTopics: TarotTopic[] = [
  {
    id: 'crush',
    group: 'love',
    label: '짝사랑',
    angle: '다가갈 용기와 지켜야 할 거리',
    reflection: '상대의 마음을 추측하기보다 실제로 나눈 대화와 반응을 떠올려 보세요.',
    action: '부담 없는 안부나 공통 관심사로 짧은 대화를 시작해 보세요.',
  },
  {
    id: 'dating',
    group: 'love',
    label: '연애의 온도',
    angle: '익숙해진 관계의 속도와 기대',
    reflection: '나와 상대가 바라는 관계의 속도가 같은지 살펴보세요.',
    action: '고마웠던 일 하나와 바라는 점 하나를 차분히 나눠 보세요.',
  },
  {
    id: 'reunion',
    group: 'love',
    label: '다시 연락할까',
    angle: '연락의 목적과 상대의 경계',
    reflection: '다시 연락하고 싶은 이유가 외로움인지 풀지 못한 이야기인지 구분해 보세요.',
    action: '답을 요구하지 않는 짧은 인사와 연락하지 않을 선택을 함께 생각해 보세요.',
  },
  {
    id: 'breakup',
    group: 'love',
    label: '이별 뒤 마음',
    angle: '끝난 관계 뒤에 남은 내 감정',
    reflection: '지난 관계의 결말이 내 가치 전체를 설명하지는 않는다는 점을 떠올려 보세요.',
    action: '정리하고 싶은 기억 한 가지를 적고 오늘 나를 돌볼 일을 골라 보세요.',
  },
  {
    id: 'friends',
    group: 'people',
    label: '친구 사이',
    angle: '우정 속의 기대와 거리',
    reflection: '내가 기대한 우정과 실제로 합의한 약속을 구분해 보세요.',
    action: '서운했던 장면을 평가 대신 구체적인 상황으로 말해 보세요.',
  },
  {
    id: 'family',
    group: 'people',
    label: '가족과 나',
    angle: '가까운 사이에서 지킬 경계',
    reflection: '가족의 바람과 내가 감당할 수 있는 범위를 따로 생각해 보세요.',
    action: '지킬 수 있는 약속과 어려운 부탁을 한 가지씩 정리해 보세요.',
  },
  {
    id: 'coworker',
    group: 'people',
    label: '동료와의 대화',
    angle: '함께 일할 때 필요한 소통',
    reflection: '사람에 대한 판단보다 역할과 요청이 명확했는지 살펴보세요.',
    action: '업무의 목적과 기한을 짧게 확인하는 대화를 해 보세요.',
  },
  {
    id: 'newpeople',
    group: 'people',
    label: '새로운 인연',
    angle: '처음 만나는 사람 앞의 내 모습',
    reflection: '잘 보이려는 마음 때문에 내 속도를 잃고 있지 않은지 살펴보세요.',
    action: '편안하게 나눌 수 있는 내 관심사 하나를 준비해 보세요.',
  },
  {
    id: 'career',
    group: 'work',
    label: '지금 하는 일',
    angle: '업무의 방향과 소모되는 에너지',
    reflection: '업무 자체의 어려움과 일하는 환경의 어려움을 나눠 보세요.',
    action: '가장 자주 막히는 작업 하나의 조건을 바꿔 보세요.',
  },
  {
    id: 'job',
    group: 'work',
    label: '취업과 이직',
    angle: '다음 역할을 고르는 기준',
    reflection: '회사 이름보다 하고 싶은 일과 필요한 환경을 구체화해 보세요.',
    action: '지원할 역할 하나를 골라 경험과 요구사항을 연결해 보세요.',
  },
  {
    id: 'study',
    group: 'work',
    label: '공부와 시험',
    angle: '배우는 속도와 연습 방법',
    reflection: '오래 앉아 있는 시간보다 무엇을 설명할 수 있게 됐는지 살펴보세요.',
    action: '작은 문제 하나를 풀고 막힌 이유를 한 문장으로 남겨 보세요.',
  },
  {
    id: 'creative',
    group: 'work',
    label: '창작과 프로젝트',
    angle: '생각을 결과물로 옮기는 과정',
    reflection: '완벽한 구상과 직접 확인할 수 있는 작은 결과를 구분해 보세요.',
    action: '오늘 보여 줄 수 있는 가장 작은 초안을 만들어 보세요.',
  },
  {
    id: 'choice',
    group: 'change',
    label: '두 선택 사이',
    angle: 'A와 B를 비교할 나의 기준',
    reflection: '어느 쪽이 정답인지보다 무엇을 얻고 감당할지를 비교해 보세요.',
    action: 'A와 B의 이점과 부담을 같은 기준으로 적어 보세요.',
  },
  {
    id: 'newstart',
    group: 'change',
    label: '새로운 시작',
    angle: '낯선 시작의 기대와 두려움',
    reflection: '준비가 필요한 부분과 시작하며 배울 부분을 구분해 보세요.',
    action: '되돌릴 수 있는 작은 실험으로 먼저 시작해 보세요.',
  },
  {
    id: 'change',
    group: 'change',
    label: '변화가 필요한 때',
    angle: '계속할 것과 바꿀 것',
    reflection: '지금 불편한 이유가 일시적인 피로인지 반복되는 구조인지 살펴보세요.',
    action: '한 번에 바꾸기보다 한 조건만 바꿔 보고 기록해 보세요.',
  },
  {
    id: 'balance',
    group: 'change',
    label: '일상의 균형',
    angle: '할 일과 쉬는 시간의 배분',
    reflection: '모든 역할에 같은 힘을 쓸 필요가 있는지 돌아보세요.',
    action: '이번 주에 덜어낼 일 하나와 비워 둘 시간을 정해 보세요.',
  },
  {
    id: 'confidence',
    group: 'self',
    label: '자신감이 필요할 때',
    angle: '평가보다 확인할 나의 경험',
    reflection: '다른 사람과의 비교와 나의 실제 진전을 구분해 보세요.',
    action: '최근 해낸 일을 크기와 상관없이 세 가지 적어 보세요.',
  },
  {
    id: 'worry',
    group: 'self',
    label: '생각이 많을 때',
    angle: '내가 다룰 수 있는 걱정의 범위',
    reflection: '가능한 일과 이미 일어난 일을 섞어 생각하고 있지 않은지 살펴보세요.',
    action: '지금 확인할 수 있는 사실 하나와 오늘 할 행동 하나를 골라 보세요.',
  },
  {
    id: 'rest',
    group: 'self',
    label: '쉬어 가고 싶을 때',
    angle: '회복에 필요한 나만의 여유',
    reflection: '휴식을 성과를 위한 보상으로만 여기고 있지 않은지 돌아보세요.',
    action: '아무것도 완수하지 않아도 되는 짧은 시간을 마련해 보세요.',
  },
  {
    id: 'habit',
    group: 'self',
    label: '습관을 바꾸고 싶을 때',
    angle: '반복을 만드는 작은 환경',
    reflection: '의지뿐 아니라 행동을 시작하기 쉬운 환경인지 살펴보세요.',
    action: '습관을 2분짜리 행동으로 줄이고 시작할 자리를 정해 보세요.',
  },
  {
    id: 'raid',
    group: 'game',
    label: '레이드 도전',
    angle: '실수에 대한 부담과 연습의 방향',
    reflection: '클리어 여부와 이번 시도에서 배울 패턴을 따로 정해 보세요.',
    action: '공략의 한 패턴을 복기하고 파티에 필요한 질문을 나눠 보세요.',
  },
  {
    id: 'party',
    group: 'game',
    label: '파티와 호흡',
    angle: '함께하는 플레이의 기대와 소통',
    reflection: '내가 바라는 플레이 방식이 파티와 공유됐는지 살펴보세요.',
    action: '시작 전에 목적과 진행 속도를 짧게 맞춰 보세요.',
  },
  {
    id: 'guild',
    group: 'game',
    label: '길드와 사람들',
    angle: '게임 속 관계에서 편안한 거리',
    reflection: '함께해야 한다는 의무와 내가 즐거운 시간을 구분해 보세요.',
    action: '참여할 수 있는 시간과 어려운 부탁을 솔직하게 나눠 보세요.',
  },
  {
    id: 'growth',
    group: 'game',
    label: '성장과 재화',
    angle: '게임 자원을 쓰는 우선순위',
    reflection: '실제 확률을 카드로 판단하지 말고 즐거움과 자원 범위를 기준으로 삼으세요.',
    action: '이번 주 재화 사용 한도와 우선 성장할 한 항목을 정해 보세요.',
  },
]
export const tarotSpreads: TarotSpread[] = [
  {
    id: 'one',
    label: '한 장의 힌트',
    description: '복잡한 마음에 짧은 질문 하나를 남겨요.',
    positions: ['지금 필요한 시선'],
  },
  {
    id: 'mind',
    label: '마음 정리',
    description: '현재 상황에서 작은 행동까지 세 장으로 이어가요.',
    positions: ['지금의 마음', '살펴볼 지점', '작은 행동'],
  },
  {
    id: 'relationship',
    label: '관계의 대화',
    description: '상대의 속마음을 단정하지 않고 대화의 실마리를 찾아요.',
    positions: ['나의 입장', '생각해 볼 다른 입장', '함께 시도할 대화'],
  },
  {
    id: 'choice',
    label: '선택의 갈림길',
    description: '두 선택과 나의 기준을 세 장으로 함께 살펴요.',
    positions: ['선택 A의 관점', '선택 B의 관점', '나의 선택 기준'],
  },
  {
    id: 'path',
    label: '앞으로의 한 걸음',
    description: '현재 상황과 걸림돌을 살펴보고 현실적인 다음 행동을 골라요.',
    positions: ['현재 상황', '살펴볼 걸림돌', '다음 한 걸음'],
  },
  {
    id: 'cross',
    label: '마음의 깊이',
    description: '마음의 바탕과 주변 환경, 이어 갈 실천을 세 장으로 읽어요.',
    positions: ['마음의 바탕', '주변 환경', '이어 갈 실천'],
  },
]

function unitRandom(random: () => number): number {
  const value = random()
  if (!Number.isFinite(value) || value < 0 || value >= 1)
    throw new Error('올바르지 않은 난수입니다.')
  return value
}
export function createTarotDeck(random = Math.random): DrawnTarotCard[] {
  const deck = tarotCards.map((card) => ({ cardId: card.id, reversed: unitRandom(random) < 0.5 }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(unitRandom(random) * (i + 1))
    ;[deck[i], deck[j]] = [deck[j]!, deck[i]!]
  }
  return deck
}
function validReadingLength(value: unknown, length: number): value is TarotReading {
  if (!value || typeof value !== 'object') return false
  const reading = value as Partial<TarotReading>
  const spread = tarotSpreads.find((item) => item.id === reading.spreadId)
  return (
    reading.version === 1 &&
    !!spread &&
    tarotTopics.some((item) => item.id === reading.topicId) &&
    typeof reading.createdAt === 'string' &&
    Number.isFinite(Date.parse(reading.createdAt)) &&
    Array.isArray(reading.cards) &&
    reading.cards.length === length &&
    reading.cards.every(
      (card) =>
        card &&
        typeof card.reversed === 'boolean' &&
        tarotCards.some((item) => item.id === card.cardId),
    ) &&
    new Set(reading.cards.map((card) => card.cardId)).size === reading.cards.length
  )
}
export function validTarotReading(value: unknown): value is TarotReading {
  const spreadId = (value as Partial<TarotReading> | null)?.spreadId
  const spread = tarotSpreads.find((item) => item.id === spreadId)
  return !!spread && validReadingLength(value, spread.positions.length)
}
// 저장된 원본은 덮어쓰지 않고, 바뀐 배열의 의미에 해당하는 카드만 복원합니다.
export function migrateTarotReading(value: unknown): TarotReading | null {
  if (validTarotReading(value)) return value
  const legacy: Record<string, { count: number; indices: number[] }> = {
    choice: { count: 4, indices: [0, 1, 3] },
    path: { count: 5, indices: [0, 2, 4] },
    cross: { count: 10, indices: [2, 7, 9] },
  }
  const spreadId = (value as Partial<TarotReading> | null)?.spreadId
  const old = typeof spreadId === 'string' ? legacy[spreadId] : undefined
  if (!old || !validReadingLength(value, old.count)) return null
  return { ...value, cards: old.indices.map((index) => ({ ...value.cards[index]! })) }
}
const positionQuestions: Record<string, string> = {
  '지금 필요한 시선': '가장 먼저 눈에 들어온 단어를 지금 내 상황과 연결해 보세요.',
  '지금의 마음': '누가 옳은지 판단하기 전에 지금 가장 큰 감정을 하나 골라 보세요.',
  '살펴볼 지점': '이 장면에서 아직 확인하지 않은 조건이나 놓친 필요를 찾아보세요.',
  '작은 행동': '읽은 내용을 오늘 안에 할 수 있는 크기로 줄여 보세요.',
  '나의 입장': '내가 바라는 것과 상대에게 실제로 전한 것을 구분해 보세요.',
  '생각해 볼 다른 입장': '상대의 마음을 단정하지 말고 직접 확인할 질문으로 바꿔 보세요.',
  '함께 시도할 대화': '평가나 추측 대신 함께 확인할 구체적인 장면을 골라 보세요.',
  '선택 A의 관점': 'A를 택할 때 살릴 수 있는 점과 필요한 준비를 생각해 보세요.',
  '선택 B의 관점': 'B도 A와 같은 기준으로 살펴보고 기대와 부담을 적어 보세요.',
  '놓치기 쉬운 조건': '어느 쪽을 선택해도 확인해야 할 제약이나 약속을 찾아보세요.',
  '나의 선택 기준': '이 카드가 강조하는 점을 참고해 감당할 수 있는 선택 기준을 정해 보세요.',
  '현재 상황': '지금 일어난 사실과 바라는 결과를 따로 놓고 살펴보세요.',
  '활용할 강점': '이미 가진 경험 중 지금 다시 써 볼 수 있는 부분을 찾아보세요.',
  '살펴볼 걸림돌': '바꿀 수 있는 조건과 혼자 바꿀 수 없는 조건을 나눠 보세요.',
  '도움받을 자원': '사람, 도구, 시간 가운데 요청하거나 재배치할 자원을 생각해 보세요.',
  '다음 한 걸음': '큰 결론보다 되돌릴 수 있는 다음 시도를 하나 골라 보세요.',
  '현재의 중심': '여러 걱정 중 지금 가장 다루고 싶은 하나를 골라 보세요.',
  '엇갈리는 힘': '동시에 지키고 싶은 두 필요가 충돌하는지 살펴보세요.',
  '마음의 바탕': '반복해서 돌아오는 바람이나 오래 지켜 온 기준을 떠올려 보세요.',
  '지나온 경험': '과거를 현재의 결말로 단정하지 말고 배운 점만 가져와 보세요.',
  '바라는 방향': '다른 사람의 기대를 빼고 내가 원하는 방향을 말로 정리해 보세요.',
  '다음에 살필 장면': '정해진 미래 대신 다음 행동 뒤 확인할 변화를 떠올려 보세요.',
  '나의 태도': '상황을 대하는 방식에서 유지할 점과 덜어낼 점을 찾아보세요.',
  '주변 환경': '내 의지 외에 영향을 주는 일정, 관계, 환경을 확인해 보세요.',
  '기대와 걱정': '기대하는 장면과 두려워하는 장면이 같은 바람에서 나왔는지 살펴보세요.',
  '이어 갈 실천': '전체 해석에서 계속 시도할 수 있는 한 행동을 골라 보세요.',
}

export function readTarotCard(reading: TarotReading, index: number) {
  const topic = tarotTopics.find((item) => item.id === reading.topicId)
  const spread = tarotSpreads.find((item) => item.id === reading.spreadId)
  const drawn = reading.cards[index]
  const card = tarotCards.find((item) => item.id === drawn?.cardId)
  if (!topic || !spread || !drawn || !card || !spread.positions[index])
    throw new Error('해석할 카드를 확인해 주세요.')
  return {
    card,
    reversed: drawn.reversed,
    position: spread.positions[index],
    message: drawn.reversed ? card.reversed : card.upright,
    reflection: `${positionQuestions[spread.positions[index]]} ${topic.label}에 이 질문을 연결해 보세요.`,
    action: card.action,
  }
}
