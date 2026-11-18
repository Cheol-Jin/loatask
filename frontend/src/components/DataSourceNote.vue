<script setup lang="ts">
import { computed } from 'vue'
import { dataSourceTime, type DataSource } from '@/utils/dataSource'
const props = defineProps<{ source?: DataSource }>()
const time = computed(() => dataSourceTime(props.source?.updatedAt))
</script>

<template>
  <p v-if="source && time" class="data-source" :class="{ stale: source.stale }" role="status">
    <span v-if="source.stale">이전에 확인한 정보입니다. 최신 정보와 다를 수 있습니다. </span>
    마지막 확인: {{ time }} (한국 시간)
  </p>
</template>

<style scoped>
.data-source {
  font-size: 12px;
  line-height: 1.8;
  margin: 12px 0;
  color: var(--muted);
}
.stale {
  color: var(--accent);
  border-left: 2px solid var(--accent);
  padding-left: 12px;
}
</style>
