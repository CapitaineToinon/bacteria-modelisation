<template>
  <footer
    v-if="$nav.currentLayout !== 'cover'"
    class="text-xs"
  >
    <div class="abs-b mb-2 mx-6 flex items-center justify-between">
      <div class="w-1/3 text-left">A. Sutter & T. Cavagna</div>
      <div class="w-1/3 text-center">Multi-Agents System</div>
      <div class="w-1/3 text-right">{{ $nav.currentPage }} / {{ $nav.total }}</div>
    </div>
  </footer>
</template>
