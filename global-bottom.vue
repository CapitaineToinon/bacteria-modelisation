<script setup lang="ts">
import { useNav } from "@slidev/client"
const { currentLayout, currentPage, total } = useNav()
</script>

<template>
  <footer
    v-if="currentLayout !== 'cover'"
    class="text-xs"
  >
    <div class="abs-b mb-2 mx-6 flex items-center justify-between">
      <div class="w-1/3 text-left">A. Sutter &amp; T. Cavagna</div>
      <div class="w-1/3 text-center">Multi-Agents System</div>
      <div class="w-1/3 text-right">{{ currentPage }} / {{ total }}</div>
    </div>
  </footer>
</template>
