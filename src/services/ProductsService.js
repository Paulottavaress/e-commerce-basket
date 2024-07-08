// APIs
import { ProductsAPI } from '@/APIs';

// Handlers
import { displayErr } from '@/handlers/NotificationsHandler';

// Helpers
import Sleep from '@/helpers/Sleep';
import internalServerError from '@/helpers/InternalServerError';


export default {
	fetchAllProducts: async () => {
		await Sleep();
		const is500 = internalServerError();

		const res = is500
			? {
					data: [],
					request: {
						status: 500
					}
			  }
			: await ProductsAPI.getProducts();

		if (res.request.status !== 200) {
			const notificationMsg = 'An error occurred';
			const notificationDescription = 'Please try again or reach out to us.';
			displayErr({ notificationMsg, notificationDescription });
			// NOTE: If the code reaches this point, we should see this error on Sentry
		}

		return res;
	}
};
