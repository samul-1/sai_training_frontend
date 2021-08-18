import axios from 'axios';
import { createStore } from 'vuex';

export default createStore({
  state: {
    token: '',
    refreshToken: '',
    user: {},
    notification: {},
  },
  mutations: {
    initStore: (state) => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');

      if (token) {
        state.token = token;
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + token;
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      if (user) {
        state.user = user;
      }
    },
    setUser: (state, user) => {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken: (state, token) => {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + token;
    },
    resetToken: (state) => {
      state.token = '';
      localStorage.removeItem('token');
      axios.defaults.headers.common['Authorization'] = '';
    },
    setRefreshToken: (state, token) => {
      state.refreshToken = token;
      localStorage.setItem('refreshToken', token);
    },
    pushNotification: (state, notification) => {
      state.notification = notification;
      if (notification.autoHide > 0) {
        setTimeout(() => {
          state.notification = {};
        }, notification.autoHide);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.token;
    },
  },
  actions: {
    // converts a token issued by Google to a token usable to authenticate requests to the backend
    convertToken: ({ commit }, token) => {
      console.log('converting token...');
      return new Promise((resolve, reject) => {
        axios
          .post('/auth/convert-token', {
            token,
            grant_type: 'convert_token',
            client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
            client_secret:
              process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET,
            backend: 'google-oauth2',
          })
          .then((response) => {
            commit('setToken', response.data.access_token);
            commit('setRefreshToken', response.data.refresh_token);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getUserData: ({ commit }) => {
      console.log('getting user...');
      return new Promise((resolve, reject) => {
        axios
          .get('/users/me')
          .then((response) => {
            commit('setUser', response.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  modules: {},
});
