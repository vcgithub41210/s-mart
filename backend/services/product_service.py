from datetime import datetime, timezone
import time

class ProductService:
    def __init__(self, db):
        self.collection = db.products

    async def create_product(self, data):
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        return await self.collection.insert_one(data)

    async def get_all_products(self):
        return await self.collection.find().to_list(length=None)

    async def get_product_by_id(self, product_id):
        return await self.collection.find_one({"_id": product_id})

    async def update_product(self, product_id, data):
        data["updatedAt"] = datetime.now(timezone.utc)
        return await self.collection.update_one(
            {"_id": product_id}, {"$set": data}
        )

    async def delete_product(self, product_id):
        return await self.collection.delete_one({"_id": product_id})

    async def get_low_stock_products(self):
        return await self.collection.find({
            "$expr": {"$lt": ["$quantityInStock", "$lowStockThreshold"]}
        }).to_list(length=None)
