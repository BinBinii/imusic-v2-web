<template>
  <n-config-provider :theme="darkTheme">
    <router-view></router-view>
  </n-config-provider>
</template>
<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui'

window.document.documentElement.setAttribute('theme', 'dark');
</script>
<style lang="less">
@import './assets/css/styles.less';
</style>
