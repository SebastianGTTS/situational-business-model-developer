FROM node:14 AS build
WORKDIR /app
RUN chown -R node:node /app
USER node:node
COPY . .
RUN npm ci
RUN npm run build -- --configuration production

FROM nginx AS server
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/* /usr/share/nginx/html/
