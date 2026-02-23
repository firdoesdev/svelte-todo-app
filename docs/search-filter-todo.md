## Search and Filter Todo

## Components

- `src/routes/todos/+page.svelte`
- `src/routes/todos/+page.server.ts`
- `src/routes/todos/+page.ts`

## Logic

### Search Todo

1. User types in the search bar.
2. The search bar debounces the input.
3. The search bar sends a request to the server to search for todos.
4. The server sends back the search results.
5. The search results are displayed in the todos list.
6. When refresh the page, the search and filter options are preserved.

### Filter Todo

1. User clicks the filter button.
2. The filter button opens a dropdown menu.
3. User selects a filter option.
4. The filter option is sent to the server.
5. The server sends back the filtered todos.
6. The filtered todos are displayed in the todos list.
7. When refresh the page, the search and filter options are preserved.
