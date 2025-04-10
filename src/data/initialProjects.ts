You can modify the `initialProjects` array in the file `src/data/initialProjects.ts` to ensure all `imageUrl` fields are empty strings. Replace the existing `imageUrl` values with empty strings as follows:

```typescript
export const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    imageUrl: '', // Empty string
    // ... other fields
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    imageUrl: '', // Empty string
    // ... other fields
  },
  {
    id: 'project-3',
    title: 'Weather Dashboard',
    imageUrl: '', // Empty string
    // ... other fields
  },
  {
    id: 'project-4',
    title: 'Personal Finance Tracker',
    imageUrl: '', // Empty string
    // ... other fields
  },
  {
    id: 'project-5',
    title: 'Recipe Sharing Platform',
    imageUrl: '', // Empty string
    // ... other fields
  },
  {
    id: 'project-6',
    title: 'Travel Blog',
    imageUrl: '', // Empty string
    // ... other fields
  },
];
```

Make these updates directly in the `src/data/initialProjects.ts` file.
