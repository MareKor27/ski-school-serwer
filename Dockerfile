# Stage 1: Build the NestJS app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only the package files first for dependency install
COPY package*.json ./
RUN npm install

# Copy the rest of the source files
COPY . .

# Build the NestJS project
RUN npm run build

# Stage 2: Run the app with a clean image
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Command to run the app
CMD ["node", "dist/main"]
