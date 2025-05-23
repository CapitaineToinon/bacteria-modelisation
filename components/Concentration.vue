<script setup lang="ts">
import type { Mode } from "./types"
import { useTemplateRef, watchEffect } from "vue"
import katex from "katex"

const model = defineModel<Mode>()
const props = defineProps<{ radius: number | string }>()

const pa = useTemplateRef("pa")
const pb = useTemplateRef("pb")

watchEffect(() => {
  if (pb.value) {
    katex.render(
      String.raw`\rho_B(x) = \begin{cases} 1 & \text{if } d(x, C) > ${props.radius} \\ 0 & \text{otherwise} \end{cases}`,
      pb.value,
    )
  }

  if (pa.value) {
    katex.render(String.raw`\rho_A(x) = \frac{1}{1 + d(x, C)}`, pa.value!)
  }
})
</script>

<template>
  <fieldset
    class="katex flex flex-col border p-4 -translate-y-[12px] -mb-[17px]"
  >
    <legend class="fieldset-legend">Concentration</legend>
    <label class="text-sm font-medium text-gray-900 flex items-center mb-4 gap-2">
      <input v-model="model" type="radio" value="A" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300">
      <div ref="pa"></div>
    </label>
    <label class="text-sm font-medium text-gray-900 flex items-center mb-4 gap-2">
      <input v-model="model" type="radio" value="B" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300">
      <div ref="pb" class="text-xs"></div>
    </label>
  </fieldset>
</template>
