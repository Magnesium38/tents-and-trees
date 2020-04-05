import Vue from 'vue'
import App from './App'
import './sentry'

Vue.config.productionTip = false

new Vue({
	render: h => h(App),
}).$mount('#app')
