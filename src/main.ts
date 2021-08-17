/* eslint-disable */

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import GAuth from "vue3-google-oauth2"
import axios from 'axios'
import VueAxios from 'vue-axios'
import './index.css'

const dev = process.env.NODE_ENV !== 'production'

axios.defaults.baseURL = dev
  ? 'http://127.0.0.1:8000'
  : process.env.VUE_APP_AXIOS_BASE

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status == 403 || error.response.status == 401) {
      router.push("/login")
    }
    throw error
  }
)

const gAuthOptions = {
    clientId: '956826904172-mcsaj1bqcllv93bpad7dmd0e3oil4758.apps.googleusercontent.com',
    scope: 'email',
    prompt: 'consent',
    fetch_basic_profile: false,
    hosted_domain: ["studenti.unipi.it"]
    
}

createApp(App).use(GAuth, gAuthOptions).use(VueAxios, axios).use(store).use(router).mount("#app");

