import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		searchParams: {
			search: url.searchParams.get('search') || '',
			status: url.searchParams.get('status') || 'all',
			sort: url.searchParams.get('sort') || 'createdAt',
			page: Number(url.searchParams.get('page')) || 1
		}
	};
};
