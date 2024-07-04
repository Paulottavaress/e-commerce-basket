//Vue
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'Home',
			redirect: 'products-list'
		},
		{
			path: '/products-list',
			name: 'ProductsList',
			component: () => import('@/views/ProductsListView.vue')
		}
	]
});

export default router;
