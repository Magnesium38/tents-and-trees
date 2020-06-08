import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: 'https://92ec602d98c84f0fbad8ac707be017ec@sentry.io/5189508',
		integrations: [
			new Integrations.Vue({
				Vue,
				attachProps: true,
				logErrors: true,
			}),
		],
	})
}
