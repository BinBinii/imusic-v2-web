export default {
  path: '/home',
  component: () => import('../../views/home/Home.vue'),
  children: [{
    path: 'search',
    name: 'Search',
    component: () => import('../../views/search/Search.vue'),
  }, {
    path: 'song',
    name: 'Song',
    component: () => import('../../views/song/Song.vue'),
  }],
}