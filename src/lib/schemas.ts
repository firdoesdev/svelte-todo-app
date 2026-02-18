import { z } from 'zod';

export const createTodoSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional()
});

export const updateTodoSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    completed: z.boolean().optional()
});

export const editTodoFormSchema = createTodoSchema.extend({
    completed: z.boolean()
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
export type EditTodoFormSchema = z.infer<typeof editTodoFormSchema>;
