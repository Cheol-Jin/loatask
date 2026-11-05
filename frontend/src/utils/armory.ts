// 공식 툴팁의 HTML은 실행하지 않고 텍스트로만 표시합니다.
export function plainText(value: string | null | undefined): string {
  const entities: Record<string, string> = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
  }
  return (value ?? '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<br\s*\/?\s*>|<\/(?:p|div|li|tr)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity: string) => {
      if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? match
      const code =
        entity[1]?.toLowerCase() === 'x'
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ''
    })
    .replace(/[^\S\n]+/g, ' ')
    .trim()
}

export function tooltipLines(tooltip: string | null | undefined): string[] {
  if (!tooltip) return []
  let data: unknown
  try {
    data = JSON.parse(tooltip)
  } catch {
    return plainText(tooltip).split('\n').filter(Boolean)
  }
  const lines: string[] = []
  function visit(value: unknown, depth = 0) {
    if (depth > 12 || lines.length >= 200) return
    if (typeof value === 'string') {
      lines.push(
        ...plainText(value)
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      )
    } else if (Array.isArray(value)) {
      value.forEach((entry) => visit(entry, depth + 1))
    } else if (value && typeof value === 'object') {
      for (const [key, entry] of Object.entries(value)) {
        if (!['type', 'iconPath', 'icon', 'qualityValue', 'tagIndex', 'bPoint'].includes(key))
          visit(entry, depth + 1)
      }
    }
  }
  visit(data)
  return [...new Set(lines)].slice(0, 200)
}

export function equipmentQuality(tooltip: string | null | undefined): number | null {
  if (!tooltip) return null
  try {
    function find(value: unknown, depth = 0): number | null {
      if (!value || typeof value !== 'object' || depth > 12) return null
      const record = value as Record<string, unknown>
      const quality = record.qualityValue
      if (typeof quality === 'number' && quality >= 0 && quality <= 100) return quality
      for (const nested of Object.values(record)) {
        const result = find(nested, depth + 1)
        if (result !== null) return result
      }
      return null
    }
    return find(JSON.parse(tooltip))
  } catch {
    return null
  }
}

export function gradeClass(grade: string | null | undefined): string {
  return (
    (
      { 고대: 'ancient', 유물: 'relic', 전설: 'legendary', 영웅: 'epic', 희귀: 'rare' } as Record<
        string,
        string
      >
    )[grade ?? ''] ?? ''
  )
}
