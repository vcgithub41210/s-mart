from fastapi import APIRouter, HTTPException
from app.models.order import OrderCreate, OrderResponse
from app.db import order_collection, product_collection
from datetime import datetime, timezone
import time

router = APIRouter()

@router.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    order_dict = order.dict()
    order_dict["orderId"] = f"ORD-{int(time.time())}"
    order_dict["orderDate"] = datetime.now(timezone.utc)
    for item in order_dict["products"]:
        product = await product_collection.find_one({"_id": ObjectId(item["productId"])})
        if not product or product["quantityInStock"] < item["quantity"]:
            raise HTTPException(status_code=400, detail="Invalid product or insufficient stock")
        await product_collection.update_one(
            {"_id": ObjectId(item["productId"])},
            {"$inc": {"quantityInStock": -item["quantity"]}}
        )
    result = await order_collection.insert_one(order_dict)
    order_dict["_id"] = result.inserted_id
    return order_dict

@router.get("/orders", response_model=list[OrderResponse])
async def list_orders():
    return await order_collection.find().to_list(100)

@router.post("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    result = await order_collection.update_one({"orderId": order_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated"}