import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
// >>New - Configuring Auth Module
Auth.configure(awsconfig);

const app = createApp(App)

app.use(router)

app.mount('#app')
