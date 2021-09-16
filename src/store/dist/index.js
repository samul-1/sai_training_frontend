"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var vuex_1 = require("vuex");
exports["default"] = vuex_1.createStore({
    state: {
        token: '',
        refreshToken: '',
        user: {},
        notification: {}
    },
    mutations: {
        initStore: function (state) {
            var _a;
            var token = localStorage.getItem('token');
            var refreshToken = localStorage.getItem('refreshToken');
            var user = JSON.parse((_a = localStorage.getItem('user')) !== null && _a !== void 0 ? _a : '{}');
            if (token) {
                state.token = token;
                axios_1["default"].defaults.headers.common['Authorization'] =
                    'Bearer ' + token;
            }
            if (refreshToken) {
                state.refreshToken = refreshToken;
            }
            if (user) {
                state.user = user;
            }
        },
        setUser: function (state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        setToken: function (state, token) {
            state.token = token;
            localStorage.setItem('token', token);
            axios_1["default"].defaults.headers.common['Authorization'] =
                'Bearer ' + token;
            console.log("in setToken: axios.defaults.headers.common['Authorization']", axios_1["default"].defaults.headers.common['Authorization']);
        },
        resetToken: function (state) {
            state.token = '';
            localStorage.removeItem('token');
            axios_1["default"].defaults.headers.common['Authorization'] = '';
        },
        setRefreshToken: function (state, token) {
            state.refreshToken = token;
            localStorage.setItem('refreshToken', token);
        },
        pushNotification: function (state, notification) {
            state.notification = notification;
            if (notification.autoHide > 0) {
                setTimeout(function () {
                    state.notification = {};
                }, notification.autoHide);
            }
        }
    },
    getters: {
        isAuthenticated: function (state) {
            return !!state.token;
        }
    },
    actions: {
        // converts a token issued by Google to a token usable to authenticate requests to the backend
        convertToken: function (_a, token) {
            var commit = _a.commit;
            console.log('converting token...');
            return new Promise(function (resolve, reject) {
                axios_1["default"]
                    .post('/auth/convert-token', {
                    token: token,
                    grant_type: 'convert_token',
                    client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
                    client_secret: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET,
                    backend: 'google-oauth2'
                })
                    .then(function (response) {
                    console.log('committing setToken');
                    commit('setToken', response.data.access_token);
                    console.log('committing setRefreshToken');
                    commit('setRefreshToken', response.data.refresh_token);
                    console.log('resolving');
                    resolve(response);
                })["catch"](function (error) {
                    reject(error);
                });
            });
        },
        getUserData: function (_a) {
            var commit = _a.commit;
            console.log('getting user...');
            console.log("axios.defaults.headers.common['Authorization']", axios_1["default"].defaults.headers.common['Authorization']);
            return new Promise(function (resolve, reject) {
                axios_1["default"]
                    .get('/users/me')
                    .then(function (response) {
                    commit('setUser', response.data);
                    resolve(response);
                })["catch"](function (error) {
                    reject(error);
                });
            });
        }
    },
    modules: {}
});
