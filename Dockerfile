# ── Stage 1: Install dependencies ──────────────────────────────
FROM oven/bun:alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ── Stage 2: Build the app ─────────────────────────────────────
FROM oven/bun:alpine AS build

WORKDIR /app

# Bring in the installed node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy only the files needed for the build
COPY package.json bun.lock svelte.config.js tsconfig.json vite.config.ts ./
COPY src ./src
COPY static ./static

# Pass build-time env vars with ARG if needed (don't bake .env into the image)
# ARG PUBLIC_SOME_VAR
# ENV PUBLIC_SOME_VAR=$PUBLIC_SOME_VAR

RUN bun run build

# Prune dev dependencies — only keep production deps for the runtime image
RUN bun install --frozen-lockfile --production

# ── Stage 3: Production runtime ───────────────────────────────
FROM oven/bun:alpine AS runtime

WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only the built output and production node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Switch to non-root user
USER appuser

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["bun", "run", "build/index.js"]
