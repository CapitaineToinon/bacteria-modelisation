<script setup lang="ts">
import type { Mode, Bacteria } from "./types"
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from "vue"
import { useDraggable } from "@vueuse/core"
import { getRho } from "./rho"
import { useMouse } from "./use-mouse"
import { onSlideLeave } from "@slidev/client"
import { mod } from "./mod"

// constants
const MAX_REFRESH = 30
const width = 628
const height = 472

// stuff that change in the UI
const n = ref(100)
const speed = ref(20)
const refresh = ref(30)
const radius = ref(50)
const mode = ref<Mode>("B")
const isPlaying = ref(false)

const svg = useTemplateRef("svg")
const el = useTemplateRef("el")
const { x, y } = useMouse({ target: svg })

const centerx = ref(width / 2)
const centery = ref(height / 2)

const { isDragging } = useDraggable(el, {
  initialValue: {
    x: centerx.value,
    y: centery.value,
  },
  onMove() {
    centerx.value = x.value
    centery.value = y.value
  },
})

const population = shallowRef(randomBacterias(n.value))

function randomBacterias(n: number): Bacteria[] {
  return Array.from({ length: n }).map(() => {
    const x = Math.random() * width
    const y = Math.random() * height
    const direction = Math.random() * Math.PI * 2
    const rho = getRho(mode.value)(
      [x, y],
      [centerx.value, centery.value],
      radius.value,
    )
    return [x, y, direction, rho]
  })
}

// Main animation loop that updates the position of the bacteria
// always at 30 frames per seconds, regardless of the animation speed
function animate(delta: number) {
  if (!isPlaying.value) {
    return
  }

  population.value = population.value.map((bacteria) => {
    const [x, y, direction, rho] = bacteria

    const nx = mod(x + Math.cos(direction) * (speed.value * delta), width)
    const ny = mod(y + Math.sin(direction) * (speed.value * delta), height)

    return [nx, ny, direction, rho]
  })
}

// Update loop that updates the rho of the bacteria
// Calls itself every 1000 / refresh frames, therefore variable
// depending on the refresh rate
function updateBacteria() {
  if (isPlaying.value) {
    population.value = population.value.map((bacteria) => {
      let [x, y, direction, rho] = bacteria

      const next_rho = getRho(mode.value)(
        [x, y],
        [centerx.value, centery.value],
        radius.value,
      )

      const probability = next_rho < rho ? 0.9 : 0.5

      if (Math.random() <= probability) {
        direction = Math.random() * Math.PI * 2
      }

      return [x, y, direction, next_rho]
    })
  }

  setTimeout(updateBacteria, 1000 / refresh.value)
}

let id: NodeJS.Timeout | null = null

onMounted(() => {
  id = setInterval(() => {
    const delta = refresh.value / MAX_REFRESH
    animate(delta)
  }, 1000 / MAX_REFRESH)

  updateBacteria()
})

onUnmounted(() => {
  if (id) {
    clearInterval(id)
  }
})

onSlideLeave(() => {
  isPlaying.value = false
})

watch(n, (newN, previousN) => {
  if (newN > previousN) {
    population.value = [
      ...population.value,
      ...randomBacterias(newN - previousN),
    ]
  } else {
    population.value = population.value.slice(0, newN)
  }
})

function reset() {
  isPlaying.value = false
  centerx.value = width / 2
  centery.value = height / 2
  radius.value = 50
  mode.value = "B"
  n.value = 100
  speed.value = 20
  refresh.value = MAX_REFRESH
  population.value = randomBacterias(n.value)
}
</script>

<template>
  <div class="flex h-full gap-5">
    <div
      class="flex-grow"
      ref="svg"
    >
      <svg
        ref="svg"
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="`0 0 ${width} ${height}`"
        :width="width"
        :height="height"
        class="border border-black"
      >
        <circle
          v-for="([x, y], index) in population"
          :key="index"
          :cx="x"
          :cy="y"
          r="1"
          stroke="black"
          stroke-width="2"
          class="pointer-events-none"
        />
        <circle
          ref="el"
          key="center"
          :cx="centerx"
          :cy="centery"
          :r="radius"
          stroke="red"
          stroke-width="5"
          stroke-opacity="1"
          fill="transparent"
          :class="{
            'cursor-grabbing': isDragging,
            'cursor-grab': !isDragging,
          }"
        />
      </svg>
    </div>
    <div class="flex flex-col gap-2 w-full max-w-220px">
      <Concentration
        v-model="mode"
        :radius
      />
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Number of bacteria</legend>
        <input
          v-model="n"
          class="range range-sm"
          type="range"
          min="1"
          max="2000"
        />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Center radius</legend>
        <input
          v-model="radius"
          class="range range-sm"
          type="range"
          min="1"
          max="100"
        />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Animation speed</legend>
        <input
          v-model="refresh"
          class="range range-sm"
          type="range"
          min="1"
          :max="MAX_REFRESH"
        />
      </fieldset>
      <div class="mt-auto w-full grid grid-cols-2 gap-2">
        <button
          class="btn btn-outline"
          @click="isPlaying = !isPlaying"
        >
          <carbon:pause v-if="isPlaying" />
          <carbon:play v-else />
          <span v-if="isPlaying">Pause</span>
          <span v-else>Play</span>
        </button>
        <button
          class="btn btn-outline mt-auto"
          @click="reset"
        >
          <carbon:reset />
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
