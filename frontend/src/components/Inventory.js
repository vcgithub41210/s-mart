import React, { useState, useEffect } from 'react';
import './Inventory.css';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import productService from '../services/productService';

const Inventory = ({ userRole, isConnected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace static data with dynamic state
  const [inventoryItems, setInventoryItems] = useState([]);

  // Load products when component mounts or connection status changes
  useEffect(() => {
    if (isConnected) {
      loadProducts();
    } else {
      setLoading(false);
      setError('Backend connection required');
    }
  }, [isConnected]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      
      // Add debugging to see what we're getting
      console.log('API Response:', data);
      console.log('Type of data:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      // Handle different response structures
      let products = [];
      
      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.products)) {
        products = data.products;
      } else if (data && Array.isArray(data.data)) {
        products = data.data;
      } else if (data === null || data === undefined || (Array.isArray(data) && data.length === 0)) {
        // Handle empty database or null response
        products = [];
        console.log('No products found - using empty array');
      } else {
        console.error('Unexpected data structure:', data);
        setError('Invalid data format received from server');
        return;
      }
      
      // Transform backend data to match frontend structure
      // USING CORRECT FIELD NAMES FROM YOUR SCHEMA
      const transformedData = products.map(product => ({
        id: product._id || product.productId,
        name: product.productName || 'Unknown Product',
        category: product.category || 'General',
        stock: product.stockAvailable || 0,
        price: product.pricePerQty || 0,
        lowStockThreshold: product.lowStockThreshold || 10,
        skuCode: product.skuCode || product._id || product.productId,
        productId: product.productId || product._id
      }));
      
      console.log('Transformed Data:', transformedData);
      setInventoryItems(transformedData);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products: ' + err.message);
      
      // Fallback to empty array on error
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from loaded data
  const categories = ['All', ...new Set(inventoryItems.map(item => item.category))];

  // Filter and sort items (keep existing logic)
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

  // Modified to use backend API with correct field names
  const handleAddProduct = async (productData) => {
    try {
      // Transform frontend data to match your MongoDB schema
      const newProductData = {
        productId: productData.skuCode || `PROD-${Date.now()}`,
        productName: productData.productName,
        category: productData.category,
        stockAvailable: parseInt(productData.availableQuantity),
        pricePerQty: parseFloat(productData.price) || 0,
        skuCode: productData.skuCode
      };

      await productService.createProduct(newProductData);
      await loadProducts(); // Refresh the list
      setShowModal(false);
      alert(`Product "${productData.productName}" added successfully!`);
    } catch (err) {
      alert('Failed to add product: ' + err.message);
      console.error('Error adding product:', err);
    }
  };

  // SIMPLIFIED: Handle stock update only
  // FIXED: Handle stock update with proper error handling
const handleEditStock = async (newStockQuantity) => {
  try {
    console.log('Updating stock for product:', selectedProduct.id, 'New stock:', newStockQuantity);
    
    // Use the updateStock API with direct stock value
    const response = await productService.updateStock(selectedProduct.id, { 
      stockAvailable: newStockQuantity 
    });
    
    console.log('Stock update response:', response);
    
    await loadProducts(); // Refresh the list
    setShowEditModal(false);
    setSelectedProduct(null);
    alert(`Stock updated successfully! New stock: ${newStockQuantity}`);
  } catch (err) {
    console.error('Stock update error:', err);
    alert('Failed to update stock: ' + (err.response?.data?.message || err.message));
  }
};


  // Modified to use backend API
  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await productService.deleteProduct(itemId);
        await loadProducts(); // Refresh the list
        alert('Item deleted successfully!');
      } catch (err) {
        alert('Failed to delete item: ' + err.message);
        console.error('Error deleting product:', err);
      }
    }
  };

  // Handle edit button click - now only for stock editing
  const handleEditItem = (item) => {
    setSelectedProduct(item);
    setShowEditModal(true);
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

  // Show connection error if backend is down
  if (!isConnected) {
    return (
      <div className="inventory-page">
        <div className="inventory-container">
          <div className="inventory-header">
            <h1>Inventory Management</h1>
          </div>
          <div className="error-message">
            <div className="no-items">
              <div className="no-items-icon">❌</div>
              <h3>Cannot load inventory</h3>
              <p>Backend connection required. Please ensure your server is running on port 5000.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="inventory-page">
        <div className="inventory-container">
          <div className="inventory-header">
            <h1>Inventory Management</h1>
          </div>
          <div className="loading-message">
            <div className="no-items">
              <div className="no-items-icon">⏳</div>
              <h3>Loading inventory...</h3>
              <p>Please wait while we fetch your products.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="inventory-page">
        <div className="inventory-container">
          <div className="inventory-header">
            <h1>Inventory Management</h1>
          </div>
          <div className="error-message">
            <div className="no-items">
              <div className="no-items-icon">⚠️</div>
              <h3>Error loading inventory</h3>
              <p>{error}</p>
              <button className="btn-primary" onClick={loadProducts}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <th onClick={() => handleSortChange('productId')} className="sortable">
                    Product ID {getSortIcon('productId')}
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
                  <tr key={item.id} className={item.stock < (item.lowStockThreshold || 10) ? 'low-stock-row' : ''}>
                    <td className="id-cell">{item.productId || String(item.id).slice(-6)}</td>
                    <td className="name-cell">
                      <div className="item-name-container">
                        <span className="item-name">{item.name}</span>
                        {item.stock < (item.lowStockThreshold || 10) && <span className="low-stock-badge">Low Stock</span>}
                      </div>
                    </td>
                    <td className="category-cell">
                      <span className="category-badge">{item.category}</span>
                    </td>
                    <td className={`stock-cell ${item.stock < (item.lowStockThreshold || 10) ? 'low-stock' : item.stock > 30 ? 'high-stock' : 'normal-stock'}`}>
                      <span className="stock-number">{item.stock}</span>
                    </td>
                    <td className="price-cell">₹{item.price.toFixed(2)}</td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditItem(item)}
                        title="Update Stock"
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

            {filteredItems.length === 0 && !loading && !error && (
              <div className="no-items">
                <div className="no-items-icon">📦</div>
                <h3>No items found</h3>
                <p>
                  {inventoryItems.length === 0 
                    ? "Your inventory is empty. Add your first product!" 
                    : "No items match your current search and filter criteria."
                  }
                </p>
                {inventoryItems.length > 0 ? (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    Add First Product
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <AddProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProduct}
        />

        <EditProductModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleEditStock}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default Inventory;
