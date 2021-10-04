/* eslint-disable */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import GAuth from 'vue3-google-oauth2';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCodeHighlight from 'vue-code-highlight';
import './index.css';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';

const dev = process.env.NODE_ENV !== 'production';

axios.defaults.baseURL = dev
  ? 'http://127.0.0.1:8000'
  : process.env.VUE_APP_AXIOS_BASE;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response?.status == 403 ||
      error.response?.status == 401
    ) {
      router.push('/login');
    }
    console.log('ERROR', error);
    store.commit('pushNotification', {
      message:
        'Si è verificato un errore: ' +
        (error.response?.status ?? error.message) +
        ' ' +
        (error.response?.data.message ??
          error.response?.data.detail ??
          error.statusText ??
          ''),
      autoHide: 5000,
      severity: 2,
    });
    throw error;
  }
);

const gAuthOptions = {
  clientId:
    '956826904172-mcsaj1bqcllv93bpad7dmd0e3oil4758.apps.googleusercontent.com',
  scope: 'email',
  prompt: 'consent',
  fetch_basic_profile: false,
  //hosted_domain: ["studenti.unipi.it"]
};

const app = createApp(App);

app
  .use(GAuth, gAuthOptions)
  .use(VueAxios, axios)
  .use(store)
  .use(router)
  .use(VueCodeHighlight)
  .mount('#app');

Sentry.init({
  app,
  dsn: 'https://771586995fe64d069b3b42a357de621b@o1003719.ingest.sentry.io/5964305',
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['sai.di.unipi.it:9090', /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.7,
  logErrors: true,
});
