<template>
  <div class="home">
    <div class="song-box">
      <RouterView />
    </div>
    <div class="play-box" v-if="currentSongInfo['id'] && currentSongInfo['id'] !== null && currentSongInfo['id'] !== ''">
      <img class="pic" :src="currentSongInfo['al']['picUrl']" />
      <div class="info">{{ currentSongInfo['name'] }}</div>
      <n-icon class="icon" @click="nextSong">
        <PlayForward />
      </n-icon>
    </div>
    <div class="nav">
      <div class="nav-item" :class="navIndex === 0 ? 'nav-item-selected' : ''" @click="handleNav(0)">
        <n-icon size="23" class="icon">
          <CaretForwardCircle />
        </n-icon>
        <p>现在收听</p>
      </div>
      <div class="nav-item" :class="navIndex === 1 ? 'nav-item-selected' : ''" @click="handleNav(1)">
        <n-icon size="23" class="icon">
          <Search />
        </n-icon>
        <p>搜索</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { NIcon } from 'naive-ui'
import { CaretForwardCircle, Search, PlayForward } from '@vicons/ionicons5'
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from '../../store/modules/user'
import { useChooseSongStore } from '../../store/modules/chooseSong';
import { useSocketStore } from '../../store/modules/webSocket'
import { register as registerApi } from '../../api/user';
import { getSongDetail as getSongDetailApi } from '../../api/netease';
import { nextSong as nextSongApi } from '../../api/song'

// 路由
const router = useRouter()
const route = useRoute()

// store
const userStore = useUserStore()
const chooseSongStore = useChooseSongStore()
const socketStore = useSocketStore()

// 歌曲
const currentSongInfo = ref({} as any)

const navIndex = ref(0)

const userInfo = ref({} as any)

onMounted(() => {
  let key = route.query.key
  if (userStore.getToken && userStore.getToken !== '' && userStore.getToken !== null) {
    userStore.getInfo().then(res => {
      userInfo.value = res
    }).catch(err => {
      console.log(err)
    })
    initWebsocket()
  }
  if (key === 'binbini0626') {
    autoLogin()
  }
})

chooseSongStore.$subscribe((_, state: any) => {
  if (chooseSongStore.songLock === false) {
    let song = state.isPlaySong.song
    getSongDetailApi({
      ids: song['id']
    }).then(res => {
      currentSongInfo.value = res.data.songs[0]
    })
  }
  if (state.songList.length == 0) {
    currentSongInfo.value = {}
  }
})

onBeforeUnmount(() => {
  socketStore.disconnect()
})

/**
 * 连接Netty服务器
 */
const initWebsocket = (): void => {
  // let url = 'ws://127.0.0.1:8000/netty.io?data=' + userStore.getToken
  let url = 'ws://8.134.51.235/wss/netty.io?data=' + userStore.getToken
  socketStore.connect(url)
}

// 自动注册&登录
const autoLogin = (): void => {
  let params = generateRegisterParams()
  registerApi(params).then(regRes => {
    if (regRes.data.result === 1) {
      userStore.login({
        account: params['account'],
        password: params['password']
      }).then(loginRes => {
        console.log(loginRes)
        userStore.getInfo().then(res => {
          userInfo.value = res
        }).catch(err => {
          console.log(err)
        })
        initWebsocket()
      })
    }
  })
}

// 生成注册实体
const generateRegisterParams = (): any => {
  let obj = {
    nickname: getRandomName(),
    account: getRandomAccount(),
    password: '123456',
    role: 'USER'
  }
  return obj
}

// 随机昵称
const getRandomName = (): string => {
  let result = '用户'
  for (let i = 0; i < 6; i++) {
    let n = Math.floor(Math.random() * 9)
    result += n
  }
  return result
}

// 随机账号
const getRandomAccount = (): string => {
  let result = ''
  for (let i = 0; i < 8; i++) {
    let n = Math.floor(Math.random() * 9)
    result += n
  }
  return result
}

// 下一首
const nextSong = (): void => {
  nextSongApi()
  setTimeout(() => {
    sendMsg('all', 'nextSong')
  }, 500)
}

// 跳转
const handleNav = (index: number): void => {
  if (index === 0) {
    navIndex.value = index
    router.push('/home/song')
  }
  if (index === 1) {
    navIndex.value = index
    router.push('/home/search')
  }
}

/**
 * 发送消息
 * @param user 接受人ID
 * @param msg  消息文本
 */
const sendMsg = (user: string, msg: string): void => {
  socketStore.sendMessage(JSON.stringify({ 'toUser': user, 'toMsg': msg }))
}

</script>
<style scoped lang="less">
.home {
  height: 100vh;
}

.song-box {
  width: 100%;
  height: 100vh;
  padding-top: 8px;
  // padding-bottom: 8rem;
}

.play-box {
  position: fixed;
  bottom: 10vh;
  margin: 0 auto;
  width: 95%;
  height: 1.5rem;
  border-radius: 12px;
  background-color: var(--theme-play-background);
  left: 50%;
  transform: translate(-50%, 0);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, .15);
  z-index: 99;

  .pic {
    margin: 8px;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 6px;
    background-color: #CCC;
    margin-right: 15px;
    float: left;
  }

  .info {
    float: left;
    line-height: 1.4rem;
    font-size: 0.42rem;
  }

  .icon {
    float: right;
    margin: 12px;
    font-size: 0.9rem
  }
}

.nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 20vh;
  background-color: var(--theme-nav-background);
  mask-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 1) 65%);
  display: flex;

  .nav-item {
    position: relative;
    top: 52%;
    width: 50%;
    height: 100%;
    text-align: center;
    font-size: 0.28rem;
    color: var(--theme-search-text);

    .icon {
      margin-top: 5px;
      position: relative;
      top: 5px;
    }
  }

  .nav-item-selected {
    color: var(--theme-center-color);
  }
}
</style>