import React from 'react';
import './BillModal.css';

const BillModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTax = (amount) => {
    return amount * 0.18; // 18% GST
  };

  const subtotal = order.totalAmount;
  const tax = calculateTax(subtotal);
  const finalTotal = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text version of the bill
    const billContent = `
S-MART INVOICE
==============

Invoice #: ${order.id}
Date: ${formatDate(order.date)}
Time: ${order.orderTime}

CUSTOMER DETAILS:
Name: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone}

ITEMS:
${order.items.map(item => 
  `${item.name} x${item.quantity} - ${formatCurrency(item.total)}`
).join('\n')}

PAYMENT SUMMARY:
Subtotal: ${formatCurrency(subtotal)}
Tax (18% GST): ${formatCurrency(tax)}
Total Amount: ${formatCurrency(finalTotal)}

Thank you for your business!
Generated on: ${new Date().toLocaleString('en-IN')}
    `;

    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bill-modal-overlay">
      <div className="bill-modal-container">
        <div className="bill-modal-header">
          <h2>Invoice</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="bill-content">
          <div className="bill-header">
            <div className="company-info">
              <h1>S-MART</h1>
              <p>Your Complete Inventory Management Solution</p>
              <p>123 Business Street, Tech City, TC 12345</p>
              <p>Phone: +91 1234567890 | Email: info@smart.com</p>
            </div>
            <div className="invoice-info">
              <h3>INVOICE #{order.id}</h3>
              <p><strong>Date:</strong> {formatDate(order.date)}</p>
              <p><strong>Time:</strong> {order.orderTime}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          </div>

          <div className="customer-section">
            <h3>Bill To:</h3>
            <div className="customer-details">
              <p><strong>{order.customerName}</strong></p>
              <p>{order.customerEmail}</p>
              <p>{order.customerPhone}</p>
            </div>
          </div>

          <div className="items-section">
            <table className="bill-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="payment-section">
            <div className="payment-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (18% GST):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="summary-row total">
                <span><strong>Total Amount:</strong></span>
                <span><strong>{formatCurrency(finalTotal)}</strong></span>
              </div>
            </div>
          </div>

          <div className="bill-footer">
            <p>Thank you for your business!</p>
            <p><small>Generated on: {new Date().toLocaleString('en-IN')}</small></p>
          </div>
        </div>

        <div className="bill-actions">
          <button className="print-btn" onClick={handlePrint}>
            🖨️ Print Bill
          </button>
          <button className="download-btn" onClick={handleDownload}>
            💾 Download
          </button>
          <button className="close-bill-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
