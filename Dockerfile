FROM node:latest as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:latest as serve
RUN rm -r /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html