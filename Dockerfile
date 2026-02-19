FROM oven/bun:alpine

WORKDIR /app

COPY package.json /app
COPY bun.lock /app
COPY src /app/src
COPY vite.config.ts /app/
COPY .env /app/

RUN bun install

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "build/index.js"]

