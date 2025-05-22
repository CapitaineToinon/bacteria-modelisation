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
    class="katex fieldset border p-4 text-black -translate-y-[17px] -mb-[17px]"
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
        value="B"
        class="radio radio-sm me-2"
      />
      <span ref="pb" />
    </label>
  </fieldset>
</template>
