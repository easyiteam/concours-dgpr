# syntax=docker/dockerfile:1
FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --prefer-offline --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/default.conf /etc/nginx/conf.d
COPY --from=build /app/dist /usr/share/nginx/html
