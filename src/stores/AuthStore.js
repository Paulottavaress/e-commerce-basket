// Store
import { defineStore } from 'pinia';

export default defineStore('auth', {
	state: () => ({
		user: null
	}),
	getters: {
		isAuthenticated(state) {
			return state.user !== null;
		},
		userFirstName(state) {
			return state.user?.first_name || '';
		},
		userLastName(state) {
			return state.user?.last_name || '';
		},
		userNameInitials(state) {
			if (!state.user) return '';

			const splitFirstUserName = this.userFirstName.split(' ');
			const splitLastUserName = this.userLastName.split(' ');

			let initals = splitFirstUserName[0][0];

			if (splitFirstUserName.length > 1) initals += splitFirstUserName[1][0];
			else if (splitLastUserName[0]) initals += splitLastUserName[0][0];
			else initals += splitFirstUserName[0][1];

			return initals;
		}
	},
	actions: {},
	persist: true
});
