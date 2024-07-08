// Data
import products from '@/data/products.json';

// Helpers
import { cloneDeep } from 'lodash';

// Store
import { AppStore } from '@/stores';

export default {
	getProducts: async () => {
		try {
			const prods = AppStore._pinia.state._value.app.products;
			const data = cloneDeep(prods?.length ? prods : products);

			const res = {
				data,
				request: {
					status: 200
				}
			};

			return res;
		} catch (e) {
			return e;
		}
	}
};
