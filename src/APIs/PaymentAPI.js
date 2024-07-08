// APIs
import { UsersAPI } from '@/APIs';

// Store
import { AppStore } from '@/stores';

export default {
	postPayment: async (id, selectedShippingMethod) => {
		try {
			let basket = await UsersAPI.getOneUserBasket(id);
			basket = basket.data;

			const products = AppStore._pinia.state._value.app.products;

			basket.products.forEach(item => {
				const product = products.find(prod => prod.id === item.id);

				product.amount_in_stock = product.amount_in_stock - item.amount;
			});

			AppStore._pinia.state._value.app.products = products;

			const res = {
				request: {
					status: 204
				}
			};

			return res;
		} catch (e) {
			return e;
		}
	}
};
