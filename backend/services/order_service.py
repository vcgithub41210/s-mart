from datetime import datetime, timezone
import time

class OrderService:
    def __init__(self, db):
        self.orders = db.orders
        self.products = db.products

    async def create_order(self, data):
        order = {
            "orderId": f"ORD-{int(time.time())}",
            "orderDate": datetime.now(timezone.utc),
            "products": data["products"],
            "customerName": data.get("customerName", ""),
            "customerContact": data.get("customerContact", ""),
            "status": data.get("status", "pending")
        }

        for item in order["products"]:
            product = await self.products.find_one({"_id": item["productId"]})
            if not product or product["quantityInStock"] < item["quantity"]:
                raise Exception("Product out of stock or not found")
            await self.products.update_one(
                {"_id": item["productId"]},
                {"$inc": {"quantityInStock": -item["quantity"]}}
            )

        return await self.orders.insert_one(order)

    async def get_all_orders(self):
        return await self.orders.find().to_list(length=None)

    async def update_order_status(self, order_id, status):
        return await self.orders.update_one(
            {"orderId": order_id},
            {"$set": {"status": status}}
        )

    async def get_order_by_id(self, order_id):
        return await self.orders.find_one({"orderId": order_id})