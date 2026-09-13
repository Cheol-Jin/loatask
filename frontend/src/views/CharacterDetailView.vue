<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getCharacterProfile } from '@/api/lostarkApi'
import type { LostArkProfile } from '@/types/lostark'

const route = useRoute()

const profile = ref<LostArkProfile | null>(null)

const loading = ref(false)

const loadCharacter = async () => {
  const name = route.params.name as string

  loading.value = true

  try {
    profile.value = await getCharacterProfile(name)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCharacter()
})
</script>

<template>
  <v-main class="page">
    <v-container class="py-10">
      <v-card rounded="xl" class="detail-card">
        <v-card-text v-if="profile" class="pa-10">
          <v-row>
            <v-col cols="12" md="4">
              <v-img :src="profile.characterImage" height="400" cover rounded="xl" />
            </v-col>

            <v-col cols="12" md="8">
              <h1 class="text-h3 font-weight-bold">
                {{ profile.characterName }}
              </h1>

              <v-chip class="mt-3" color="blue">
                {{ profile.characterClassName }}
              </v-chip>

              <v-divider class="my-6" />

              <v-row>
                <v-col cols="6">
                  서버
                  <strong>
                    {{ profile.serverName }}
                  </strong>
                </v-col>

                <v-col cols="6">
                  아이템 레벨
                  <strong>
                    {{ profile.itemAvgLevel }}
                  </strong>
                </v-col>

                <v-col cols="6">
                  원정대 레벨
                  <strong>
                    {{ profile.expeditionLevel }}
                  </strong>
                </v-col>

                <v-col cols="6">
                  길드
                  <strong>
                    {{ profile.guildName || '-' }}
                  </strong>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #0d1117;
}

.detail-card {
  background: rgba(23, 28, 38, 0.94);
  border: 1px solid #263246;
}
</style>
