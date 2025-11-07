import 'uno.css'

import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(createPinia())
app.use(router)

pinia.use(piniaPluginPersistedstate)

app.mount('#app')
