<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from "vue"
import {
  useDraggable,
  useElementBounding,
  useElementSize,
  useMouse,
  clamp,
  UseMouseEventExtractor,
} from "@vueuse/core"
import katex from "katex"

const RADIUS = 50
const MAX_REFRESH = 30

type Mode = "A" | "B"
type Bacteria = [number, number, number, number]
type Position = [number, number]

function rho_A(position: Position, center: Position) {
  return 1 / (1 + distance(position, center))
}

function rho_B(position: Position, center: Position) {
  if (distance(position, center) < RADIUS) {
    return 1
  }

  return 0
}

const rhos = {
  A: rho_A,
  B: rho_B,
} as const

const n = ref(100)
const speed = ref(20)
const refresh = ref(30)
const isPlaying = ref(false)
const svg = useTemplateRef("svg")
const el = useTemplateRef("el")
const { top: boundsTop, left: boundsLeft } = useElementBounding(svg)
const { width, height } = useElementSize(svg)

const extractor: UseMouseEventExtractor = (event) => {
  if (event instanceof MouseEvent) return [event.offsetX, event.offsetY]
  else return null
}

const { x, y } = useMouse({ target: svg, type: extractor })

const centerx = ref(0)
const centery = ref(0)

useDraggable(el, {
  initialValue: {
    x: centerx.value,
    y: centery.value,
  },
  onMove() {
    centerx.value = x.value
    centery.value = y.value
  },
})

const mode = ref<Mode>("B")
const population = shallowRef<Bacteria[]>([])

function distance([x1, y1]: Position, [x2, y2]: Position) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function randomBacteria(): Bacteria {
  const x = Math.random() * width.value
  const y = Math.random() * height.value
  const direction = Math.random() * Math.PI * 2
  const rho = rhos[mode.value]([x, y], [centerx.value, centery.value])
  return [x, y, direction, rho]
}

function animate(delta: number) {
  if (!isPlaying.value) {
    return
  }

  population.value = population.value.map((bacteria) => {
    let [x, y, direction, rho] = bacteria

    let nx = (x + Math.cos(direction) * (speed.value * delta)) % width.value
    let ny = (y + Math.sin(direction) * (speed.value * delta)) % height.value

    // ensure positive modulo
    nx = (nx + width.value) % width.value
    ny = (ny + height.value) % height.value

    return [nx, ny, direction, rho]
  })
}

function updateBacteria() {
  if (isPlaying.value) {
    population.value = population.value.map((bacteria) => {
      let [x, y, direction, rho] = bacteria

      const next_rho = rhos[mode.value]([x, y], [centerx.value, centery.value])
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
  centerx.value = width.value / 2
  centery.value = height.value / 2
  population.value = Array.from({ length: n.value }).map(randomBacteria)

  id = setInterval(() => {
    const delta = refresh.value / MAX_REFRESH
    animate(delta)
  }, 1000 / refresh.value)

  updateBacteria()
})

onUnmounted(() => {
  if (id) {
    clearInterval(id)
  }
})

watch(n, (newN, previousN) => {
  if (newN > previousN) {
    population.value = [
      ...population.value,
      ...Array.from({ length: newN - previousN }).map(randomBacteria),
    ]
  } else {
    population.value = population.value.slice(0, newN)
  }
})
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
          r="50"
          stroke="red"
          stroke-width="5"
          stroke-opacity="1"
          fill="transparent"
        />
      </svg>
    </div>
    <div class="flex flex-col gap-2 w-full max-w-300px">
      <Concentration v-model="mode" />
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Number of bacteria</legend>
        <input
          v-model="n"
          class="range"
          type="range"
          min="50"
          max="2000"
        />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Animation speed</legend>
        <input
          class="range"
          v-model="refresh"
          type="range"
          min="1"
          :max="MAX_REFRESH"
        />
      </fieldset>
      <button
        class="btn btn-outline mt-auto"
        @click="isPlaying = !isPlaying"
      >
        <carbon:pause v-if="isPlaying" />
        <carbon:play v-else />
        <span v-if="isPlaying">Pause</span>
        <span v-else>Play</span>
      </button>
    </div>
  </div>
</template>
