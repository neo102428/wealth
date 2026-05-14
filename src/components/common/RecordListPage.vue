<script setup lang="ts">
interface FilterOption {
  key: string
  label: string
}

interface RecordListItem {
  id: string
  icon: string
  name: string
  meta: string
  amount: string
  amountClass?: string
}

withDefaults(
  defineProps<{
    tone?: 'green' | 'red'
    summaryLabel: string
    summaryAmount: string
    summarySub: string
    filterOptions: FilterOption[]
    activeFilter: string
    items: RecordListItem[]
    emptyText: string
    emptyActionText: string
    showFab?: boolean
  }>(),
  {
    tone: 'green',
    showFab: true,
  },
)

const emit = defineEmits<{
  (e: 'update:activeFilter', key: string): void
  (e: 'add'): void
  (e: 'edit', id: string): void
  (e: 'remove', id: string, name: string): void
}>()
</script>

<template>
  <view class="page record-list-page" :class="`tone-${tone}`">
    <view class="header-bar">
      <text class="header-label">{{ summaryLabel }}</text>
      <text class="header-amount">{{ summaryAmount }}</text>
      <text class="header-sub">{{ summarySub }}</text>
    </view>

    <scroll-view scroll-x class="filter-bar">
      <view class="filter-inner">
        <view
          v-for="opt in filterOptions"
          :key="opt.key"
          class="filter-tag"
          :class="{ active: activeFilter === opt.key }"
          @click="emit('update:activeFilter', opt.key)"
        >
          {{ opt.label }}
        </view>
        <slot name="extra-filter" />
      </view>
    </scroll-view>

    <view v-if="items.length === 0" class="empty">
      <text class="empty-text">{{ emptyText }}</text>
      <view class="empty-action" @click="emit('add')">{{ emptyActionText }}</view>
    </view>

    <view
      v-for="item in items"
      :key="item.id"
      class="card item-card"
      @click="emit('edit', item.id)"
    >
      <view class="item-main">
        <view class="item-left">
          <text class="item-icon">{{ item.icon }}</text>
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-meta">{{ item.meta }}</text>
          </view>
        </view>
        <view class="item-right">
          <text :class="['item-amount', item.amountClass]">{{ item.amount }}</text>
          <view class="delete-btn" @click.stop="emit('remove', item.id, item.name)">
            <text class="delete-icon">删</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showFab" class="fab" @click="emit('add')">
      <text class="fab-text">+</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: 120rpx;
}

.header-bar {
  background: $card-bg;
  padding: 28rpx;
  margin: 20rpx;
  border-radius: $card-radius;
  text-align: center;
  box-shadow: $card-shadow;

  .header-label {
    font-size: 26rpx;
    color: $text-hint;
  }

  .header-amount {
    display: block;
    font-size: 52rpx;
    font-weight: 700;
    margin-top: 6rpx;
  }

  .header-sub {
    font-size: 24rpx;
    color: $text-hint;
    margin-top: 4rpx;
  }
}

.filter-bar {
  white-space: nowrap;
  margin-bottom: 8rpx;
}

.filter-inner {
  display: inline-flex;
  padding: 0 20rpx;
  gap: 12rpx;
}

.filter-tag {
  display: inline-block;
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: $text-secondary;
  background: $card-bg;
  border-radius: $radius-pill;
  white-space: nowrap;

  &.active {
    color: #fff;
  }
}

.empty {
  padding: 120rpx 0;
  text-align: center;

  .empty-text {
    display: block;
    color: $text-hint;
    font-size: 28rpx;
    margin-bottom: 24rpx;
  }

  .empty-action {
    display: inline-block;
    padding: 16rpx 48rpx;
    color: #fff;
    border-radius: $radius-pill;
    font-size: 28rpx;
  }
}

.item-card {
  padding: 24rpx 28rpx;

  .item-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-left {
    display: flex;
    align-items: center;
    gap: 16rpx;
    flex: 1;
    min-width: 0;
  }

  .item-icon {
    font-size: 40rpx;
    flex-shrink: 0;
  }

  .item-info {
    min-width: 0;
  }

  .item-name {
    display: block;
    font-size: 30rpx;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-meta {
    display: block;
    font-size: 24rpx;
    color: $text-hint;
    margin-top: 4rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-right {
    display: flex;
    align-items: center;
    gap: 16rpx;
    flex-shrink: 0;
    margin-left: 20rpx;
  }

  .item-amount {
    font-size: 30rpx;
    font-weight: 600;
  }

  .delete-btn {
    width: 52rpx;
    height: 52rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .delete-icon {
      font-size: 24rpx;
      color: $text-hint;
    }
  }
}

.fab {
  position: fixed;
  right: 32rpx;
  bottom: 120rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;

  .fab-text {
    font-size: 48rpx;
    color: #fff;
    line-height: 1;
  }
}

.tone-green {
  .header-amount {
    color: $success-color;
  }

  .filter-tag.active,
  .empty-action,
  .fab {
    background: $primary-color;
  }

  .fab {
    box-shadow: $shadow-primary-btn;
  }

  .item-amount {
    color: $text-primary;
  }
}

.tone-red {
  .header-amount,
  .item-amount {
    color: $danger-color;
  }

  .filter-tag.active,
  .empty-action,
  .fab {
    background: $danger-color;
  }

  .fab {
    box-shadow: $shadow-danger-btn;
  }
}

.filter-tag-mgr {
  color: $primary-color;
  border: 1rpx dashed $primary-color;
  background: transparent;
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: -2rpx;
}

.amount-green {
  color: $success-color;
}

.amount-red {
  color: $danger-color;
}
</style>
