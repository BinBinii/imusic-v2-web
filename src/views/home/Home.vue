<template>
  <div class="home">
    
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

// 实时通讯
const webSocket = ref({} as WebSocket)

onMounted(() => {
  initWebsocket()
})

onBeforeUnmount(() => {
  webSocket.value.close()
})

/**
 * 连接Netty服务器
 */
 const initWebsocket = (): void => {
  webSocket.value = new WebSocket('ws:/127.0.0.1:8000/netty.io?data=manager');
  webSocket.value.onmessage = (event) => {
    let msg = JSON.parse(event.data);
    switch (msg.cmd) {
      case "000":
        setInterval(() => { webSocket.value.send("heartbeat") }, 60 * 1000);
        break;
      case "001":
        console.log("收到新的消息请查看")
        break;
    }
  }
  webSocket.value.onclose = () => {
    console.log("连接关闭")
    // setTimeout(() => {
    //     console.log("正在重连...")
    //     initWebsocket();
    // }, 3 * 1000);
  }
  webSocket.value.onerror = () => {
    console.log("连接错误")
    // setTimeout(() => {
    //     console.log("正在重连...")
    //     initWebsocket();
    // }, 3 * 1000);
  }
}

/**
 * 发送消息
 * @param user 接受人ID
 * @param msg  消息文本
 */
const sendMsg = (user: string, msg: string): void => {
  webSocket.value.send(JSON.stringify({ 'toUser': user, 'toMsg': msg }))
}
</script>
<style scoped lang="less">
</style>