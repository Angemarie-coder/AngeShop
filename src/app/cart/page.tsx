'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Minus, Plus, ShoppingBag, Phone, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatTotal } from '@/lib/currency';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }
    setIsCheckingOut(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/products"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Debug: Cart has {items.length} unique items, total quantity: {items.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">{formatPrice(item.product.price)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right ml-4">
                    <p className="font-semibold">{formatTotal(item.product.price * item.quantity)}</p>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700 mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Clear Cart
              </button>
              <Link
                href="/products"
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>{formatTotal(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatTotal(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {user ? (
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Please log in to checkout</p>
                  <Link
                    href="/login"
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-block"
                  >
                    Login to Checkout
                  </Link>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-600">
                <p>• Free shipping on orders over {formatPrice(50000)}</p>
                <p>• 30-day return policy</p>
                <p>• Secure mobile money payment via TIGO/MTN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Modal */}
        {isCheckingOut && (
          <CheckoutModal
            items={items}
            totalPrice={totalPrice}
            onClose={() => setIsCheckingOut(false)}
          />
        )}
      </div>
    </div>
  );
}

// Checkout Modal Component
function CheckoutModal({ items, totalPrice, onClose }: {
  items: any[];
  totalPrice: number;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus('processing');
    setPaymentMessage('Processing payment...');

    try {
      // First, create the order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Now process the payment through Paypack
      const paymentResponse = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          phone: formData.phone
        }),
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
        setPaymentStatus('success');
        setPaymentMessage('Payment request sent successfully! Check your phone for USSD prompt.');
        if (paymentData.data?.ref) {
          setTransactionRef(paymentData.data.ref);
          // Start checking transaction status
          checkTransactionStatus(paymentData.data.ref);
        }
      } else {
        setPaymentStatus('failed');
        setPaymentMessage(`Payment failed: ${paymentData.message || 'Unknown error'}`);
      }
    } catch (error) {
      setPaymentStatus('failed');
      setPaymentMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (ref: string) => {
    try {
      const response = await fetch(`/api/transaction/${ref}`);
      const data = await response.json();
      
      if (data.success && data.data?.status === 'SUCCESS') {
        setPaymentMessage('Payment completed successfully! Your order is being processed.');
        setPaymentStatus('success');
        // Close modal after successful payment
        setTimeout(() => {
          onClose();
        }, 3000);
      } else if (data.success && data.data?.status === 'PENDING') {
        setPaymentMessage('Payment is being processed... Check your phone.');
        // Continue checking status
        setTimeout(() => checkTransactionStatus(ref), 5000);
      } else if (data.success && data.data?.status === 'FAILED') {
        setPaymentMessage('Payment failed. Please try again.');
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Mobile Money Payment */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Mobile Money Payment
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                💡 <strong>How it works:</strong> Enter your TIGO or MTN phone number. You'll receive a USSD prompt on your phone to complete the payment.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (TIGO/MTN)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="0781234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    pattern="07[0-9]{8}"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter your TIGO or MTN phone number</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{formatTotal(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatTotal(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentMessage && (
            <div className={`p-4 rounded-lg border ${
              paymentStatus === 'success' ? 'border-green-200 bg-green-50 text-green-800' :
              paymentStatus === 'failed' ? 'border-red-200 bg-red-50 text-red-800' :
              'border-blue-200 bg-blue-50 text-blue-800'
            }`}>
              <div className="flex items-center space-x-2">
                {paymentStatus === 'success' && <span>✅</span>}
                {paymentStatus === 'failed' && <span>❌</span>}
                {paymentStatus === 'processing' && <span>⏳</span>}
                <span className="font-medium">{paymentMessage}</span>
              </div>
            </div>
          )}

          {/* Transaction Reference */}
          {transactionRef && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Transaction Ref:</span> {transactionRef}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay with Mobile Money'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
