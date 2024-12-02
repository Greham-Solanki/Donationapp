# Build stage
FROM node:16 AS builder
WORKDIR /app
# Copy only package files first for better caching
COPY package*.json ./
RUN npm install
# Copy the rest of the application
COPY . .
# Build the frontend
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy built files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html
# Optional: If you have a custom nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
