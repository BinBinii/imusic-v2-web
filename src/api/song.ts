import request from '../utils/iMusicRequest'

// 添加歌曲
export function addSong(data: any) {
  return request({
    url: '/song/add',
    method: 'post',
    data
  });
}

// 下一首
export function nextSong() {
  return request({
    url: '/song/next',
    method: 'post'
  });
}

// 乱序
export function shuffleSong() {
  return request({
    url: '/song/shuffle',
    method: 'post'
  })
}

// 获取已点歌曲
export function getChooseSong() {
  return request({
    url: '/song/get/list',
    method: 'get'
  });
}
