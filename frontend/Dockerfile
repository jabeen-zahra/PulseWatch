# ==========================================
# Stage 1: Build Frontend Assets
# ==========================================
FROM node:24.1.0-alpine3.20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build

# ==========================================
# Stage 2: Minimal Nginx Runtime (Non-root)
# ==========================================
FROM nginx:1.27.2-alpine AS runtime

LABEL maintainer="PulseWatch Team <kaneezezahra313@gmail.com>" \
      version="1.0.0" \
      description="PulseWatch Studio Frontend Nginx Container"

# Configure Nginx unprivileged user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Replace default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 80

# Drop root privileges and switch to nginx user
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

