<script setup lang="ts">
import { computed } from 'vue'
import ArmoryItem from '@/components/ArmoryItem.vue'
import type { LostArkArmory } from '@/types/lostark'
import { gradeClass, plainText, tooltipLines } from '@/utils/armory'
const props = defineProps<{ armory: LostArkArmory }>()
const passiveEngravings = computed(() => props.armory.engravings?.arkPassiveEffects ?? [])
const legacyEngravings = computed(() => props.armory.engravings?.effects ?? [])
const gems = computed(() => [...(props.armory.gems?.gems ?? [])].sort((a, b) => a.slot - b.slot))
const cards = computed(() => [...(props.armory.cards?.cards ?? [])].sort((a, b) => a.slot - b.slot))
const cardEffects = computed(
  () => props.armory.cards?.effects?.flatMap((effect) => effect.items ?? []) ?? [],
)
const activeSkills = computed(() => props.armory.skills.filter((skill) => skill.level > 1))
const navigation = [
  ['combat', '전투 특성'],
  ['equipment', '장비'],
  ['engravings', '각인'],
  ['gems', '보석'],
  ['cards', '카드'],
  ['skills', '스킬'],
  ['passive', '아크 패시브'],
]
</script>

<template>
  <nav class="armory-nav" aria-label="상세정보 항목">
    <a v-for="[id, label] in navigation" :key="id" :href="`#${id}`">{{ label }}</a>
  </nav>
  <div class="armory-layout">
    <section id="combat" class="armory-section full-width" aria-labelledby="combat-title">
      <header>
        <h2 id="combat-title">전투 특성</h2>
        <span>공식 전투정보실 기준</span>
      </header>
      <div class="combat-overview">
        <div>
          <span>전투력</span><strong>{{ armory.profile.combatPower || '미제공' }}</strong>
        </div>
        <div>
          <span>사용 스킬 포인트</span
          ><strong
            >{{ armory.profile.usingSkillPoint ?? '—' }} /
            {{ armory.profile.totalSkillPoint ?? '—' }}</strong
          >
        </div>
        <div>
          <span>칭호</span><strong>{{ armory.profile.title || '없음' }}</strong>
        </div>
      </div>
      <dl v-if="armory.profile.stats?.length" class="combat-stats">
        <div v-for="stat in armory.profile.stats" :key="stat.type">
          <dt>{{ stat.type }}</dt>
          <dd>{{ stat.value }}</dd>
        </div>
      </dl>
      <p v-else class="empty">전투 특성 정보가 없습니다.</p>
      <div v-if="armory.profile.tendencies?.length" class="tendencies">
        <span v-for="stat in armory.profile.tendencies" :key="stat.type"
          >{{ stat.type }} <b>{{ stat.point }}</b></span
        >
      </div>
    </section>

    <section id="equipment" class="armory-section" aria-labelledby="equipment-title">
      <header>
        <h2 id="equipment-title">장비 · 장신구</h2>
        <span>{{ armory.equipment.length }}개 장착</span>
      </header>
      <p class="section-note">아이템을 누르면 품질과 상세 옵션을 확인할 수 있습니다.</p>
      <ArmoryItem
        v-for="(item, index) in armory.equipment"
        :key="`${item.type}-${index}`"
        :item="item"
        :label="`${item.type} · ${item.grade || ''}`"
      />
      <p v-if="!armory.equipment.length" class="empty">장착 장비 정보가 없습니다.</p>
    </section>

    <div class="right-column">
      <section id="engravings" class="armory-section" aria-labelledby="engraving-title">
        <header>
          <h2 id="engraving-title">각인</h2>
          <span>{{ passiveEngravings.length ? '아크 패시브 각인' : '적용 중인 효과' }}</span>
        </header>
        <ul v-if="passiveEngravings.length" class="effect-list">
          <li v-for="(effect, index) in passiveEngravings" :key="index">
            <div class="effect-heading">
              <strong :class="gradeClass(effect.grade)">{{ plainText(effect.name) }}</strong
              ><span>{{ effect.grade }} Lv.{{ effect.level }}</span>
            </div>
            <p v-if="effect.abilityStoneLevel != null && effect.abilityStoneLevel > 0">
              어빌리티 스톤 Lv.{{ effect.abilityStoneLevel }}
            </p>
            <p>{{ plainText(effect.description) }}</p>
          </li>
        </ul>
        <ul v-else-if="legacyEngravings.length" class="effect-list">
          <li v-for="(effect, index) in legacyEngravings" :key="index">
            <strong>{{ plainText(effect.name) }}</strong>
            <p>{{ plainText(effect.description) }}</p>
          </li>
        </ul>
        <p v-else class="empty">적용 중인 각인 정보가 없습니다.</p>
      </section>

      <section id="gems" class="armory-section" aria-labelledby="gem-title">
        <header>
          <h2 id="gem-title">보석</h2>
          <span>{{ gems.length }}개 장착</span>
        </header>
        <p v-if="armory.gems?.effects?.description" class="section-note">
          {{ plainText(armory.gems.effects.description) }}
        </p>
        <ArmoryItem
          v-for="gem in gems"
          :key="gem.slot"
          :item="gem"
          :label="`Lv.${gem.level} · ${gem.grade || ''}`"
        >
          <template
            v-for="(skill, index) in armory.gems?.effects?.skills?.filter(
              (entry) => entry.gemSlot === gem.slot,
            ) ?? []"
            :key="index"
          >
            <p>{{ plainText(skill.name) }} {{ plainText(skill.option) }}</p>
            <p v-for="(line, lineIndex) in skill.description ?? []" :key="lineIndex">
              {{ plainText(line) }}
            </p>
          </template>
        </ArmoryItem>
        <p v-if="!gems.length" class="empty">장착한 보석이 없습니다.</p>
      </section>
    </div>

    <section id="cards" class="armory-section full-width" aria-labelledby="card-title">
      <header>
        <h2 id="card-title">카드</h2>
        <span>{{ cards.length }}개 장착</span>
      </header>
      <ul v-if="cards.length" class="card-grid">
        <li v-for="card in cards" :key="card.slot">
          <img v-if="card.icon" :src="card.icon" alt="" loading="lazy" width="72" height="100" />
          <strong :class="gradeClass(card.grade)">{{ plainText(card.name) }}</strong>
          <span>{{ card.awakeCount ?? 0 }} / {{ card.awakeTotal ?? 5 }} 각성</span>
        </li>
      </ul>
      <p v-else class="empty">장착한 카드가 없습니다.</p>
      <ul class="effect-list card-effects">
        <li v-for="(effect, index) in cardEffects" :key="index">
          <strong>{{ plainText(effect.name) }}</strong>
          <p>{{ plainText(effect.description) }}</p>
        </li>
      </ul>
    </section>

    <section id="skills" class="armory-section" aria-labelledby="skill-title">
      <header>
        <h2 id="skill-title">스킬 · 트라이포드</h2>
        <span>Lv.2 이상 {{ activeSkills.length }}개</span>
      </header>
      <p class="section-note">포인트를 투자한 스킬과 선택된 트라이포드를 표시합니다.</p>
      <details v-for="(skill, index) in activeSkills" :key="index" class="skill-row">
        <summary>
          <img
            v-if="skill.icon"
            :src="skill.icon"
            alt=""
            width="36"
            height="36"
            loading="lazy"
          /><strong>{{ plainText(skill.name) }}</strong
          ><span>Lv.{{ skill.level }}</span>
        </summary>
        <div class="skill-description">
          <p v-if="skill.rune">
            룬 ·
            <span :class="gradeClass(skill.rune.grade)"
              >{{ skill.rune.grade }} {{ plainText(skill.rune.name) }}</span
            >
          </p>
          <p
            v-for="(tripod, tierIndex) in skill.tripods?.filter((entry) => entry.selected) ?? []"
            :key="tierIndex"
          >
            {{ tripod.tier }}단계 · {{ plainText(tripod.name) }}
          </p>
          <p v-for="(line, lineIndex) in tooltipLines(skill.tooltip)" :key="`line-${lineIndex}`">
            {{ line }}
          </p>
        </div>
      </details>
      <p v-if="!activeSkills.length" class="empty">포인트를 투자한 스킬 정보가 없습니다.</p>
    </section>

    <section id="passive" class="armory-section" aria-labelledby="passive-title">
      <header>
        <h2 id="passive-title">아크 패시브</h2>
        <span>{{ armory.arkPassive?.active ? '활성' : '비활성 / 미제공' }}</span>
      </header>
      <template v-if="armory.arkPassive?.active">
        <p v-if="armory.arkPassive.title" class="section-note">
          {{ plainText(armory.arkPassive.title) }}
        </p>
        <dl class="passive-points">
          <div v-for="point in armory.arkPassive.points ?? []" :key="point.name">
            <dt>{{ point.name }}</dt>
            <dd>{{ point.value }}</dd>
          </div>
        </dl>
        <ul class="effect-list">
          <li v-for="(effect, index) in armory.arkPassive.effects ?? []" :key="index">
            <strong>{{ plainText(effect.name) }}</strong>
            <p>{{ plainText(effect.description) }}</p>
          </li>
        </ul>
      </template>
      <p v-else class="empty">활성화된 아크 패시브 정보가 없습니다.</p>
    </section>
  </div>
  <p class="armory-footnote">
    Lost Ark Open API 조회 시점의 정보입니다. 게임 내 변경 사항이 반영되기까지 시간이 걸릴 수
    있습니다.
  </p>
</template>

<style scoped>
.armory-nav {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--line);
  background: var(--surface);
  margin: 28px 0 20px;
}
.armory-nav a {
  padding: 14px 20px;
  font-size: 13px;
  color: var(--muted);
}
.armory-nav a:hover,
.armory-nav a:focus-visible {
  color: var(--text);
  background: #242424;
}
.armory-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}
.full-width {
  grid-column: 1 / -1;
}
.armory-section {
  border: 1px solid var(--line);
  background: var(--surface);
  padding: 24px;
  min-width: 0;
  scroll-margin-top: 24px;
}
.armory-section > header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}
h2 {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.4px;
}
header > span,
.section-note {
  font-size: 11px;
  color: var(--muted);
}
.section-note {
  margin-bottom: 18px;
  line-height: 1.7;
}
.combat-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-bottom: 24px;
}
.combat-overview span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
}
.combat-overview strong {
  font-size: 20px;
  font-weight: 500;
}
.combat-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--line);
}
.combat-stats > div,
.passive-points > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  padding: 14px 12px 14px 0;
}
dt {
  color: var(--muted);
}
dd {
  font-variant-numeric: tabular-nums;
}
.tendencies {
  border-top: 1px solid var(--line);
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding-top: 16px;
  color: var(--muted);
  font-size: 12px;
}
.tendencies b {
  color: var(--text);
  margin-left: 8px;
  font-weight: 500;
}
.right-column {
  display: grid;
  gap: 20px;
  min-width: 0;
}
.effect-list {
  list-style: none;
  padding: 0;
}
.effect-list li {
  padding: 14px 0;
  border-top: 1px solid var(--line);
}
.effect-list strong {
  font-size: 13px;
  font-weight: 500;
}
.effect-list p {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.8;
  margin-top: 6px;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.effect-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.effect-heading span {
  font-size: 11px;
  color: var(--muted);
}
.empty {
  padding: 24px 0;
  color: var(--muted);
  font-size: 13px;
}
.card-grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}
.card-grid li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 8px;
  background: #151515;
  border: 1px solid var(--line);
  gap: 8px;
}
.card-grid img {
  object-fit: contain;
}
.card-grid strong {
  font-size: 12px;
  overflow-wrap: anywhere;
}
.card-grid span {
  font-size: 11px;
  color: var(--muted);
}
.card-effects {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
}
.skill-row {
  border-top: 1px solid var(--line);
}
.skill-row summary {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 14px 0;
  list-style: none;
}
.skill-row summary::-webkit-details-marker {
  display: none;
}
.skill-row strong {
  font-size: 13px;
  font-weight: 500;
  flex: 1;
}
.skill-row summary span {
  color: var(--muted);
  font-size: 12px;
}
.skill-description {
  font-size: 12px;
  line-height: 1.8;
  color: var(--muted);
  padding: 0 0 16px 48px;
  overflow-wrap: anywhere;
}
.passive-points {
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;
}
.armory-footnote {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.8;
  margin-top: 20px;
}
.ancient {
  color: #d9cba6;
}
.relic {
  color: #d6a278;
}
.legendary {
  color: #cfb273;
}
.epic {
  color: #b49ac6;
}
.rare {
  color: #93b3cf;
}
@media (max-width: 760px) {
  .armory-layout {
    grid-template-columns: 1fr;
  }
  .armory-section {
    padding: 20px;
  }
  .combat-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .combat-overview {
    grid-template-columns: 1fr;
  }
  .combat-overview > div {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
  }
  .combat-overview strong {
    font-size: 17px;
  }
  .card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .card-effects {
    grid-template-columns: 1fr;
  }
  .armory-nav a {
    padding: 12px 14px;
  }
}
</style>
