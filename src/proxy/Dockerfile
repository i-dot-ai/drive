FROM python:3.12-slim

WORKDIR /app

RUN pip install poetry

# Copy only requirements to cache them in docker layer
COPY ./src/proxy/pyproject.toml .
COPY ./src/proxy/poetry.lock .

# Install dependencies only
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-root

# Copy application code
COPY ./src/proxy/proxy.py .
COPY ./src/proxy/README.md .

# Install the package itself
RUN poetry install --no-interaction

EXPOSE 8080

CMD ["poetry", "run", "uvicorn", "proxy:app", "--host", "0.0.0.0", "--port", "8001"]