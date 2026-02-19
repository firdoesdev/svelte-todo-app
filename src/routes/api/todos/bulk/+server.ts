import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { todo } from '$lib/server/db/schema';
import { bulkCreateTodoSchema } from '$lib/schemas';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = locals.session;
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    try {
        const validatedData = bulkCreateTodoSchema.parse(data);

        const todosToInsert = validatedData.items.map((item) => ({
            id: crypto.randomUUID(),
            title: item.title,
            description: item.description,
            userId: session.userId,
            completed: false
        }));

        const newTodos = await db.insert(todo).values(todosToInsert).returning();

        return json(newTodos);
    } catch (e) {
        if (e instanceof Error) {
            return json({ error: e.message }, { status: 400 });
        }
        return json({ error: 'Invalid data' }, { status: 400 });
    }
};
