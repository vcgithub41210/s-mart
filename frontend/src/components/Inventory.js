import React, { useState } from 'react';
import './Inventory.css';
import AddProductModal from './AddProductModal';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sample inventory data
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Electronics', stock: 25, price: 999.99 },
    { id: 2, name: 'Office Chair', category: 'Furniture', stock: 12, price: 249.99 },
    { id: 3, name: 'Wireless Mouse', category: 'Electronics', stock: 45, price: 29.99 },
    { id: 4, name: 'Coffee Maker', category: 'Appliances', stock: 8, price: 89.99 },
    { id: 5, name: 'Desk Lamp', category: 'Furniture', stock: 18, price: 39.99 },
    { id: 6, name: 'Smartphone Samsung Galaxy', category: 'Electronics', stock: 32, price: 699.99 },
    { id: 7, name: 'Microwave Oven', category: 'Appliances', stock: 15, price: 159.99 },
    { id: 8, name: 'Bookshelf', category: 'Furniture', stock: 7, price: 199.99 }
  ]);

  // Get unique categories
  const categories = ['All', ...new Set(inventoryItems.map(item => item.category))];

  // Filter and sort items
  const getFilteredAndSortedItems = () => {
    let filtered = inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle string sorting (case-insensitive)
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: inventoryItems.length > 0 ? Math.max(...inventoryItems.map(item => item.id)) + 1 : 1,
      name: productData.productName,
      category: productData.category,
      stock: parseInt(productData.availableQuantity),
      price: parseFloat(productData.price) || 0,
      lowStockThreshold: parseInt(productData.lowStockThreshold),
      skuCode: productData.skuCode
    };

    setInventoryItems(prev => [...prev, newProduct]);
    setShowModal(false);
    alert(`Product "${productData.productName}" added successfully!`);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventoryItems(prev => prev.filter(item => item.id !== itemId));
      alert('Item deleted successfully!');
    }
  };

  const handleEditItem = (itemId) => {
    // Placeholder for edit functionality
    alert(`Edit functionality for item ${itemId} - Coming soon!`);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="inventory-page">
      <div className="inventory-container">
        <div className="inventory-header">
          <div className="header-title">
            <h1>Inventory Management</h1>
            <p className="item-count">{filteredItems.length} items found</p>
          </div>
          
          <div className="inventory-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="🔍 Search items..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-container">
              <select
                className="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn-primary add-item-btn"
              onClick={() => setShowModal(true)}
            >
              <span className="btn-icon">+</span>
              Add New Item
            </button>
          </div>
        </div>

        <div className="inventory-content">
          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th onClick={() => handleSortChange('id')} className="sortable">
                    ID {getSortIcon('id')}
                  </th>
                  <th onClick={() => handleSortChange('name')} className="sortable">
                    Item Name {getSortIcon('name')}
                  </th>
                  <th onClick={() => handleSortChange('category')} className="sortable">
                    Category {getSortIcon('category')}
                  </th>
                  <th onClick={() => handleSortChange('stock')} className="sortable">
                    Stock {getSortIcon('stock')}
                  </th>
                  <th onClick={() => handleSortChange('price')} className="sortable">
                    Price {getSortIcon('price')}
                  </th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className={item.stock < 10 ? 'low-stock-row' : ''}>
                    <td className="id-cell">{item.id}</td>
                    <td className="name-cell">
                      <div className="item-name-container">
                        <span className="item-name">{item.name}</span>
                        {item.stock < 10 && <span className="low-stock-badge">Low Stock</span>}
                      </div>
                    </td>
                    <td className="category-cell">
                      <span className="category-badge">{item.category}</span>
                    </td>
                    <td className={`stock-cell ${item.stock < 10 ? 'low-stock' : item.stock > 30 ? 'high-stock' : 'normal-stock'}`}>
                      <span className="stock-number">{item.stock}</span>
                    </td>
                    <td className="price-cell">${item.price.toFixed(2)}</td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditItem(item.id)}
                        title="Edit Item"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete Item"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="no-items">
                <div className="no-items-icon">📦</div>
                <h3>No items found</h3>
                <p>No items match your current search and filter criteria.</p>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <AddProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProduct}
        />
      </div>
    </div>
  );
};

export default Inventory;
