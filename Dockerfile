# Build stage
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install global and local dependencies with proper permissions
RUN npm install -g react-scripts
RUN npm install

# Copy all project files
COPY . .

# Ensure correct file permissions
RUN chmod +x ./node_modules/.bin/react-scripts

# Build the project
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy build files from previous stage
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
