// Data
import products from '@/data/products.json';

// Helpers
import Sleep from '@/helpers/Sleep';

export default {
	getProducts: async () => {
		try {
			await Sleep();
			const res = {
				data: products,
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
