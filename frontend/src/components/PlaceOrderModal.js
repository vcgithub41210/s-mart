import React, { useState, useEffect } from 'react';
import './PlaceOrderModal.css';
import productService from '../services/productService';

const PlaceOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load products when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProducts();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedItems([]);
    setCustomerInfo({ name: '', email: '', phone: '' });
    setError(null);
    setSelectedCategory('All');
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      
      // Handle different response structures and filter in-stock items
      let products = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.data)) {
        products = data.data;
      }

      // Transform and filter products with stock > 0
      const availableProducts = products
        .filter(product => (product.stockAvailable || 0) > 0)
        .map(product => ({
          id: product._id,
          productId: product.productId,
          name: product.productName,
          price: product.pricePerQty,
          availableStock: product.stockAvailable,
          category: product.category,
          skuCode: product.skuCode
        }));

      setProducts(availableProducts);
    } catch (err) {
      setError('Failed to load products: ' + err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from products
  const categories = ['All', ...new Set(products.map(product => product.category))];

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItemToOrder = (product) => {
    const existingItem = selectedItems.find(item => item.productId === product.productId);
    
    if (existingItem) {
      if (existingItem.quantity < product.availableStock) {
        setSelectedItems(prev => prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert(`Cannot add more. Only ${product.availableStock} items available.`);
      }
    } else {
      setSelectedItems(prev => [...prev, {
        productId: product.productId,
        productName: product.name,
        pricePerUnit: product.price,
        quantity: 1,
        availableStock: product.availableStock
      }]);
    }
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(productId);
      return;
    }

    const product = products.find(p => p.productId === productId);
    if (newQuantity > product.availableStock) {
      alert(`Cannot exceed available stock of ${product.availableStock}`);
      return;
    }

    setSelectedItems(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeItemFromOrder = (productId) => {
    setSelectedItems(prev => prev.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.pricePerUnit * item.quantity), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!customerInfo.name.trim()) {
      alert('Customer name is required');
      return;
    }
    
    if (!customerInfo.email.trim()) {
      alert('Customer email is required');
      return;
    }
    
    if (!customerInfo.phone.trim()) {
      alert('Customer phone is required');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please select at least one product');
      return;
    }

    const orderData = {
      items: selectedItems,
      customerInfo: customerInfo
    };

    onSubmit(orderData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="place-order-modal-overlay">
      <div className="place-order-modal-content">
        {/* Modal Header with Order Summary */}
        <div className="place-order-modal-header">
          <div className="header-left">
            <h2>🛒 Place New Order</h2>
          </div>
          <div className="header-right">
            {selectedItems.length > 0 && (
              <div className="header-totals">
                <span className="header-items">Items: {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                <span className="header-amount">Total: ₹{calculateTotal().toFixed(2)}</span>
              </div>
            )}
          </div>
          <button className="place-order-close-btn" onClick={handleClose}>×</button>
        </div>

        {/* Modal Body */}
        <div className="place-order-modal-body">
          {/* Left Side - Product Selection */}
          <div className="products-selection-section">
            <div className="products-header">
              <h3>Select Products</h3>
              
              {/* Category Filter */}
              <div className="category-filter-section">
                <label htmlFor="category-select">Filter by Category:</label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>⚠️ {error}</p>
                <button className="retry-btn" onClick={loadProducts}>Retry</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <p>📦 {selectedCategory === 'All' ? 'No products available in stock' : `No products available in ${selectedCategory} category`}</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-info">
                      <h4 className="product-name">{product.name}</h4>
                      <p className="product-category">{product.category}</p>
                      <div className="product-details">
                        <span className="product-price">₹{product.price}</span>
                        <span className="product-stock">Stock: {product.availableStock}</span>
                      </div>
                      <p className="product-sku">SKU: {product.skuCode}</p>
                    </div>
                    <button 
                      className="add-to-order-btn"
                      onClick={() => addItemToOrder(product)}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-summary-section">
            <h3>Order Summary</h3>
            
            {/* Customer Information - Fixed at top */}
            <div className="customer-info-section">
              <h4>Customer Information</h4>
              <div className="customer-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Customer Name *"
                  value={customerInfo.name}
                  onChange={handleCustomerChange}
                  className="customer-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Customer Email *"
                  value={customerInfo.email}
                  onChange={handleCustomerChange}
                  className="customer-input"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Customer Phone *"
                  value={customerInfo.phone}
                  onChange={handleCustomerChange}
                  className="customer-input"
                  required
                />
              </div>
            </div>

            {/* Selected Items - Scrollable Section */}
            <div className="selected-items-section">
              <h4>Selected Items ({selectedItems.length})</h4>
              
              {selectedItems.length === 0 ? (
                <div className="no-items-selected">
                  <p>🛍️ No items selected</p>
                  <p>Select products from the left to add them to your order</p>
                </div>
              ) : (
                <div className="selected-items-scrollable">
                  <div className="selected-items-list">
                    {selectedItems.map(item => (
                      <div key={item.productId} className="selected-item">
                        <div className="item-info">
                          <h5 className="item-name">{item.productName}</h5>
                          <p className="item-price">₹{item.pricePerUnit} each</p>
                        </div>
                        
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn decrease"
                            onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                          >
                            -
                          </button>
                          
                          <span className="quantity-display">{item.quantity}</span>
                          
                          <button
                            className="quantity-btn increase"
                            onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </button>
                          
                          <button
                            className="remove-item-btn"
                            onClick={() => removeItemFromOrder(item.productId)}
                            title="Remove item"
                          >
                            🗑️
                          </button>
                        </div>
                        
                        <div className="item-total">
                          ₹{(item.pricePerUnit * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="place-order-modal-footer">
          <button className="cancel-order-btn" onClick={handleClose}>
            Cancel
          </button>
          
          <button
            className={`place-order-btn ${
              selectedItems.length === 0 || !customerInfo.name || !customerInfo.email || !customerInfo.phone 
                ? 'disabled' 
                : ''
            }`}
            onClick={handleSubmit}
            disabled={selectedItems.length === 0 || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
          >
            Place Order (₹{calculateTotal().toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderModal;
