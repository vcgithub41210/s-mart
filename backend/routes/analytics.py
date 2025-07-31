from fastapi import APIRouter
from app.db import order_collection
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/analytics/sales-summary")
async def sales_summary():
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=7)
    orders = await order_collection.find({"orderDate": {"$gte": datetime.combine(week_ago, datetime.min.time())}}).to_list(100)
    total_sales = sum([sum([p["unitPrice"] * p["quantity"] for p in o["products"]]) for o in orders])
    return {"weeklySales": total_sales, "orderCount": len(orders)}