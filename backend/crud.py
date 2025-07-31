from models import Product
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from schemas import ProductCreate

def create_product(db: Session, data: ProductCreate):
    new_product = Product(
        name=data.name,
        sku=data.sku or "",
        price=data.price,
        quantity_in_stock=data.quantity_in_stock,
        category=data.category or "",
        low_stock_threshold=data.low_stock_threshold or 5,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product
