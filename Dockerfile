FROM imbios/bun-node

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production --no-cache

# Drizzle tidak membutuhkan proses "generate" client seperti Prisma.
# Cukup copy folder src dan drizzle (jika perlu menjalankan file migrasi/konfigurasi dsb)
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.ts ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "src/main.ts"]