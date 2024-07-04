// Data
import users from '@/data/users.json';

// Helpers
import Sleep from '@/helpers/Sleep';

export default {
	getOneUser: async id => {
		try {
			await Sleep();
			const data = users.find(user => user.id === id);

			const res = {
				data,
				request: {
					// TO-DO: CREATE A HELPER THAT CYCLES THE ERROR MESSAGE
					status: 200
				}
			};

			return res;
		} catch (e) {
			return e;
		}
	}
};
