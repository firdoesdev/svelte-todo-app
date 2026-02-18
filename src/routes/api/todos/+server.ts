import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { todo } from '$lib/server/db/schema';
import { createTodoSchema } from '$lib/schemas';
import { eq, desc, asc, like, and, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const session = locals.session;
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || 'all'; // all, active, completed
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const filters = [eq(todo.userId, session.userId)];

    if (search) {
        filters.push(like(todo.title, `%${search}%`));
    }

    if (status === 'active') {
        filters.push(eq(todo.completed, false));
    } else if (status === 'completed') {
        filters.push(eq(todo.completed, true));
    }

    const orderBy = order === 'asc' ? asc(todo[sort as keyof typeof todo.$inferSelect]) : desc(todo[sort as keyof typeof todo.$inferSelect]);

    const todos = await db.query.todo.findMany({
        where: and(...filters),
        orderBy: [orderBy],
        limit,
        offset
    });

    // Get total count for pagination
    // This is a bit inefficient but works for now. 
    // Ideally use count() with filters but drizzle's count API is a bit basic or requires raw sql
    // For specific filters, better to run a separate count query or use sql`count(*)`
    const totalResult = await db.select({ count: sql<number>`count(*)` })
        .from(todo)
        .where(and(...filters));

    const total = Number(totalResult[0].count);

    return json({
        data: todos,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
};

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = locals.session;
    if (!session) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    try {
        const validatedData = createTodoSchema.parse(data);

        const newTodo = await db.insert(todo).values({
            id: crypto.randomUUID(),
            title: validatedData.title,
            description: validatedData.description,
            userId: session.userId,
            completed: false
        }).returning();

        return json(newTodo[0]);
    } catch (e) {
        if (e instanceof Error) {
            return json({ error: e.message }, { status: 400 });
        }
        return json({ error: 'Invalid data' }, { status: 400 });
    }
};
