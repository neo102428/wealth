<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import FormActions from '@/components/common/FormActions.vue'
import FormField from '@/components/common/FormField.vue'
import FormSection from '@/components/common/FormSection.vue'
import { useAssetStore } from '@/stores/asset'
import { useCustomAssetTypeStore } from '@/stores/customAssetType'
import { ASSET_CATEGORIES, VALUATION_METHOD_LABELS } from '@/types'
import type { AssetType, ValuationMethod } from '@/types'

const assetStore = useAssetStore()
const customTypeStore = useCustomAssetTypeStore()

const isEdit = ref(false)
const editId = ref('')
const isTypePreset = ref(false)
const isCustomCategory = ref(false)

const form = ref({
  name: '',
  type: 'cash' as AssetType,
  category: '',
  customCategory: '',
  initialValue: '',
  currentValue: '',
  purchaseDate: '',
  valuationMethod: 'market' as ValuationMethod,
  note: '',
})

const errors = ref<Record<string, string>>({})

const typeOptions = computed(() => customTypeStore.allAssetTypes)
const valuationOptions: ValuationMethod[] = ['market', 'cost', 'income', 'net']

const categoryOptions = computed(() => {
  return ASSET_CATEGORIES[form.value.type] ?? []
})

const typeIndex = computed(() => typeOptions.value.indexOf(form.value.type))
const typeLabels = computed(() => typeOptions.value.map((t) => customTypeStore.getLabel(t)))
const valuationIndex = computed(() => valuationOptions.indexOf(form.value.valuationMethod))
const categoryIndex = computed(() => {
  const idx = categoryOptions.value.indexOf(form.value.category)
  return idx >= 0 ? idx : 0
})

onLoad((options?: any) => {
  const presetType = options?.type
  if (presetType) {
    form.value.type = presetType
    isTypePreset.value = true
  }

  const id = options?.id
  if (id) {
    const asset = assetStore.assets.find((a) => a.id === id)
    if (asset) {
      isEdit.value = true
      editId.value = id
      form.value = {
        name: asset.name,
        type: asset.type,
        category: asset.category,
        customCategory: '',
        initialValue: String(asset.initialValue),
        currentValue: String(asset.currentValue),
        purchaseDate: asset.purchaseDate,
        valuationMethod: asset.valuationMethod,
        note: asset.note,
      }

      const presetCategories = ASSET_CATEGORIES[asset.type] ?? []
      if (asset.category && !presetCategories.includes(asset.category)) {
        isCustomCategory.value = true
        form.value.customCategory = asset.category
        form.value.category = ''
      }
    }
  }
})

function onTypeChange(e: any) {
  const idx = e.detail.value
  form.value.type = typeOptions.value[idx]
  form.value.category = ''
  form.value.customCategory = ''
}

function onCategoryChange(e: any) {
  const idx = e.detail.value
  form.value.category = categoryOptions.value[idx] ?? ''
}

function onValuationChange(e: any) {
  form.value.valuationMethod = valuationOptions[e.detail.value]
}

function onDateChange(e: any) {
  form.value.purchaseDate = e.detail.value
}

function toggleCategoryMode() {
  isCustomCategory.value = !isCustomCategory.value
  if (isCustomCategory.value) {
    form.value.customCategory = form.value.category
    form.value.category = ''
  } else {
    form.value.customCategory = ''
  }
  errors.value.category = ''
}

function validate(): boolean {
  const e: Record<string, string> = {}

  if (!form.value.name.trim()) {
    e.name = '资产名称不能为空'
  }

  const initVal = parseFloat(form.value.initialValue)
  if (isNaN(initVal) || initVal < 0) {
    e.initialValue = '初始价值不能小于0'
  }

  const curVal = parseFloat(form.value.currentValue)
  if (isNaN(curVal) || curVal < 0) {
    e.currentValue = '当前价值不能小于0'
  }

  if (isCustomCategory.value && !form.value.customCategory.trim()) {
    e.category = '自定义分类不能为空'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

function handleSave() {
  if (!validate()) return

  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const todayStr = `${y}-${m}-${d}`

  const data = {
    name: form.value.name.trim(),
    type: form.value.type,
    category: isCustomCategory.value ? form.value.customCategory.trim() : form.value.category,
    initialValue: parseFloat(form.value.initialValue) || 0,
    currentValue: parseFloat(form.value.currentValue) || 0,
    purchaseDate: form.value.purchaseDate || todayStr,
    valuationMethod: form.value.valuationMethod,
    note: form.value.note.trim(),
    institution: '',
    rate: 0,
  }

  if (isEdit.value) {
    assetStore.updateAsset(editId.value, data)
    uni.showToast({ title: '保存成功', icon: 'success' })
  } else {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    assetStore.addAsset({
      id,
      ...data,
      createTime: todayStr,
      updateTime: todayStr,
    })
    uni.showToast({ title: '添加成功', icon: 'success' })
  }

  setTimeout(() => {
    uni.navigateBack()
  }, 800)
}
</script>

<template>
  <view class="page">
    <FormSection>
      <FormField label="资产名称" required :error="errors.name">
        <input v-model="form.name" class="form-input" placeholder="请输入资产名称" maxlength="50" />
      </FormField>

      <FormField v-if="!isTypePreset" label="资产类型" required>
        <picker :value="typeIndex" :range="typeLabels" @change="onTypeChange">
          <view class="form-picker">
            <text :class="form.type ? '' : 'placeholder'">
              {{ customTypeStore.getLabel(form.type) }}
            </text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </FormField>

      <FormField v-if="!isTypePreset" label="资产分类" :error="errors.category">
        <picker
          v-if="!isCustomCategory"
          :value="categoryIndex"
          :range="categoryOptions"
          @change="onCategoryChange"
        >
          <view class="form-picker">
            <text :class="form.category ? '' : 'placeholder'">
              {{ form.category || '请选择分类' }}
            </text>
            <text class="arrow">›</text>
          </view>
        </picker>
        <input
          v-else
          v-model="form.customCategory"
          class="form-input"
          placeholder="请输入自定义分类"
          maxlength="20"
        />
        <text class="category-mode-toggle" @click="toggleCategoryMode">
          {{ isCustomCategory ? '使用预设分类' : '使用自定义分类' }}
        </text>
      </FormField>

      <FormField label="初始价值" required :error="errors.initialValue">
        <input
          v-model="form.initialValue"
          class="form-input"
          type="digit"
          placeholder="请输入初始价值"
        />
      </FormField>

      <FormField label="当前价值" required :error="errors.currentValue">
        <input
          v-model="form.currentValue"
          class="form-input"
          type="digit"
          placeholder="请输入当前价值"
        />
      </FormField>

      <FormField label="购买日期">
        <picker mode="date" :value="form.purchaseDate" @change="onDateChange">
          <view class="form-picker">
            <text :class="form.purchaseDate ? '' : 'placeholder'">
              {{ form.purchaseDate || '请选择日期' }}
            </text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </FormField>

      <FormField label="估值方式">
        <picker
          :value="valuationIndex"
          :range="valuationOptions"
          range-key="label"
          @change="onValuationChange"
        >
          <view class="form-picker">
            <text>{{ VALUATION_METHOD_LABELS[form.valuationMethod] }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </FormField>

      <FormField label="备注">
        <textarea
          v-model="form.note"
          class="form-textarea"
          placeholder="请输入备注信息（选填）"
          maxlength="200"
        />
      </FormField>
    </FormSection>

    <view
      v-if="isEdit && assetStore.getHistoriesByAssetId(editId).length > 0"
      class="history-section"
    >
      <text class="section-title">估值历史</text>
      <view class="history-list">
        <view
          v-for="h in assetStore.getHistoriesByAssetId(editId)"
          :key="h.id"
          class="history-item"
        >
          <view class="history-left">
            <text class="history-date">{{ h.date }}</text>
            <text class="history-note">{{ h.note }}</text>
          </view>
          <text class="history-value">{{ h.value.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <FormActions tone="blue" @save="handleSave" />
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: 60rpx;
}

.category-mode-toggle {
  display: inline-block;
  margin-top: 10rpx;
  color: $primary-color;
  font-size: 24rpx;
}

.history-section {
  margin: 20rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
    display: block;
  }
}

.history-list {
  background: $card-bg;
  border-radius: $card-radius;
  overflow: hidden;
  box-shadow: $card-shadow;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 28rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.history-left {
  .history-date {
    display: block;
    font-size: 26rpx;
    color: $text-primary;
  }

  .history-note {
    display: block;
    font-size: 24rpx;
    color: $text-hint;
    margin-top: 4rpx;
  }
}

.history-value {
  font-size: 28rpx;
  font-weight: 600;
  color: $success-color;
}
</style>
