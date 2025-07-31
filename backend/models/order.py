from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class OrderProduct(BaseModel):
    productId: str
    quantity: int
    unitPrice: float


class OrderBase(BaseModel):
    products: List[OrderProduct]
    customerName: Optional[str] = ""
    customerContact: Optional[str] = ""
    status: Optional[str] = "pending"


class OrderCreate(OrderBase):
    pass


class OrderInDB(OrderBase):
    id: Optional[str] = Field(alias="_id")
    orderId: str
    orderDate: datetime


class OrderResponse(OrderInDB):
    class Config:
        json_encoders = {
            ObjectId: str
        }
        allow_population_by_field_name = True
