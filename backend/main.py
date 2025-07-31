# app/main.py

from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, product, order, dashboard, inventory, export

app = FastAPI()

# MongoDB connection
@app.on_event("startup")
async def connect_to_mongo():
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017")
    app.mongodb = app.mongodb_client["inventory_db"]  # Change to your DB name

@app.on_event("shutdown")
async def close_mongo_connection():
    app.mongodb_client.close()

# CORS for frontend access (React runs on port 3000 by default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(product.router)
app.include_router(order.router)
app.include_router(dashboard.router)
app.include_router(inventory.router)
app.include_router(export.router)

# Root route (example)
@app.get("/")
async def read_root():
    user = await app.mongodb["users"].find_one({"name": "John"})
    return user or {"message": "User not found"}
