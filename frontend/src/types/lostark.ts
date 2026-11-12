export interface LostArkCharacter {
  id: number
  characterName: string
  jobName: string
  itemLevel: number
  serverName: string
  characterImage: string
  expeditionLevel: number
}

export interface LostArkProfile {
  characterImage: string | null
  expeditionLevel: number | null
  townName: string | null
  guildName: string | null
  serverName: string
  characterName: string
  characterLevel: number
  characterClassName: string
  itemAvgLevel: string
  itemMaxLevel: string | null
  combatPower: string | null
  title: string | null
  usingSkillPoint: number | null
  totalSkillPoint: number | null
  stats: { type: string; value: string; tooltip: string[] | null }[] | null
  tendencies: { type: string; point: number; maxPoint: number }[] | null
}

export interface ArmoryItem {
  name: string
  icon: string | null
  grade: string | null
  tooltip: string | null
}
export interface ArmoryEffect {
  name: string
  description: string | null
}
export interface LostArkArmory {
  profile: LostArkProfile
  equipment: (ArmoryItem & { type: string })[]
  engravings: {
    effects: (ArmoryEffect & { icon: string | null })[] | null
    arkPassiveEffects:
      | (ArmoryEffect & {
          grade: string
          level: number
          abilityStoneLevel: number | null
        })[]
      | null
  } | null
  gems: {
    gems: (ArmoryItem & { slot: number; level: number })[] | null
    effects: {
      description: string | null
      skills:
        | { gemSlot: number; name: string; description: string[] | null; option: string | null }[]
        | null
    } | null
  } | null
  cards: {
    cards:
      | (Omit<ArmoryItem, 'tooltip'> & { slot: number; awakeCount: number; awakeTotal: number })[]
      | null
    effects: { items: ArmoryEffect[] | null }[] | null
  } | null
  skills: {
    name: string
    icon: string | null
    level: number
    tooltip: string | null
    tripods: { tier: number; name: string; selected: boolean }[] | null
    rune: { name: string; grade: string } | null
  }[]
  arkPassive: {
    active: boolean
    title: string | null
    points: { name: string; value: number }[] | null
    effects: ArmoryEffect[] | null
  } | null
}

export interface CharacterSearchRanking {
  characterName: string
  searchCount: number
}

export interface LostArkSibling {
  serverName: string
  characterName: string
  characterLevel: number | null
  characterClassName: string | null
  itemAvgLevel: string | null
}
