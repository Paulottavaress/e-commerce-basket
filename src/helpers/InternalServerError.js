export default () => {
	const randomNum = Math.random();
	const odds = import.meta.env.VITE_500_ODDS || 0.1;
	return randomNum < odds;
};
