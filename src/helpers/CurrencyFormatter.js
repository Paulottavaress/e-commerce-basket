export default (currency, val) => {
	const currencyFormatter = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2
	});

	const formattedVal = currencyFormatter.format(val);

	return formattedVal;
};
