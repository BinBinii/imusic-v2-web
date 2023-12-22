<template>
  <div class="song-item" v-if="chooseSongStore.getSongList.length > 0" v-for="song in chooseSongStore.getSongList">
    <div class="pic"></div>
    <!-- <img class="pic" :src="song['song']['al']['picUrl']" /> -->
    <div class="info">
      <p class="name">{{ song['song']['name'] }}</p>
      <p class="artist">{{ singerSummary(song['song']['artists']) }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useChooseSongStore } from '../../store/modules/chooseSong';

// store
const chooseSongStore = useChooseSongStore()

onMounted(() => {
  
})

// 歌手汇总
const singerSummary = (singers: any[]): string => {
  let result = ''
  singers.forEach(item => {
    result += item['name'] + ' '
  })
  return result
}

</script>
<style scoped lang="less">
.song-item {
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
</style>