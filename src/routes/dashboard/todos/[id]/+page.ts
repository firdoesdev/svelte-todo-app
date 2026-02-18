import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
    const res = await fetch(`/api/todos/${params.id}`);

    if (res.status === 404) {
        throw error(404, 'Todo not found');
    }

    if (!res.ok) {
        throw error(res.status, 'Failed to load todo');
    }

    const todo = await res.json();
    return { todo };
};
