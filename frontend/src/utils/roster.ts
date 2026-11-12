import type { LostArkSibling } from '@/types/lostark'

export function rosterItemLevel(value: string | null): number {
  if (!value?.trim()) return -1
  const parsed = Number(value.replaceAll(',', ''))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : -1
}

export function rosterServers(roster: LostArkSibling[], currentServer: string): string[] {
  return [...new Set([currentServer, ...roster.map((item) => item.serverName)])]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'ko'))
}

export function sortedRoster(roster: LostArkSibling[], server: string): LostArkSibling[] {
  return roster
    .filter((item) => !server || item.serverName === server)
    .sort(
      (a, b) =>
        rosterItemLevel(b.itemAvgLevel) - rosterItemLevel(a.itemAvgLevel) ||
        a.characterName.localeCompare(b.characterName, 'ko'),
    )
}
