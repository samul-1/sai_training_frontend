"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = require("vue");

var _store = _interopRequireDefault(require("../store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Vue3GoogleOauth;
Vue3GoogleOauth = (0, _vue.reactive)({
  isInit: false,
  isAuthorized: false,
  hadError: false
});

var googleAuth = function () {
  function installClient() {
    var apiUrl = 'https://apis.google.com/js/api.js';
    return new Promise(function (resolve) {
      var script = document.createElement('script');
      script.src = apiUrl;

      script.onreadystatechange = script.onload = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          setTimeout(function () {
            resolve();
          }, 500);
        }
      };

      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }

  function initClient(config) {
    return new Promise(function (resolve, reject) {
      window.gapi.load('auth2', function () {
        window.gapi.auth2.init(config).then(function () {
          resolve(window.gapi);
        })["catch"](function (error) {
          reject(error);
        });
      });
    });
  }

  function Auth() {
    var _this = this;

    if (!(this instanceof Auth)) return new Auth();
    this.instance = null;
    /* window.gapi.auth2.getAuthInstance() */

    this.load = function (config) {
      installClient().then(function () {
        return initClient(config);
      }).then(function (gapi) {
        _this.instance = gapi.auth2.getAuthInstance();
        _this.prompt = config.prompt;
        Vue3GoogleOauth.instance = gapi.auth2.getAuthInstance();
        Vue3GoogleOauth.isInit = true;
        Vue3GoogleOauth.isAuthorized = _this.instance.isSignedIn.get();
      })["catch"](function (error) {
        _store["default"].commit('pushNotification', {
          severity: 2,
          autoHide: 9000,
          message: 'Pare che tu sia in modalità in incognito o abbia disattivato i cookie. Se non è così e non riesci ad accedere, inviaci una segnalazione.'
        });

        Vue3GoogleOauth.hadError = true; // throw error
        // console.error(error)
      });
    };

    this.signIn = function () {
      return new Promise(function (resolve, reject) {
        if (!_this.instance) {
          reject(false);
          return;
        }

        _this.instance.signIn().then(function (googleUser) {
          Vue3GoogleOauth.isAuthorized = _this.instance.isSignedIn.get();
          resolve(googleUser);
        })["catch"](function (error) {
          reject(error);
        });
      });
    };

    this.getAuthCode = function () {
      return new Promise(function (resolve, reject) {
        if (!_this.instance) {
          reject(false);
          return;
        }

        _this.instance.grantOfflineAccess({
          prompt: _this.prompt
        }).then(function (resp) {
          resolve(resp.code);
        })["catch"](function (error) {
          reject(error);
        });
      });
    };

    this.signOut = function () {
      return new Promise(function (resolve, reject) {
        if (!_this.instance) {
          reject(false);
          return;
        }

        _this.instance.signOut().then(function () {
          Vue3GoogleOauth.isAuthorized = false;
          resolve(true);
        })["catch"](function (error) {
          reject(error);
        });
      });
    };
  }

  return new Auth();
}();

var _default = {
  install: function install(app, options) {
    /* eslint-disable */
    //set config
    var config = null;
    var defaultConfig = {
      scope: 'profile',
      prompt: 'select_account'
    };

    if (_typeof(options) === 'object') {
      config = Object.assign(defaultConfig, options);

      if (!options.clientId) {
        throw new Error('clientId is require');
      }
    } else {
      throw new TypeError('invalid option type. Object type accepted only');
    } //Install Vue plugin


    googleAuth.load(config);
    app.config.globalProperties.$gAuth = googleAuth;
    app.provide('Vue3GoogleOauth', (0, _vue.readonly)(Vue3GoogleOauth));
  }
};
exports["default"] = _default;