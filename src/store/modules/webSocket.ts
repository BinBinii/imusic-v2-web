import { defineStore } from "pinia";
import { useChooseSongStore } from "./chooseSong";
import { getChooseSong } from '../../api/song'

const chooseSongStore = useChooseSongStore()

export const useSocketStore = defineStore({
  id: 'websocket',
  state: () => ({
    socket: null as WebSocket | null
  }),
  actions: {
    connect(url: string): void {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
      };

      this.socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.cmd) {
          case "000":
            setInterval(() => { this.sendMessage("heartbeat") }, 30 * 1000);
            getChooseSong().then(res => {
              chooseSongStore.syncSong(res.data.result)
              setTimeout(() => {
                chooseSongStore.setIsPlaySong(res.data.result[0])
              }, 300)
            })
            break;
          case "001":
            if (msg.data === 'updateSong') {
              getChooseSong().then(res => {
                chooseSongStore.syncSong(res.data.result)
                if (res.data.result.length == 1) {
                  chooseSongStore.setIsPlaySong(res.data.result[0])
                }
              })
            }
            if (msg.data === 'nextSong') {
              getChooseSong().then(res => {
                chooseSongStore.syncSong(res.data.result)
                setTimeout(() => {
                  chooseSongStore.setIsPlaySong(res.data.result[0])
                }, 300)
              })
            }
            break;
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    },
    sendMessage(message: string): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message)
      }
    },
    disconnect(): void {
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
    }
  }
})