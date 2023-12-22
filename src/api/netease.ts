import request from '../utils/neteaseRequest'

// 获取热搜列表
export function getHotDetail() {
  return request({
    url: '/search/hot/detail',
    method: 'get'
  });
}

// 搜索建议
export function searchSuggest(data: any) {
  return request({
    url: '/search/suggest',
    method: 'get',
    params: data
  })
}

// 歌手分类列表
export function getArtistList(data: any) {
  return request({
    url: '/artist/list',
    method: 'get',
    params: data
  });
}

// 获取歌手单曲
export function getArtists(data: any) {
  return request({
    url: '/artists',
    method: 'get',
    params: data
  });
}


// 获取歌手全部歌曲
export function getArtistSongs(data: any) {
  return request({
    url: '/artist/songs',
    method: 'get',
    params: data
  });
}

// 获取歌手专辑
export function getArtistAlbum(data: any) {
  return request({
    url: '/artist/album',
    method: 'get',
    params: data
  });
}

// 获取专辑内容
export function getAlbum(data: any) {
  return request({
    url: '/album',
    method: 'get',
    params: data
  })
}

// 搜索
export function searchSong(data: any) {
  return request({
    url: '/search',
    method: 'get',
    params: data
  });
}

// 新版搜索
export function cloudSearchSong(data: any) {
  return request({
    url: '/cloudsearch',
    method: 'get',
    params: data
  });
}


// 获取音乐url
export function getSongUrl(data: any) {
  return request({
    url: '/song/url',
    method: 'get',
    params: data
  });
}

export function getSongDetail(data: any) {
  return request({
    url: '/song/detail',
    method: 'get',
    params: data
  });
}