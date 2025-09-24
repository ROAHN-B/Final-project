# Dockerfile

# 1. Builder Stage: Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency-related files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set build-time environment variables (these are not included in the final image)
# You can add more build-time variables here if needed
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

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
