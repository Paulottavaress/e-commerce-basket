// APIs
import { ProductsAPI } from '@/APIs';

// Handlers
import { displayErr } from '@/handlers/NotificationsHandler';

export default {
	fetchAllProducts: async () => {
		const res = await ProductsAPI.getProducts();

		if (res.request.status !== 200) {
			const notificationMsg = 'An error occurred';
			const notificationDescription = 'Please try again or reach out to us.';
			displayErr({ notificationMsg, notificationDescription });
			// TO-DO: If the code reaches this point, we should see this error on Sentry
		}

		return res;
	}
};
