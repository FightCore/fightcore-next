# Stage 1: Build the Next.js application
FROM node:18 AS builder

ARG IS_BETA
ARG DO_TRACKING
ARG USE_SENTRY

ENV DO_TRACKING=$DO_TRACKING
ENV IS_BETA=$IS_BETA
ENV USE_SENTRY=$USE_SENTRY

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve the static content with Nginx
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
