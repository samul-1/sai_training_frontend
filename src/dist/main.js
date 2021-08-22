"use strict";
/* eslint-disable */
exports.__esModule = true;
var vue_1 = require("vue");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
var store_1 = require("./store");
var vue3_google_oauth2_1 = require("vue3-google-oauth2");
var axios_1 = require("axios");
var vue_axios_1 = require("vue-axios");
require("./index.css");
var dev = process.env.NODE_ENV !== 'production';
axios_1["default"].defaults.baseURL = dev
    ? 'http://127.0.0.1:8000'
    : process.env.VUE_APP_AXIOS_BASE;
axios_1["default"].interceptors.response.use(function (response) {
    return response;
}, function (error) {
    var _a, _b;
    if (error.response.status == 403 ||
        error.response.status == 401) {
        router_1["default"].push('/login');
    }
    console.log(error.response);
    store_1["default"].commit('pushNotification', {
        message: 'Si è verificato un errore: ' +
            error.response.status +
            ' ' +
            ((_b = (_a = error.response.data.message) !== null && _a !== void 0 ? _a : error.response.data.detail) !== null && _b !== void 0 ? _b : error.statusText),
        autoHide: 5000,
        severity: 2
    });
    throw error;
});
var gAuthOptions = {
    clientId: '956826904172-mcsaj1bqcllv93bpad7dmd0e3oil4758.apps.googleusercontent.com',
    scope: 'email',
    prompt: 'consent',
    fetch_basic_profile: false
};
vue_1.createApp(App_vue_1["default"])
    .use(vue3_google_oauth2_1["default"], gAuthOptions)
    .use(vue_axios_1["default"], axios_1["default"])
    .use(store_1["default"])
    .use(router_1["default"])
    .mount('#app');
