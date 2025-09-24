# Dockerfile

# 1. Builder Stage: Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency-related files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_WEATHER_KEY
ARG NEXT_PUBLIC_GEMINI_API_KEY_CHATBOT

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_WEATHER_KEY=${NEXT_PUBLIC_WEATHER_KEY}
ENV NEXT_PUBLIC_GEMINI_API_KEY_CHATBOT=${NEXT_PUBLIC_GEMINI_API_KEY_CHATBOT}

# Build the application
RUN npm run build

# 2. Runner Stage: Create the final, lean production image
FROM node:18-alpine AS runner
WORKDIR /app

# Install pnpm in the runner stage
RUN npm install -g pnpm

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Expose the port the app runs on
EXPOSE 3000

# Start the application using npm start, which is defined in your package.json
CMD ["npm", "start"]
