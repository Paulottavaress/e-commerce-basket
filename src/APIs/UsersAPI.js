// Data
import users from '@/data/users.json';

// Helpers
import Sleep from '@/helpers/Sleep';

export default {
	getOneUser: async (email, password) => {
		try {
			await Sleep();
			const data = users.find(
				user => user.email === email && user.password === password
			);

			const res = {
				data: data || [],
				request: {
					// TO-DO: CREATE A HELPER THAT CYCLES THE ERROR MESSAGE
					status: data ? 200 : 422
				}
			};

			return res;
		} catch (e) {
			return e;
		}
	}
};
