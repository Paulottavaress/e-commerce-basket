// Data
import users from '@/data/users.json';
import convertionRatio from '@/data/convertionRatio';

// Helpers
import { cloneDeep } from 'lodash';
// APIs
import { ProductsAPI } from '@/APIs';

// Store
import { AuthStore } from '@/stores';

export default {
	getOneUser: async (email, password) => {
		try {
			const user = AuthStore._pinia.state._value.auth.user;

			const data = cloneDeep(
				user
					? user
					: users.find(
							user => user.email === email && user.password === password
					  )
			);

			if (data && data.basket.products) {
				let products = await ProductsAPI.getProducts();
				products = products.data;

				data.basket.products = data.basket.products.map(item => {
					let product = products.find(prod => item.id === prod.id);

					return {
						...item,
						...product
					};
				});
			}

			const status = data ? 200 : 422;

			const res = {
				data: data || [],
				request: {
					status
				}
			};

			return res;
		} catch (e) {
			return e;
		}
	},
	getOneUserBasket: async id => {
		try {
			let data = [];
			const user = AuthStore._pinia.state._value.auth.user;

			if (user.basket.products) {
				let products = await ProductsAPI.getProducts();
				products = products.data;

				const { EURUSD } = convertionRatio;

				user.basket.products = user.basket.products.map(item => {
					let product = products.find(prod => item.id === prod.id);

					const USDPrice =
						product.currency === 'USD' ? product.price : product.price * EURUSD;

					const EURPrice =
						product.currency === 'EUR' ? product.price : product.price / EURUSD;

					return {
						...item,
						...product,
						USDPrice,
						EURPrice
					};
				});

				data = user.basket;
			}

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
