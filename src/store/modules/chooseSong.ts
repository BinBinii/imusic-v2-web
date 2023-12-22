import { defineStore } from 'pinia'

export type ChooseSong = {
  song: any;
  from: string;
}

export type ChooseSongState = {
  songList: ChooseSong[],
  isPlaySong: ChooseSong,
}

export const useChooseSongStore = defineStore('home', {
  state: (): ChooseSongState => ({
    songList: [] as ChooseSong[],
    isPlaySong: {} as ChooseSong,
  }),
  getters: {
    getSongList(): ChooseSong[] {
      return this.songList;
    },
    getIsPlaySong(): ChooseSong {
      return this.isPlaySong;
    }
  },
  actions: {
    addSong(chooseSong: any) {
      this.songList.push(chooseSong)
    },
    syncSong(chooseSongList: ChooseSong[]) {
      this.songList = chooseSongList
    },
    setIsPlaySong(playSong: ChooseSong) {
      this.isPlaySong = playSong
    }
  },
})