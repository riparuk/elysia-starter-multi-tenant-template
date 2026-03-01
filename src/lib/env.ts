import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(1),

    BETTER_AUTH_URL: z.string().url(),

    CORS_ORIGIN: z.string().optional().transform(val => val ? val.split(',').map(u => u.trim()) : [])
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.format())
    process.exit(1)
}

export const env = parsed.data