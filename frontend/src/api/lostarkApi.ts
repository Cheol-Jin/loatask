import axios from 'axios'
import type { LostArkCharacter, LostArkProfile } from '@/types/lostark'

const lostarkApi = axios.create({
  baseURL: 'http://localhost:8080/api/lostark',
})

export const getCharacters = async (): Promise<LostArkCharacter[]> => {
  const response = await lostarkApi.get<LostArkCharacter[]>('/characters')
  return response.data
}

export const getCharacterProfile = async (characterName: string): Promise<LostArkProfile> => {
  const response = await lostarkApi.get<LostArkProfile>(
    `/official/characters/${characterName}/profile`,
  )
  return response.data
}
