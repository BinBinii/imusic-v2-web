import { defineStore } from 'pinia'

export type ChooseSong = {
  song: any;
  from: string;
}

export type ChooseSongState = {
  songList: ChooseSong[],
  isPlaySong: ChooseSong,
  songLock: boolean,
}

export const useChooseSongStore = defineStore('home', {
  state: (): ChooseSongState => ({
    songList: [] as ChooseSong[],
    isPlaySong: {} as ChooseSong,
    songLock: false,
  }),
  getters: {
    getSongList(): ChooseSong[] {
      return this.songList;
    },
    getIsPlaySong(): ChooseSong {
      return this.isPlaySong;
    },
    getSongLock(): boolean {
      return this.songLock;
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
    },
    lock() {
      this.songLock = true
    },
    release() {
      this.songLock = false
    }
  },
})