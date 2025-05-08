FROM node:22-alpine AS base
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./
RUN npm ci --omit=dev
CMD ["node", "run", "start"]
