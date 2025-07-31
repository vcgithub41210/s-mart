from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from bson import ObjectId


class ProductBase(BaseModel):
    name: str
    sku: Optional[str] = ""
    price: float
    quantityInStock: int
    category: Optional[str] = ""
    lowStockThreshold: int = 5


class ProductCreate(ProductBase):
    pass


class ProductInDB(ProductBase):
    id: Optional[str] = Field(alias="_id")
    createdAt: datetime
    updatedAt: datetime


class ProductResponse(ProductInDB):
    class Config:
        json_encoders = {
            ObjectId: str
        }
        allow_population_by_field_name = True
