import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { todo } from '$lib/server/db/schema';
import { updateTodoSchema } from '$lib/schemas';
import { eq, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
    const session = locals.session;
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const todoItem = await db.query.todo.findFirst({
        where: and(eq(todo.id, id), eq(todo.userId, session.userId))
    });

    if (!todoItem) {
        return json({ error: 'Todo not found' }, { status: 404 });
    }

    return json(todoItem);
};

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
    const session = locals.session;
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const data = await request.json();

    try {
        const validatedData = updateTodoSchema.parse(data);

        const updatedTodo = await db.update(todo)
            .set({
                ...validatedData,
                updatedAt: new Date()
            })
            .where(and(eq(todo.id, id), eq(todo.userId, session.userId)))
            .returning();

        if (updatedTodo.length === 0) {
            return json({ error: 'Todo not found' }, { status: 404 });
        }

        return json(updatedTodo[0]);
    } catch (e) {
        if (e instanceof Error) {
            return json({ error: e.message }, { status: 400 });
        }
        return json({ error: 'Invalid data' }, { status: 400 });
    }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
    const session = locals.session;
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const deletedTodo = await db.delete(todo)
        .where(and(eq(todo.id, id), eq(todo.userId, session.userId)))
        .returning();

    if (deletedTodo.length === 0) {
        return json({ error: 'Todo not found' }, { status: 404 });
    }

    return json({ success: true });
};
