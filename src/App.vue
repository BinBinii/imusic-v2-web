<template>
  <n-config-provider :theme="theme == 1 ? darkTheme : null">
    <router-view></router-view>
  </n-config-provider>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'

const theme = ref(0)

onMounted(() => {
  checkAndSwitchTheme()
})

const checkAndSwitchTheme = (): void => {
  let currentDate = new Date()

  // 获取当前小时和分钟
  let currentHour = currentDate.getHours();
  let currentMinute = currentDate.getMinutes();

  // 设定截止时间为17:30
  const deadlineHour = 17;
  const deadlineMinute = 30;

  // 比较当前时间与截止时间
  if (currentHour > deadlineHour || (currentHour === deadlineHour && currentMinute >= deadlineMinute)) {
    theme.value = 1
  } else {
    theme.value = 0
  }

  window.document.documentElement.setAttribute('theme', theme.value == 0 ? 'light':'dark');
}
</script>
<style lang="less">
@import './assets/css/styles.less';
</style>
