import React, { useState } from 'react';
import './Inventory.css';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample inventory data - you can replace this with API calls later
  const inventoryItems = [
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Electronics', stock: 25, price: 999.99 },
    { id: 2, name: 'Office Chair', category: 'Furniture', stock: 12, price: 249.99 },
    { id: 3, name: 'Wireless Mouse', category: 'Electronics', stock: 45, price: 29.99 },
    { id: 4, name: 'Coffee Maker', category: 'Appliances', stock: 8, price: 89.99 },
    { id: 5, name: 'Desk Lamp', category: 'Furniture', stock: 18, price: 39.99 }
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <div className="inventory-controls">
          <input
            type="text"
            placeholder="Search items..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-primary">Add New Item</button>
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td className={item.stock < 10 ? 'low-stock' : ''}>{item.stock}</td>
                <td>${item.price}</td>
                <td>
                  <button className="action-btn-small edit">Edit</button>
                  <button className="action-btn-small delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
