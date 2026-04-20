# RemitBuddy n8n Blog Automation
FROM n8nio/n8n:latest

# Set timezone to Korea
ENV TZ=Asia/Seoul
ENV GENERIC_TIMEZONE=Asia/Seoul

# n8n configuration
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV NODE_ENV=production

# Webhook URL will be set by Railway
ENV WEBHOOK_URL=${RAILWAY_PUBLIC_DOMAIN}

# Data persistence
ENV N8N_USER_FOLDER=/home/node/.n8n

# Create data directory
USER root
RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node/.n8n
USER node

WORKDIR /home/node

EXPOSE 5678

CMD ["n8n", "start"]
