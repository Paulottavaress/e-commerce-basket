//Vue
import { createRouter, createWebHistory } from 'vue-router';

//Store
import { AuthStore } from '@/stores';

//Handlers
import { warn } from '@/handlers/NotificationsHandler';

export const authRoutesList = ['Login'];
export const unblockedRoutes = ['NotFoundPage', 'ProductsList'];

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
		},
		{
			path: '/cart',
			name: 'Cart',
			component: () => import('@/views/CartView.vue')
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import('@/views/LoginView.vue')
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFoundPage',
			component: () => import('@/views/NotFoundView.vue')
		}
	]
});

router.beforeEach(async (to, from, next) => {
	const { isAuthenticated } = AuthStore();

	if (authRoutesList.includes(to.name) && isAuthenticated) {
		const notificationMsg = 'You have already signed in.';
		warn({ notificationMsg });
		next({ name: 'ProductsList' });
	} else if (
		!authRoutesList.includes(to.name) &&
		!isAuthenticated &&
		!unblockedRoutes.includes(to.name)
	) {
		const notificationMsg = 'You must be connected to access this page.';
		warn({ notificationMsg });
		next({ name: 'Login' });
	} else next();
});

export default router;
