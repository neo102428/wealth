import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types'
import { mockUser } from '@/mock'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({ ...mockUser })
  const isLoggedIn = ref(true)

  const userName = computed(() => userInfo.value.name)
  const userAvatar = computed(() => userInfo.value.avatar)

  function updateUser(data: Partial<UserInfo>) {
    userInfo.value = { ...userInfo.value, ...data }
  }

  function logout() {
    userInfo.value = { id: '', name: '', avatar: '', phone: '', email: '' }
    isLoggedIn.value = false
  }

  return { userInfo, isLoggedIn, userName, userAvatar, updateUser, logout }
})
