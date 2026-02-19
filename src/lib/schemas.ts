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

export const bulkCreateTodoSchema = z.object({
    items: z.array(createTodoSchema).min(1, 'At least one todo is required')
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
export type EditTodoFormSchema = z.infer<typeof editTodoFormSchema>;
export type BulkCreateTodoSchema = z.infer<typeof bulkCreateTodoSchema>;
