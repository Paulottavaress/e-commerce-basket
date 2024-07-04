// Vue
import { createApp } from 'vue';

// Src
import App from '@/App.vue';
import router from '@/router';

// Libs
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi
		}
	}
});

const pinia = createPinia();

pinia.use(
	createPersistedState({
		storage: sessionStorage
	})
);

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(pinia);

app.mount('#app');
