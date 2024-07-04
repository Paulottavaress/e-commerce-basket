export default async () => {
	const isSleeping = import.meta.env.VITE_IS_SLEEPING.toLowerCase() === 'true';
	const ms = import.meta.env.VITE_SLEEPING_MS || 3000;

	return isSleeping
		? await new Promise(resolve => setTimeout(resolve, ms))
		: null;
};
