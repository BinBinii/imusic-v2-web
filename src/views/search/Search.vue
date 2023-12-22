<template>
  <div class="search-box">
    <n-input class="search-input" v-model:value="searchValue" round type="text" placeholder="搜索" />
  </div>
  <div class="list-box" ref="listRef" @scroll="handleScroll">
    <div class="list-item" v-for="song in songs">
      <!-- <div class="pic"></div> -->
      <img class="pic" :src="song['al']['picUrl']" />
      <div class="info">
        <p class="name">{{ song['name'] }}</p>
        <p class="artist">{{ singerSummary(song['ar']) }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { NInput } from 'naive-ui';
import { cloudSearchSong } from '../../api/netease';
import { debounce } from 'lodash';
import { useSocketStore } from '../../store/modules/webSocket';

// store
const socketStore = useSocketStore()

// 搜索
const searchValue = ref('')
const searchParams = ref({
  keywords: '',
  limit: 30,
  offset: 0
})

// 列表
const songs = ref([] as any[])

// 加载
const listRef = ref({} as Element)
const isLoading = ref(false);

watch(searchValue, (newVal, _) => {
  if (newVal && newVal !== '' && newVal !== null) {
    handleSearch(newVal)
  } else {
    setTimeout(() => {
      songs.value = []
    }, 500)
  }
})

// 延时搜索
const handleSearch = debounce((value) => {
  searchParams.value.keywords = value
  cloudSearchSong(searchParams.value).then(res => {
    songs.value = res.data.result.songs
  })
}, 300)

// 歌手汇总
const singerSummary = (singers: any[]): string => {
  let result = ''
  if (singers) {
    singers.forEach(item => {
      result += item['name'] + ' '
    })
  }
  return result
}

/**
 * 滚动到底部加载更多
 */
const handleScroll = () => {
  const container = listRef.value
  if (container.scrollHeight - container.scrollTop === container.clientHeight) {
    loadMore();
  }
}
const loadMore = async () => {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  // 增加页数
  searchParams.value.offset = searchParams.value.offset + searchParams.value.limit;
  try {
    await cloudSearchSong(searchParams.value).then(res => {
      let newData = res.data.result.songs
      setTimeout(() => {
        // 更新数据
        songs.value = [...songs.value, ...newData];
      }, 1000)
    })
  } finally {
    // 加载完成后，设置加载状态为 false
    isLoading.value = false;
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
.search-box {
  width: 100%;
  height: 70px;
  background-color: var(--theme-background);

  .search-input {
    width: 95%;
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

.list-box {
  width: 100%;
  height: calc(100vh - 180px);
  overflow-y: auto;

  .list-item {
    padding: 5px 15px;
    clear: both;

    .pic {
      width: 1.32rem;
      height: 1.32rem;
      border-radius: 6px;
      background-color: #CCC;
      margin-right: 15px;
      float: left;
    }

    .info {
      float: left;
      width: calc(100% - 65px);
      height: 1.5rem;
      border-bottom: solid 1px var(--theme-border);

      .name {
        color: var(--theme-color);
        font-size: 0.42rem;
        margin-top: 3px;
      }

      .artist {
        font-size: 0.32rem;
        color: var(--theme-desc);
      }
    }
  }
}
</style>