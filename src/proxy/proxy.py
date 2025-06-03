# server.py
import contextlib

import requests
from mcp.server.fastmcp import FastMCP
from fastapi import FastAPI
from mcp.server.lowlevel.server import lifespan

# Create an MCP server
app = FastAPI()

mcp = FastMCP(name="Drive", stateless_http=False, lifespan=lifespan)

app.mount("/", mcp.sse_app())

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    async with contextlib.AsyncExitStack() as stack:
        await stack.enter_async_context(mcp.session_manager.run())
        yield

# Add an addition tool
@mcp.tool()
def search_drive(query: str) -> list[dict]:
    """Add two numbers"""
    response = requests.get(f"http://app-dev:8000/api/v1.0/items/search/?title={query}")
    return response.json()


