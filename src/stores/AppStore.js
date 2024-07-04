// Store
import { defineStore } from 'pinia';

export default defineStore('app', {
	state: () => ({
		isLoading: false
	}),
	getters: {},
	actions: {},
	persist: true
});
