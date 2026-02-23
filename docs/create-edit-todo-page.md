# Create/Edit Todo Page

## Description

This page is used to create a new todo or edit an existing todo.

## Components

- `src/routes/todos/create/+page.svelte`
- `src/routes/todos/edit/[id]/+page.svelte`
- `src/routes/todos/create/+page.server.ts`
- `src/routes/todos/edit/[id]/+page.server.ts`
- `src/routes/todos/create/+page.ts`
- `src/routes/todos/edit/[id]/+page.ts`

## Logic

### Create Todo

1. User clicks the "Create Todo" button on the todos page.
2. User is redirected to the create todo page.
3. User fills in the todo form.
4. User clicks the "Create Todo" button.
5. The todo is created and the user is redirected to the todos page.

### Edit Todo

1. User clicks the "Edit" button on a todo on the todos page.
2. User is redirected to the edit todo page.
3. User fills in the todo form.
4. User clicks the "Update Todo" button.
5. The todo is updated and the user is redirected to the todos page.
