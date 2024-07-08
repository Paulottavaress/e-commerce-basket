// Store
import { defineStore } from 'pinia';

export default defineStore('app', {
	state: () => ({
		isLoading: false,
		products: null
	}),
	getters: {},
	actions: {},
	persist: true
});
