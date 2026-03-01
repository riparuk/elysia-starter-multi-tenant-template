## Structure File Projects
- 

## How to run project
- Run development server using the bun dev command:

```bash
bun run dev
```
- Build project using the bun run build command to check if there are any errors:

```bash
bun run build
```

- Run production server using the bun run start command:

```bash
bun run start
```

## Development Database with drizzle
If you make any changes in schema, you need to generate migrations and apply them.
- Make sure schema already defined in drizzle/schemas.ts if new schema created in modules folder.

- Generate migrations using the drizzle-kit generate command and then apply them using the drizzle-kit migrate command:

Generate migrations:
```bash
bunx drizzle-kit generate
```

Check database schema:
```bash
bunx drizzle-kit check
```

Apply migrations:
```bash
bunx drizzle-kit migrate
```

If something the changes not applied to database, you need to reset database.

- Don't ever reset or drop database.
- Don't use `drizzle-kit up`, `drizzle-kit push`, `drizzle-kit drop` command.