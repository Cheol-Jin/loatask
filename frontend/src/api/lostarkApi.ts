import axios from 'axios'
import type { LostArkCharacter, LostArkProfile, CharacterSearchRanking } from '@/types/lostark'

const lostarkApi = axios.create({
  baseURL: 'http://localhost:8080/api/lostark',
  timeout: 20_000,
})

class CharacterProfileError extends Error {}

export const getCharacterErrorMessage = (error: unknown): string => {
  if (error instanceof CharacterProfileError) return error.message

  if (axios.isAxiosError<{ code?: string }>(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return '조회 시간이 초과되었습니다. 잠시 후 다시 검색해 주세요.'
    }
    if (!error.response) {
      return '서버에 연결하지 못했습니다. 인터넷 연결과 백엔드 실행 상태를 확인해 주세요.'
    }
    if (error.response.status === 404) {
      return '캐릭터를 찾을 수 없습니다. 캐릭터명을 확인해 주세요.'
    }
    if (error.response.status === 400) return '캐릭터명을 확인해 주세요.'
    if (error.response.status === 429 || error.response.data?.code === 'LOSTARK_RATE_LIMITED') {
      return '조회 요청이 많습니다. 잠시 후 다시 검색해 주세요.'
    }
    if (error.response.status === 502 || error.response.status === 503) {
      return '공식 API를 이용할 수 없습니다. 잠시 후 다시 검색해 주세요.'
    }
  }

  return '캐릭터 정보를 불러오지 못했습니다. 잠시 후 다시 검색해 주세요.'
}

export const getCharacters = async (): Promise<LostArkCharacter[]> => {
  const response = await lostarkApi.get<LostArkCharacter[]>('/characters')
  return response.data
}

export const getCharacterProfile = async (characterName: string): Promise<LostArkProfile> => {
  const name = characterName.trim()
  if (!name) throw new CharacterProfileError('캐릭터명을 입력해 주세요.')

  const response = await lostarkApi.get<LostArkProfile | null>(
    `/official/characters/${encodeURIComponent(name)}/profile`,
  )
  if (!response.data?.characterName?.trim()) {
    throw new CharacterProfileError('캐릭터를 찾을 수 없습니다. 캐릭터명을 확인해 주세요.')
  }
  return response.data
}

export const getSearchRankings = async (): Promise<CharacterSearchRanking[]> => {
  const response = await lostarkApi.get<CharacterSearchRanking[]>('/search/rankings')
  return response.data
}
