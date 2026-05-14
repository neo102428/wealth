<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'

interface PieSegment {
  key: string
  label: string
  value: number
  color: string
  icon?: string
  valueText?: string
}

const props = withDefaults(
  defineProps<{
    canvasId?: string
    segments: PieSegment[]
    totalLabel?: string
    totalText?: string
    emptyText?: string
  }>(),
  {
    canvasId: 'pieChart',
    totalLabel: '合计',
    totalText: '',
    emptyText: '暂无数据',
  },
)

const emit = defineEmits<{
  (e: 'segment-click', key: string): void
}>()

let drawTimer: ReturnType<typeof setTimeout> | undefined
let canvasRect: { left: number; top: number; width: number; height: number } | null = null

const activeSegments = computed(() => props.segments.filter((item) => item.value > 0))

const chartTotal = computed(() => activeSegments.value.reduce((sum, item) => sum + item.value, 0))

const hasData = computed(() => chartTotal.value > 0)

function getPercent(value: number): string {
  if (chartTotal.value <= 0) return '0.0%'
  return `${((value / chartTotal.value) * 100).toFixed(1)}%`
}

function drawEmptyState(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 2 - 2
  const innerRadius = radius * 0.56

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.arc(centerX, centerY, innerRadius, Math.PI * 2, 0, true)
  ctx.closePath()
  ctx.fillStyle = '#eef2f7'
  ctx.fill()
}

function drawSegments(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 2 - 2
  const innerRadius = radius * 0.56
  let startAngle = -Math.PI / 2

  activeSegments.value.forEach((item, index) => {
    const sliceAngle =
      index === activeSegments.value.length - 1
        ? Math.PI * 1.5 - startAngle
        : (item.value / chartTotal.value) * Math.PI * 2
    const endAngle = startAngle + sliceAngle

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
    ctx.closePath()
    ctx.fillStyle = item.color
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    startAngle = endAngle
  })
}

function getCanvasNode(): Promise<{ canvas: any; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery()
    query
      .select(`#${props.canvasId}`)
      .fields({ node: true, size: true })
      .exec((res: any[]) => {
        const data = res?.[0]
        if (!data?.node || !data?.width || !data?.height) {
          resolve(null)
          return
        }
        resolve({ canvas: data.node, width: data.width, height: data.height })
      })
  })
}

async function drawChart(retry = 0) {
  await nextTick()

  const result = await getCanvasNode()
  if (!result) {
    if (retry < 5) {
      drawTimer = setTimeout(() => {
        void drawChart(retry + 1)
      }, 120)
    }
    return
  }

  const { canvas, width, height } = result
  const dpr = uni.getSystemInfoSync().pixelRatio || 2
  canvas.width = width * dpr
  canvas.height = height * dpr

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  if (hasData.value) {
    drawSegments(ctx, width, height)
  } else {
    drawEmptyState(ctx, width, height)
  }
}

function scheduleDraw() {
  if (drawTimer) clearTimeout(drawTimer)
  drawTimer = setTimeout(() => {
    void drawChart()
  }, 60)
}

function cacheCanvasRect() {
  uni
    .createSelectorQuery()
    .select(`#${props.canvasId}`)
    .boundingClientRect()
    .exec((res: any[]) => {
      canvasRect = res?.[0] || null
    })
}

function getTapPoint(e: any): { x: number; y: number } | null {
  const source = e.changedTouches?.[0] || e.touches?.[0] || e.detail || e

  if (typeof source?.x === 'number' && typeof source?.y === 'number') {
    return { x: source.x, y: source.y }
  }

  if (typeof source?.offsetX === 'number' && typeof source?.offsetY === 'number') {
    return { x: source.offsetX, y: source.offsetY }
  }

  if (canvasRect && typeof source?.clientX === 'number' && typeof source?.clientY === 'number') {
    return {
      x: source.clientX - canvasRect.left,
      y: source.clientY - canvasRect.top,
    }
  }

  return null
}

function onCanvasTap(e: any) {
  const point = getTapPoint(e)
  if (!point || !canvasRect) return

  const { x, y } = point
  const centerX = canvasRect.width / 2
  const centerY = canvasRect.height / 2
  const radius = Math.min(canvasRect.width, canvasRect.height) / 2 - 2
  const innerRadius = radius * 0.56
  const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

  if (dist < innerRadius || dist > radius) return

  let angle = Math.atan2(y - centerY, x - centerX)
  if (angle < -Math.PI / 2) angle += Math.PI * 2

  let startAngle = -Math.PI / 2
  for (const [index, item] of activeSegments.value.entries()) {
    const sliceAngle =
      index === activeSegments.value.length - 1
        ? Math.PI * 1.5 - startAngle
        : (item.value / chartTotal.value) * Math.PI * 2
    const endAngle = startAngle + sliceAngle
    if (angle >= startAngle && angle <= endAngle) {
      emit('segment-click', item.key)
      return
    }
    startAngle = endAngle
  }
}

function onCenterTap() {
  emit('segment-click', '__back__')
}

onMounted(() => {
  cacheCanvasRect()
  scheduleDraw()
})

watch(
  () => props.segments,
  () => {
    cacheCanvasRect()
    scheduleDraw()
  },
  { deep: true, flush: 'post' },
)
</script>

<template>
  <view class="pie-card">
    <view v-if="hasData" class="pie-body">
      <view class="pie-visual">
        <canvas
          :id="canvasId"
          :canvas-id="canvasId"
          type="2d"
          class="pie-canvas"
          @tap="onCanvasTap"
        ></canvas>
        <view class="pie-center" @tap="onCenterTap">
          <text class="pie-center-label">{{ totalLabel }}</text>
          <text v-if="totalText" class="pie-center-value">{{ totalText }}</text>
        </view>
      </view>

      <view class="pie-legend">
        <view
          v-for="item in activeSegments"
          :key="item.key"
          class="legend-item"
          @tap="emit('segment-click', item.key)"
        >
          <view class="legend-dot" :style="{ background: item.color }"></view>
          <view class="legend-copy">
            <text class="legend-name">{{ item.icon ? `${item.icon} ` : '' }}{{ item.label }}</text>
            <text class="legend-value">{{ item.valueText || item.value }}</text>
          </view>
          <text class="legend-percent">{{ getPercent(item.value) }}</text>
        </view>
      </view>
    </view>

    <view v-else class="pie-empty">
      <text>{{ emptyText }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.pie-card {
  background: $card-bg;
  border-radius: $card-radius;
  padding: 28rpx;
  margin-bottom: 16rpx;
  box-shadow: $card-shadow;
}

.pie-body {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.pie-visual {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  flex: 0 0 240rpx;
}

.pie-canvas {
  width: 240rpx;
  height: 240rpx;
  display: block;
}

.pie-center {
  position: absolute;
  inset: 58rpx;
  border-radius: 50%;
  background: $card-bg;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-center-label {
  font-size: 22rpx;
  color: #8a94a6;
  line-height: 1.2;
}

.pie-center-value {
  max-width: 128rpx;
  margin-top: 4rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.15;
  text-align: center;
  word-break: break-all;
}

.pie-legend {
  flex: 1;
  min-width: 0;
}

.legend-item {
  display: grid;
  grid-template-columns: 16rpx minmax(0, 1fr) auto;
  align-items: center;
  gap: 12rpx;
  min-height: 44rpx;
  margin-bottom: 12rpx;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
}

.legend-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.legend-copy {
  min-width: 0;
}

.legend-name,
.legend-value {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-name {
  font-size: 24rpx;
  color: #303746;
}

.legend-value {
  margin-top: 2rpx;
  font-size: 22rpx;
  color: #8a94a6;
}

.legend-percent {
  font-size: 24rpx;
  font-weight: 600;
  color: #303746;
}

.pie-empty {
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aa3b2;
  font-size: 26rpx;
}
</style>
