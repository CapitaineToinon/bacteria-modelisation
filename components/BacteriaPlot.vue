<script setup lang="ts">
import { onSlideLeave } from "@slidev/client"
import { useDraggable } from "@vueuse/core"
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from "chart.js"
import {
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch
} from "vue"
import { Line } from "vue-chartjs"
import { mod } from "./mod"
import { getRho } from "./rho"
import type { Bacteria, Mode } from "./types"
import { useMouse } from "./use-mouse"

ChartJS.register(Title, LineElement, PointElement, CategoryScale, LinearScale)

// constants
const MAX_REFRESH = 30
const width = 600
const height = 236
const MAX_HISTORY_LENGTH = 100

// stuff that change in the UI
const n = ref(100)
const speed = ref(20)
const refresh = ref(30)
const radius = ref(50)
const mode = ref<Mode>("B")
const isPlaying = ref(false)
const insideHistory = ref<number[]>(Array(MAX_HISTORY_LENGTH).fill(0))
const historyTime = ref<number[]>(Array(MAX_HISTORY_LENGTH).fill(0))

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

function insideCirclePercentage(): number {
  const inside = population.value.filter(([x, y]) => {
    const dx = x - centerx.value
    const dy = y - centery.value
    return Math.sqrt(dx * dx + dy * dy) <= radius.value
  })
  return (inside.length / population.value.length) * 100
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
    insideHistory.value.push(insideCirclePercentage())
    historyTime.value.push(historyTime.value[historyTime.value.length - 1] + (1000 / refresh.value))
    if (insideHistory.value.length > MAX_HISTORY_LENGTH) {
      insideHistory.value.shift()
      historyTime.value.shift()
    }
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

  insideHistory.value = Array(MAX_HISTORY_LENGTH).fill(0)
  historyTime.value = Array(MAX_HISTORY_LENGTH).fill(0)
}

const chartOptions = ref<ChartOptions<"line">>({
  responsive: true,
  animation: false,
  devicePixelRatio: 4,
  scales: {
    y: {
      min: 0,
      max: 100,
      title: {
        display: true,
        text: "Inside circle (%)",
      },
    },
    x: {
      title: {
        display: true,
        text: "Time (s)",
      },
    },
  },
})
const chartStyle = ref({
  height: `${height}px`,
  width: `${width}px`,
  position: "relative",
})
const chartData = ref<ChartData<"line">>({
  labels: [],
  datasets: [
    {
      label: "Inside circle (%)",
      data: [],
      fill: false,
      borderColor: "#f87171",
      pointRadius: 0,
    },
  ],
})

watch(
  insideHistory,
  (newVal) => {
    chartData.value = {
      ...chartData.value,
      labels: historyTime.value.map((t) => (t / 1000).toFixed(2)),
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: [...newVal],
        },
      ],
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="flex h-full gap-5">
    <div
      class="flex-grow"
      ref="svg"
    >
      <div class="flex flex-col items-center gap-4">
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
        <div>
          <Line
            id="my-chart-id"
            ref="chartRef"
            :options="chartOptions"
            :data="chartData"
            :style="chartStyle"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 w-full max-w-300px">
      <Concentration
        v-model="mode"
        :radius
      />
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Number of bacteria</legend>
        <input
          v-model="n"
          class="w-full h-2 mb-6 bg-gray-200 rounded-lg cursor-pointer"
          type="range"
          min="1"
          max="2000"
        />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Center radius</legend>
        <input
          v-model="radius"
          class="w-full h-2 mb-6 bg-gray-200 rounded-lg cursor-pointer"
          type="range"
          min="1"
          max="100"
        />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Animation speed</legend>
        <input
          v-model="refresh"
          class="w-full h-2 mb-6 bg-gray-200 rounded-lg cursor-pointer"
          type="range"
          min="1"
          :max="MAX_REFRESH"
        />
      </fieldset>
      <div class="mt-auto w-full grid grid-cols-2 gap-2">
        <button
          class="border border-black rounded-lg py-2"
          @click="isPlaying = !isPlaying"
        >
          <carbon:pause v-if="isPlaying" />
          <carbon:play v-else />
          <span v-if="isPlaying">Pause</span>
          <span v-else>Play</span>
        </button>
        <button
          class="border border-black rounded-lg py-2"
          @click="reset"
        >
          <carbon:reset />
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
