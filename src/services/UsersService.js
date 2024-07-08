// APIs
import { UsersAPI } from '@/APIs';

// Handlers
import { displayErr, displaySuccess } from '@/handlers/NotificationsHandler';

// Helpers
import Sleep from '@/helpers/Sleep';
import internalServerError from '@/helpers/InternalServerError';

export default {
	// Open
	login: async (email, password) => {
		await Sleep();
		const is500 = internalServerError();

		const res = is500
			? {
					data: [],
					request: {
						status: 500
					}
			  }
			: await UsersAPI.getOneUser(email, password);

		if (res.request.status === 422) {
			const notificationMsg = 'Email or password is invalid';
			const notificationDescription = 'You can still try two more times.';
			displayErr({ notificationMsg, notificationDescription });
		} else if (res.request.status === 200) {
			const notificationMsg = 'Succesfully logged in';
			displaySuccess({ notificationMsg });
		} else {
			const notificationMsg = 'Login unavailable';
			const notificationDescription = 'Try again or get in touch with us';
			displayErr({ notificationMsg, notificationDescription });
			// NOTE: If the code reaches this point, we should see this error on Sentry
		}

		return res;
	},
	// Closed
	fetchBasket: async id => {
		await Sleep();
		const is500 = internalServerError();

		const res = is500
			? {
					data: [],
					request: {
						status: 500
					}
			  }
			: await UsersAPI.getOneUserBasket(id);

		if (res.request.status === 500) {
			const notificationMsg = 'An unexpected error occurred';
			const notificationDescription = 'Try again or get in touch with us';
			displayErr({ notificationMsg, notificationDescription });
			// NOTE: If the code reaches this point, we should see this error on Sentry
		}

		return res;
	}
};
