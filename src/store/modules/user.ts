import { defineStore } from 'pinia'
import { ACCESS_TOKEN, REFRESH_TOKEN, CURRENT_USER } from '../../store/mutation-types';
import { storage } from '../../utils/Storage';
import { login as loginApi, userInfo as userInfoApi } from '../../api/user'

export type UserInfoType = {
  nickname: string;
  account: string;
}

export interface IUserState {
  token: string;
  refreshToken: string;
  info: UserInfoType;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    refreshToken: storage.get(REFRESH_TOKEN, ''),
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
    getUserInfo(): UserInfoType {
      return this.info;
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = (await loginApi(params)).data.result
      const ex = 1 * 24 * 60 * 60;
      const refreshEx = 30 * 24 * 60 * 60
      storage.set(ACCESS_TOKEN, response['accessToken'], ex)
      storage.set(REFRESH_TOKEN, response['refreshToken'], refreshEx);
      storage.set(CURRENT_USER, response, ex);
      this.setToken(response['accessToken']);
      this.setRefreshToken(response['refreshToken']);
      return response;
    },

    // 获取用户信息
    async getInfo() {
      const response = (await userInfoApi()).data.result
      this.setUserInfo({
        nickname: response['nickname'],
        account: response['account']
      })
      return response
    },

    // 登出
    async logout() {
      this.setUserInfo({ nickname: '', account: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(REFRESH_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
})