// APIs
import { PaymentAPI } from '@/APIs';

// Handlers
import { displayErr, displaySuccess } from '@/handlers/NotificationsHandler';

// Helpers
import Sleep from '@/helpers/Sleep';
import internalServerError from '@/helpers/InternalServerError';

export default {
	checkout: async (id, selectedShippingMethod) => {
		await Sleep();

		const is500 = internalServerError();

		const res = is500
			? { request: { status: 500 } }
			: await PaymentAPI.postPayment(id, selectedShippingMethod);

		if (res.request.status === 204) {
			const notificationMsg = 'Your order has been placed';
			const notificationDescription = 'Thank you for shopping with us.';
			displaySuccess({ notificationMsg, notificationDescription });
		} else {
			const notificationMsg = 'An unexpected error occurred';
			const notificationDescription = 'Try again or get in touch with us';
			displayErr({ notificationMsg, notificationDescription });
			// NOTE: If the code reaches this point, we should see this error on Sentry
		}

		return res;
	}
};
