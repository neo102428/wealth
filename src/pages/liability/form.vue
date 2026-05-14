<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import FormActions from '@/components/common/FormActions.vue'
import FormField from '@/components/common/FormField.vue'
import FormSection from '@/components/common/FormSection.vue'
import { useLiabilityStore } from '@/stores/liability'
import { useCustomLiabilityTypeStore } from '@/stores/customLiabilityType'

const liabilityStore = useLiabilityStore()
const customLiabilityTypeStore = useCustomLiabilityTypeStore()

const isEdit = ref(false)
const editId = ref('')
const isTypePreset = ref(false)

const form = ref({
  name: '',
  type: 'mortgage',
  initialAmount: '',
  remainingAmount: '',
  rate: '',
  monthlyPayment: '',
  repaymentDay: 1,
  note: '',
})

const errors = ref<Record<string, string>>({})

const typeOptions = computed(() => customLiabilityTypeStore.allLiabilityTypes)
const typeLabels = computed(() =>
  typeOptions.value.map((t) => customLiabilityTypeStore.getLabel(t)),
)

const repaymentDayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

const typeIndex = ref(0)
const repaymentDayIndex = ref(0)

onLoad((options?: any) => {
  const presetType = options?.type
  if (presetType) {
    form.value.type = presetType
    isTypePreset.value = true
    typeIndex.value = typeOptions.value.indexOf(presetType)
  }

  const id = options?.id
  if (id) {
    const liability = liabilityStore.liabilities.find((l) => l.id === id)
    if (liability) {
      isEdit.value = true
      editId.value = id
      form.value = {
        name: liability.name,
        type: liability.type,
        initialAmount: String(liability.initialAmount),
        remainingAmount: String(liability.remainingAmount),
        rate: String(liability.rate),
        monthlyPayment: String(liability.monthlyPayment),
        repaymentDay: liability.repaymentDay,
        note: liability.note,
      }
      typeIndex.value = typeOptions.value.indexOf(liability.type)
      repaymentDayIndex.value = liability.repaymentDay > 0 ? liability.repaymentDay - 1 : 0
    }
  }
})

function onTypeChange(e: any) {
  const idx = e.detail.value
  typeIndex.value = idx
  form.value.type = typeOptions.value[idx]
}

function onRepaymentDayChange(e: any) {
  const idx = e.detail.value
  repaymentDayIndex.value = idx
  form.value.repaymentDay = repaymentDayOptions[idx]
}

function validate(): boolean {
  const e: Record<string, string> = {}

  if (!form.value.name.trim()) {
    e.name = '负债名称不能为空'
  }

  const initVal = parseFloat(form.value.initialAmount)
  if (isNaN(initVal) || initVal < 0) {
    e.initialAmount = '初始金额不能小于0'
  }

  const remainVal = parseFloat(form.value.remainingAmount)
  if (isNaN(remainVal) || remainVal < 0) {
    e.remainingAmount = '当前剩余金额不能小于0'
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
    initialAmount: parseFloat(form.value.initialAmount) || 0,
    remainingAmount: parseFloat(form.value.remainingAmount) || 0,
    rate: parseFloat(form.value.rate) || 0,
    monthlyPayment: parseFloat(form.value.monthlyPayment) || 0,
    repaymentDay: form.value.repaymentDay,
    note: form.value.note.trim(),
    institution: '',
  }

  if (isEdit.value) {
    liabilityStore.updateLiability(editId.value, data)
    uni.showToast({ title: '保存成功', icon: 'success' })
  } else {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    liabilityStore.addLiability({
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
      <FormField label="负债名称" required :error="errors.name">
        <input v-model="form.name" class="form-input" placeholder="请输入负债名称" maxlength="50" />
      </FormField>

      <FormField v-if="!isTypePreset" label="负债类型" required>
        <picker :value="typeIndex" :range="typeLabels" @change="onTypeChange">
          <view class="form-picker">
            <text>{{ customLiabilityTypeStore.getLabel(form.type) }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </FormField>

      <FormField label="初始金额" required :error="errors.initialAmount">
        <input
          v-model="form.initialAmount"
          class="form-input"
          type="digit"
          placeholder="请输入初始借款金额"
        />
      </FormField>

      <FormField label="当前剩余金额" required :error="errors.remainingAmount">
        <input
          v-model="form.remainingAmount"
          class="form-input"
          type="digit"
          placeholder="请输入当前剩余未还金额"
        />
      </FormField>

      <FormField label="年利率(%)">
        <input
          v-model="form.rate"
          class="form-input"
          type="digit"
          placeholder="请输入年利率，如 4.20"
        />
      </FormField>

      <FormField label="月供金额">
        <input
          v-model="form.monthlyPayment"
          class="form-input"
          type="digit"
          placeholder="请输入每月还款金额"
        />
      </FormField>

      <FormField label="还款日">
        <picker
          :value="repaymentDayIndex"
          :range="repaymentDayOptions"
          @change="onRepaymentDayChange"
        >
          <view class="form-picker">
            <text :class="form.repaymentDay > 0 ? '' : 'placeholder'">
              {{ form.repaymentDay > 0 ? '每月' + form.repaymentDay + '日' : '请选择' }}
            </text>
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

    <FormActions tone="red" @save="handleSave" />
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: 60rpx;
}
</style>
