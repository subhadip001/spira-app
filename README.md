## Spira App

### APP Flow (v0)

![image](https://github.com/user-attachments/assets/13974a81-1bde-4242-9fdf-a61fc05e1438)

### TO DO FEATURES (LESS PRIORITY)

- [ ] Add a dark mode
- [ ] Input type and content Generation on the basis of field's title in edit mode

### SUPABASE DB TYPE GENERATION COMMAND

```bash
pnpm i supabase@">=1.8.1" --save-dev
```

```bash
pnpm supabase login
```

```bash
pnpm supabase init
```

Select 'N' for both questions.

```bash
pnpx supabase gen types --lang=typescript --project-id "$SUPABASE_PROJECT_ID" --schema public > ./utils/supabase/database.types.ts
```
