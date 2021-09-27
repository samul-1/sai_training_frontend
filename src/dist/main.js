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
var vue_code_highlight_1 = require("vue-code-highlight");
require("./index.css");
var Sentry = require("@sentry/vue");
var tracing_1 = require("@sentry/tracing");
var dev = process.env.NODE_ENV !== 'production';
axios_1["default"].defaults.baseURL = dev
    ? 'http://127.0.0.1:8000'
    : process.env.VUE_APP_AXIOS_BASE;
axios_1["default"].interceptors.response.use(function (response) {
    return response;
}, function (error) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) == 403 ||
        ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) == 401) {
        router_1["default"].push('/login');
    }
    console.log('ERROR', error);
    store_1["default"].commit('pushNotification', {
        message: 'Si è verificato un errore: ' +
            ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : error.message) +
            ' ' +
            ((_j = (_h = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data.message) !== null && _f !== void 0 ? _f : (_g = error.response) === null || _g === void 0 ? void 0 : _g.data.detail) !== null && _h !== void 0 ? _h : error.statusText) !== null && _j !== void 0 ? _j : ''),
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
var app = vue_1.createApp(App_vue_1["default"]);
app
    .use(vue3_google_oauth2_1["default"], gAuthOptions)
    .use(vue_axios_1["default"], axios_1["default"])
    .use(store_1["default"])
    .use(router_1["default"])
    .use(vue_code_highlight_1["default"])
    .mount('#app');
Sentry.init({
    app: app,
    dsn: 'https://771586995fe64d069b3b42a357de621b@o1003719.ingest.sentry.io/5964305',
    integrations: [
        new tracing_1.Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router_1["default"]),
            tracingOrigins: ['localhost', 'sai.di.unipi.it:9090', /^\//]
        }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.7,
    logErrors: true
});
