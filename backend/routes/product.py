from fastapi import APIRouter, HTTPException
from app.models.product import ProductCreate, ProductResponse
from datetime import datetime, timezone
from app.db import product_collection
from bson import ObjectId

router = APIRouter()

@router.post("/products", response_model=ProductResponse)
async def create_product(product: ProductCreate):
    data = product.dict()
    data["createdAt"] = datetime.now(timezone.utc)
    data["updatedAt"] = datetime.now(timezone.utc)
    result = await product_collection.insert_one(data)
    data["_id"] = result.inserted_id
    return data

@router.get("/products", response_model=list[ProductResponse])
async def list_products():
    products = await product_collection.find().to_list(100)
    return products

@router.put("/products/{product_id}")
async def update_product(product_id: str, product: ProductCreate):
    updated_data = product.dict()
    updated_data["updatedAt"] = datetime.now(timezone.utc)
    result = await product_collection.update_one({"_id": ObjectId(product_id)}, {"$set": updated_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated"}

@router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await product_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}
