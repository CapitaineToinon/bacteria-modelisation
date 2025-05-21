<script setup lang="ts">
import type { Mode } from "./Plot.vue"
import { useTemplateRef, onMounted, defineModel, watchEffect } from "vue"
import katex from "katex"

const model = defineModel()

watchEffect(() => {
  console.log(model.value)
})

const pa = useTemplateRef("pa")
const pb = useTemplateRef("pb")

onMounted(() => {
  katex.render(String.raw`\rho_A(x) = \frac{1}{1 + d(x, C)}`, pa.value, {
    throwOnError: false,
  })
  katex.render(
    String.raw`\rho_B(x) = \begin{cases} 1 & \text{if } d(x, C) > 15 \\ 0 & \text{otherwise} \end{cases}`,
    pb.value,
    { throwOnError: false },
  )
})
</script>

<template>
  <fieldset
    class="katex fieldset border rounded-box p-4 text-black -translate-y-4 -mb-4"
  >
    <legend class="fieldset-legend">Concentration</legend>
    <label class="label text-black mb-4">
      <input
        v-model="model"
        type="radio"
        value="A"
        class="radio radio-sm mr-2"
      />
      <span ref="pa" />
    </label>
    <label class="label text-black">
      <input
        v-model="model"
        type="radio"
        checked="checked"
        value="B"
        class="radio radio-sm me-2"
      />
      <span ref="pb" />
    </label>
  </fieldset>
</template>

<style scoped>
:deep(.katex) .katex-html {
  display: none;
}
</style>
