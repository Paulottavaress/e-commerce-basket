// Data
import shipping from '@/data/shipping.json';
import convertionRatio from '@/data/convertionRatio';

export default {
	getShipping: async totalItems => {
		try {
			const data = shipping.filter(
				sh =>
					totalItems >= sh?.min_items &&
					(!sh?.max_items || totalItems <= sh?.max_items)
			);

			const { EURUSD } = convertionRatio;

			const shippingMethods = data.map(sm => {
				const USDShippingPrice =
					sm.currency === 'USD' ? sm.price : sm.price * EURUSD;

				const EURShippingPrice =
					sm.currency === 'EUR' ? sm.price : sm.price / EURUSD;

				return {
					...sm,
					USDShippingPrice,
					EURShippingPrice
				};
			});

			const res = {
				data: shippingMethods,
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
