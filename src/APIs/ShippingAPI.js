// Data
import shipping from '@/data/shipping.json';

// Helpers
import Sleep from '@/helpers/Sleep';

export default {
	getShipping: async totalItems => {
		try {
			await Sleep();
			const data = shipping.find(sh => sh.max_items <= totalItems);

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
