FROM python:3.11

WORKDIR /app

# Copy requirements and install dependencies
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Expose port (Railway will set $PORT automatically)
EXPOSE 8000

# Run the application (shell form to interpret $PORT)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}