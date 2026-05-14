<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSnapshotStore } from '@/stores/snapshot'
import { ASSET_TYPE_LABELS } from '@/types'
import type { AssetType, MonthlyReport } from '@/types'
import { formatAmount } from '@/utils/format'

const snapshotStore = useSnapshotStore()
const activeTab = ref<'daily' | 'monthly'>('daily')

// ---- 每日快照 ----
const reversedSnapshots = computed(() => {
  return [...snapshotStore.dailySnapshots].reverse()
})

type SnapshotFields =
  | 'cashAssets'
  | 'fixedAssets'
  | 'investmentAssets'
  | 'creditAssets'
  | 'otherAssets'

const assetTypeKeys: { key: AssetType; field: SnapshotFields }[] = [
  { key: 'cash', field: 'cashAssets' },
  { key: 'fixed', field: 'fixedAssets' },
  { key: 'investment', field: 'investmentAssets' },
  { key: 'credit', field: 'creditAssets' },
  { key: 'other', field: 'otherAssets' },
]

function handleGenerate() {
  snapshotStore.generateTodaySnapshot()
  uni.showToast({ title: '快照已生成', icon: 'success' })
}

// ---- 月结表 ----
function currentMonth(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

const selectedMonth = ref(currentMonth())
const monthReport = ref<MonthlyReport | null>(null)
const hasGenerated = ref(false)

function onMonthChange(e: any) {
  selectedMonth.value = e.detail.value
  doGenerate()
}

function goPrevMonth() {
  const [y, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  doGenerate()
}

function goNextMonth() {
  const [y, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(y, m, 1)
  const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  if (next > currentMonth()) return
  selectedMonth.value = next
  doGenerate()
}

function goCurrentMonth() {
  selectedMonth.value = currentMonth()
  doGenerate()
}

function doGenerate() {
  const report = snapshotStore.generateMonthlyReport(selectedMonth.value)
  monthReport.value = report
  hasGenerated.value = true
}

// 切到月结表时自动生成当月
function onTabChange(tab: 'daily' | 'monthly') {
  activeTab.value = tab
  if (tab === 'monthly') {
    doGenerate()
  }
}

const isCurrentMonth = computed(() => selectedMonth.value === currentMonth())

const monthlyAssetChanges: { key: AssetType; label: string; field: keyof MonthlyReport }[] = [
  { key: 'cash', label: ASSET_TYPE_LABELS.cash, field: 'cashChange' },
  { key: 'fixed', label: ASSET_TYPE_LABELS.fixed, field: 'fixedChange' },
  { key: 'investment', label: ASSET_TYPE_LABELS.investment, field: 'investmentChange' },
  { key: 'credit', label: ASSET_TYPE_LABELS.credit, field: 'creditChange' },
  { key: 'other', label: ASSET_TYPE_LABELS.other, field: 'otherChange' },
]
</script>

<template>
  <view class="page">
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'daily' }"
        @click="onTabChange('daily')"
      >
        每日快照
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'monthly' }"
        @click="onTabChange('monthly')"
      >
        月结表
      </view>
    </view>

    <!-- ==================== 每日快照 ==================== -->
    <view v-if="activeTab === 'daily'" class="tab-content">
      <view class="gen-bar">
        <button class="gen-btn" @click="handleGenerate">生成今日快照</button>
      </view>

      <view v-for="(item, idx) in reversedSnapshots" :key="item.date" class="card snapshot-card">
        <view class="snapshot-header">
          <view class="header-left">
            <text class="date-text">{{ item.date }}</text>
            <text
              v-if="item.todayChange !== 0"
              class="change-badge"
              :class="item.todayChange >= 0 ? 'badge-up' : 'badge-down'"
            >
              {{ item.todayChange >= 0 ? '+' : '' }}{{ formatAmount(item.todayChange) }}
            </text>
          </view>
          <text v-if="idx === 0" class="latest-tag">最新</text>
        </view>

        <view class="summary-row">
          <view class="sum-item">
            <text class="sum-label">总资产</text>
            <text class="sum-value text-green">{{ formatAmount(item.totalAssets) }}</text>
          </view>
          <view class="sum-item">
            <text class="sum-label">总负债</text>
            <text class="sum-value text-red">{{ formatAmount(item.totalLiabilities) }}</text>
          </view>
          <view class="sum-item">
            <text class="sum-label">净资产</text>
            <text class="sum-value" :class="item.netWorth >= 0 ? 'text-green' : 'text-red'">
              {{ formatAmount(item.netWorth) }}
            </text>
          </view>
        </view>

        <view class="breakdown">
          <text class="breakdown-title">资产分类</text>
          <view class="breakdown-list">
            <view v-for="at in assetTypeKeys" :key="at.key" class="breakdown-item">
              <text class="breakdown-label">{{ ASSET_TYPE_LABELS[at.key] }}</text>
              <text class="breakdown-value">{{ formatAmount(item[at.field]) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="reversedSnapshots.length === 0" class="empty">
        <text class="empty-text">暂无快照记录</text>
        <text class="empty-tip">点击上方按钮生成今日快照</text>
      </view>
    </view>

    <!-- ==================== 月结表 ==================== -->
    <view v-if="activeTab === 'monthly'" class="tab-content">
      <!-- 月份选择器 -->
      <view class="month-picker">
        <view class="picker-arrow" @click="goPrevMonth">‹</view>
        <picker mode="date" fields="month" :value="selectedMonth + '-01'" @change="onMonthChange">
          <view class="picker-center">
            <text class="picker-month">{{ selectedMonth }}</text>
            <text class="picker-switch">切换</text>
          </view>
        </picker>
        <view class="picker-arrow" :class="{ disabled: isCurrentMonth }" @click="goNextMonth"
          >›</view
        >
      </view>

      <!-- 本月快捷 + 生成按钮 -->
      <view class="month-actions" v-if="!isCurrentMonth">
        <view class="link-btn" @click="goCurrentMonth">回到本月</view>
      </view>

      <!-- 无数据 -->
      <view v-if="hasGenerated && !monthReport" class="empty">
        <text class="empty-text">{{ selectedMonth }} 暂无快照数据</text>
        <text class="empty-tip">请先生成该月的每日快照</text>
      </view>

      <!-- 月结报告 -->
      <view v-if="monthReport" class="card monthly-card">
        <!-- 不足提示 -->
        <view v-if="monthReport.insufficient" class="insufficient-banner">
          <text class="insufficient-icon">⚠️</text>
          <text class="insufficient-text"
            >快照数据较少（仅 {{ monthReport.snapshotCount }} 条），月结仅供参考</text
          >
        </view>

        <!-- 月标题 -->
        <view class="month-header">
          <text class="month-title">{{ monthReport.month }} 月结表</text>
          <text class="month-snapshot-count">{{ monthReport.snapshotCount }} 条快照</text>
        </view>

        <!-- 净资产变化 -->
        <view
          class="networth-change-card"
          :class="monthReport.netWorthChange >= 0 ? 'nw-up' : 'nw-down'"
        >
          <text class="nw-label">净资产变化</text>
          <text class="nw-amount">
            {{ monthReport.netWorthChange >= 0 ? '+' : ''
            }}{{ formatAmount(monthReport.netWorthChange) }}
          </text>
        </view>

        <!-- 期初期末对比 -->
        <view class="compare-section">
          <view class="compare-col">
            <text class="compare-title">期初（{{ monthReport.month }}-01）</text>
            <view class="compare-row">
              <text class="compare-label">总资产</text>
              <text class="compare-value">{{ formatAmount(monthReport.startAssets) }}</text>
            </view>
            <view class="compare-row">
              <text class="compare-label">总负债</text>
              <text class="compare-value">{{ formatAmount(monthReport.startLiabilities) }}</text>
            </view>
            <view class="compare-row compare-highlight">
              <text class="compare-label">净资产</text>
              <text class="compare-value">{{ formatAmount(monthReport.startNetWorth) }}</text>
            </view>
          </view>
          <view class="compare-arrow-col">
            <text class="arrow-icon">→</text>
          </view>
          <view class="compare-col">
            <text class="compare-title">期末</text>
            <view class="compare-row">
              <text class="compare-label">总资产</text>
              <text class="compare-value">{{ formatAmount(monthReport.endAssets) }}</text>
            </view>
            <view class="compare-row">
              <text class="compare-label">总负债</text>
              <text class="compare-value">{{ formatAmount(monthReport.endLiabilities) }}</text>
            </view>
            <view class="compare-row compare-highlight">
              <text class="compare-label">净资产</text>
              <text class="compare-value">{{ formatAmount(monthReport.endNetWorth) }}</text>
            </view>
          </view>
        </view>

        <!-- 分类资产月变化 -->
        <view class="changes-section">
          <text class="changes-title">分类资产月变化</text>
          <view class="changes-list">
            <view v-for="ac in monthlyAssetChanges" :key="ac.key" class="change-item">
              <text class="change-label">{{ ac.label }}</text>
              <text
                class="change-value"
                :class="(monthReport[ac.field] as number) >= 0 ? 'text-green' : 'text-red'"
              >
                {{ (monthReport[ac.field] as number) >= 0 ? '+' : ''
                }}{{ formatAmount(monthReport[ac.field] as number) }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 初始提示 -->
      <view v-if="!hasGenerated" class="empty">
        <text class="empty-text">选择月份查看月结表</text>
        <text class="empty-tip">月结表根据每日快照自动计算</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: 40rpx;
}

.tab-bar {
  display: flex;
  margin: 20rpx 20rpx 0;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;

  &.active {
    color: #2979ff;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 48rpx;
      height: 4rpx;
      background: #2979ff;
      border-radius: 2rpx;
    }
  }
}

.tab-content {
  padding: 0 20rpx;
}

/* ---- 每日快照 ---- */
.gen-bar {
  padding: 24rpx 0 8rpx;
}

.gen-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: #2979ff;
  color: #fff;
  font-size: 28rpx;
  border-radius: 12rpx;
  border: none;

  &::after {
    border: none;
  }
}

.snapshot-card {
  margin-top: 20rpx;
  padding: 24rpx 28rpx;
}

.snapshot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .date-text {
    font-size: 30rpx;
    font-weight: 600;
  }

  .change-badge {
    font-size: 22rpx;
    padding: 4rpx 14rpx;
    border-radius: 6rpx;
    font-weight: 500;
  }

  .badge-up {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
  .badge-down {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
  }

  .latest-tag {
    font-size: 22rpx;
    color: #2979ff;
    background: rgba(41, 121, 255, 0.08);
    padding: 4rpx 14rpx;
    border-radius: 6rpx;
  }
}

.summary-row {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.sum-item {
  flex: 1;
  background: #f8f8f8;
  border-radius: 10rpx;
  padding: 16rpx 12rpx;
  text-align: center;

  .sum-label {
    display: block;
    font-size: 22rpx;
    color: #999;
    margin-bottom: 4rpx;
  }
  .sum-value {
    font-size: 26rpx;
    font-weight: 600;
  }
}

.text-green {
  color: #4caf50;
}
.text-red {
  color: #f44336;
}

.breakdown {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 16rpx;
}

.breakdown-title {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
  display: block;
}

.breakdown-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx 0;
}

.breakdown-item {
  width: 50%;
  display: flex;
  justify-content: space-between;
  padding: 4rpx 12rpx 4rpx 0;

  &:nth-child(even) {
    padding-right: 0;
    padding-left: 12rpx;
  }
}

.breakdown-label {
  font-size: 24rpx;
  color: #999;
}
.breakdown-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.empty {
  padding: 120rpx 0;
  text-align: center;

  .empty-text {
    display: block;
    color: #999;
    font-size: 28rpx;
    margin-bottom: 8rpx;
  }
  .empty-tip {
    display: block;
    color: #bbb;
    font-size: 24rpx;
  }
}

/* ---- 月结表 ---- */
.month-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  margin-top: 20rpx;
  padding: 16rpx 28rpx;
  border-radius: 12rpx;
}

.picker-arrow {
  font-size: 48rpx;
  color: #2979ff;
  padding: 0 12rpx;
  line-height: 1;

  &.disabled {
    color: #ccc;
  }
}

.picker-center {
  text-align: center;
}

.picker-month {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
}

.picker-switch {
  font-size: 22rpx;
  color: #2979ff;
}

.month-actions {
  text-align: center;
  padding: 16rpx 0 0;
}

.link-btn {
  display: inline-block;
  font-size: 26rpx;
  color: #2979ff;
  padding: 8rpx 24rpx;
}

.monthly-card {
  margin-top: 20rpx;
  padding: 28rpx;
}

.insufficient-banner {
  background: #fff8e1;
  border-radius: 10rpx;
  padding: 16rpx 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;

  .insufficient-icon {
    font-size: 28rpx;
  }
  .insufficient-text {
    font-size: 24rpx;
    color: #f57f17;
    flex: 1;
  }
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .month-title {
    font-size: 32rpx;
    font-weight: 700;
  }
  .month-snapshot-count {
    font-size: 24rpx;
    color: #999;
  }
}

.networth-change-card {
  text-align: center;
  padding: 28rpx;
  border-radius: 12rpx;
  margin-bottom: 24rpx;

  &.nw-up {
    background: rgba(76, 175, 80, 0.08);
  }
  &.nw-down {
    background: rgba(244, 67, 54, 0.08);
  }

  .nw-label {
    display: block;
    font-size: 26rpx;
    color: #999;
    margin-bottom: 8rpx;
  }
  .nw-amount {
    font-size: 44rpx;
    font-weight: 700;
  }
}

.nw-up .nw-amount {
  color: #4caf50;
}
.nw-down .nw-amount {
  color: #f44336;
}

.compare-section {
  display: flex;
  align-items: stretch;
  margin-bottom: 24rpx;
}

.compare-col {
  flex: 1;
  background: #f8f8f8;
  border-radius: 10rpx;
  padding: 16rpx 14rpx;

  .compare-title {
    display: block;
    font-size: 22rpx;
    color: #999;
    margin-bottom: 10rpx;
    text-align: center;
  }
}

.compare-arrow-col {
  display: flex;
  align-items: center;
  padding: 0 8rpx;

  .arrow-icon {
    font-size: 32rpx;
    color: #2979ff;
  }
}

.compare-row {
  display: flex;
  justify-content: space-between;
  padding: 6rpx 0;

  .compare-label {
    font-size: 24rpx;
    color: #999;
  }
  .compare-value {
    font-size: 24rpx;
    font-weight: 500;
  }
}

.compare-highlight {
  margin-top: 6rpx;
  padding-top: 8rpx;
  border-top: 1rpx dashed #ddd;

  .compare-label {
    font-weight: 600;
    color: #333;
  }
  .compare-value {
    font-weight: 600;
  }
}

.changes-section {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.changes-title {
  font-size: 26rpx;
  font-weight: 600;
  margin-bottom: 14rpx;
  display: block;
}

.changes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx 0;
}

.change-item {
  width: 50%;
  display: flex;
  justify-content: space-between;
  padding: 6rpx 12rpx 6rpx 0;

  &:nth-child(even) {
    padding-right: 0;
    padding-left: 12rpx;
  }

  .change-label {
    font-size: 24rpx;
    color: #999;
  }
  .change-value {
    font-size: 24rpx;
    font-weight: 500;
  }
}
</style>
