FROM node:18 as build

WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/default.conf /etc/nginx/conf.d
COPY --from=build /app/dist /usr/share/nginx/html
