# Refactor Todo App

## 1. Move Custom Components to Route

- Move `src/lib/components/todo` to `src/routes/todos/_components`
- Update imports in `src/routes/todos/+page.svelte`

## 2. Refactor Todo List

use these example folder structure as reference for refactoring

```
src/
└─ routes/
   └─ todos/
      ├─ [id]/
      │  ├─ +page.svelte
      │  └─ +page.ts
      │
      ├─ create/
      │  ├─ _components/
      │  │  └─ create-todo-form/
      │  │     ├─ index.svelte    # create form component
      │  │     └─ schema.ts       # create form schema
      │  └─ +page.svelte
      │
      ├─ edit/
      │  └─ [id]/
      │     ├─ _components/
      │     │  └─ edit-todo-form/
      │     │     ├─ index.svelte # edit form component
      │     │     └─ schema.ts    # edit form schema
      │     ├─ +page.svelte
      │     └─ +page.ts
      │
      ├─ infinite/
      │  └─ +page.svelte
      │
      ├─ _components/
      │  ├─ bulk-create-todo-form.svelte
      │  └─ todo-list.svelte
      │
      ├─ +layout.server.ts
      ├─ +layout.svelte
      ├─ +page.server.ts
      └─ +page.svelte
```
