FROM python:3.11

WORKDIR /app

# Copy requirements and install one by one for better debugging
COPY backend/requirements.txt ./
RUN pip install --upgrade pip
RUN pip install fastapi
RUN pip install "uvicorn[standard]"
RUN pip install aiohttp
RUN pip install cachetools
RUN pip install python-dotenv

# Copy backend code
COPY backend/ ./

# Run the application
CMD python -m uvicorn main:app --host 0.0.0.0 --port $PORT