# # # Dockerfile (racine du projet – pour le frontend)
# # FROM node:20-alpine AS build

# # WORKDIR /app

# # COPY package*.json ./
# # RUN npm ci

# # COPY . .
# # RUN npm run build

# # # Serveur de production léger
# # FROM nginx:alpine
# # COPY --from=build /app/dist /usr/share/nginx/html
# # COPY nginx.conf /etc/nginx/nginx.conf
# # EXPOSE 80
# # CMD ["nginx", "-g", "daemon off;"]

# # Étape de build
# FROM node:20-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Étape de production avec Nginx
# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 3000
# CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine

# Copier les fichiers buildés React (si vous les avez)
COPY dist/ /usr/share/nginx/html/

# Copier la configuration Nginx corrigée
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]