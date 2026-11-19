export interface CardOrigin {
  left: number
  top: number
  width: number
  height: number
}
export interface RevealMotion {
  finished: Promise<unknown>
  finish: () => void
  cancel: () => void
}

// 애니메이션 이벤트가 발생하지 않는 환경에서도 결과 공개가 멈추지 않습니다.
export function animateTarotReveal(
  flight: HTMLElement,
  flip: HTMLElement,
  origin: CardOrigin | undefined,
  reduceMotion: boolean,
): RevealMotion {
  const animations: Animation[] = []
  const completions: Promise<Animation>[] = []
  function remember(animation: Animation) {
    animations.push(animation)
    completions.push(animation.finished)
  }
  if (!reduceMotion && typeof flight.animate === 'function' && typeof flip.animate === 'function') {
    const target = flight.getBoundingClientRect()
    const dx = origin ? origin.left + origin.width / 2 - target.left - target.width / 2 : 0
    const dy = origin ? origin.top + origin.height / 2 - target.top - target.height / 2 : 30
    const scale = origin && target.width ? Math.min(0.95, origin.width / target.width) : 0.6
    try {
      remember(
        flight.animate(
          [
            {
              transform: `translate(${dx}px, ${dy}px) rotate(-12deg) scale(${scale})`,
              opacity: 0.8,
            },
            { transform: 'translate(0, 0) rotate(5deg) scale(.86)', opacity: 1, offset: 0.62 },
            { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
          ],
          { duration: 1800, easing: 'cubic-bezier(.2,.65,.25,1)' },
        ),
      )
      remember(
        flip.animate(
          [
            { transform: 'rotateY(0deg)' },
            { transform: 'rotateY(0deg)', offset: 0.25 },
            { transform: 'rotateY(180deg)' },
          ],
          { duration: 1800, easing: 'ease-in-out' },
        ),
      )
    } catch {
      // 일부 애니메이션만 지원하더라도 정적인 최종 상태로 진행합니다.
      for (const animation of animations) animation.cancel()
    }
  }
  return {
    finished: Promise.allSettled(completions),
    finish: () => {
      for (const animation of animations) animation.finish()
    },
    cancel: () => {
      for (const animation of animations) animation.cancel()
    },
  }
}
