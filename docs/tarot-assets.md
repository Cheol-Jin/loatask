# 타로 화면 이미지 출처

- `frontend/src/assets/tarot/neria.webp`: Lost Ark 레온하트 네리아 게임 초상화, 원저작자 Smilegate. 자료 확인: https://lostarkcodex.com/kr/npc/11264/ · 원본 파일: https://lostarkcodex.com/icons/freindshipnpc_img_42.webp
- 원본 142×142 이미지. 소개 액자 안에서 제한적으로 표시하며 AI로 다시 그린 이미지가 아님. 화면에도 © Smilegate 표시.
- `night-sky.svg`: 이 프로젝트에서 직접 만든 정적인 별/별자리 배경. 외부 사진·네트워크 호출·애니메이션 없음.
- 기존 TarotArtwork/TarotChoiceArtwork의 SVG 삽화는 프로젝트 창작 그림.

## 네리아 타로 일러스트

- `frontend/src/assets/tarot/neria-card.jpg`: 1024×1536, 내장 image_gen으로 새로 그린 팬 일러스트. 위 레온하트 네리아 초상화를 인물 특징 참고용으로 사용했으며 공식 게임 원화 또는 단순 업스케일본이 아님. 원본 142×142 자료는 참고 출처 보존용으로 유지.
- 그림 안의 글자/번호/서명과 화면의 카드 캡션을 제거. 배경·테두리를 그림에 통합. PNG 생성 원본은 Codex generated_images에 보존하고, 웹에는 같은 해상도의 고품질 JPEG를 사용.
- 프롬프트 요약: “레온하트 네리아의 은빛 긴 머리·푸른 꽃과 깃털 장식·푸른 리본과 옅은 드레스를 유지해 선명한 판타지 타로 일러스트로 다시 그리기. 짙은 자주색 카드 배경, 얇은 금색 이중 사각 테두리와 모난 모서리, 초승달·별·아치 선 장식. 인물 중심 세로 2:3 구성. 글자·숫자·제목·서명·워터마크·부채 없음.”

### 내장 image_gen에 전달한 최종 프롬프트

```text
Use case: style-transfer / identity-preserve. Asset type: a finished portrait-format illustrated tarot card for the right-hand hero of a dark Lost Ark fan website. The input is the character identity reference, Leonhart Neria (NOT Wavestrand Neria). Redraw the low-resolution reference as a crisp high-resolution polished illustration, preserving the recognizable adult woman's face, long straight silver/platinum hair, blue flower-and-feather hair ornament, elegant off-shoulder pale dress and prominent blue bow with turquoise-blue bodice accents. Warm calm welcoming expression, graceful bust/waist-up composition centered on the card, realistic fantasy-game character illustration, finely rendered eyes, hair strands and fabric; no pixelation. Incorporate the background and border into the artwork itself: very dark burgundy/plum charcoal tarot-card ground, thin antique-gold double rectangular frame with angular corner linework, a discreet crescent moon above and a few delicate stars, subtle arched gold linework behind her. Understated, elegant, restrained ornament, like a dark minimal moon-and-chalice tarot deck, not a busy game poster. The card occupies the full canvas, straight-on, no perspective, no surrounding surface or mockup. Portrait ratio about 2:3, sharp detailed high-resolution output. IMPORTANT: absolutely NO text anywhere, no letters, no words, no numerals, no titles, no signatures, no watermark, no labels, no bottom caption. Keep the frame wholly inside the canvas with comfortable margins. No fan, no other characters, no extra hands or unrelated props. This is a newly drawn fan illustration based on the reference, not an official game screenshot.
```
