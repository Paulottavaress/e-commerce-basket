// APIs
import { UsersAPI } from '@/APIs';

// Handlers
import { displayErr, displaySuccess } from '@/handlers/NotificationsHandler';

export default {
	login: async (email, password) => {
		const res = await UsersAPI.getOneUser(email, password);

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
			// TO-DO: If the code reaches this point, we should see this error on Sentry
		}

		return res;
	}
};
