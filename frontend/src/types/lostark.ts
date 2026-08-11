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
  characterImage: string
  expeditionLevel: number
  townName: string
  guildName: string
  serverName: string
  characterName: string
  characterLevel: number
  characterClassName: string
  itemAvgLevel: string
  itemMaxLevel: string | null
}
