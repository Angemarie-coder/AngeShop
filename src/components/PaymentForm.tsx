'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Phone, DollarSign, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatRWF } from '@/lib/currency';

interface PaymentFormData {
  amount: string;
  phone: string;
}

interface PaymentResponse {
  success: boolean;
  data?: any;
  message?: string;
}

interface TransactionStatus {
  success: boolean;
  data?: any;
  message?: string;
}

export default function PaymentForm() {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: '',
    phone: ''
  });


  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [message, setMessage] = useState('');
  const [transactionRef, setTransactionRef] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.amount || !formData.phone) {
      setMessage('Please fill in all fields');
      return false;
    }

    const amount = parseInt(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid amount');
      return false;
    }

    if (amount < 100) {
      setMessage('Minimum amount is 100 RWF (Rwandan Francs)');
      return false;
    }

    const phoneRegex = /^07[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage('Please enter a valid phone number (e.g., 0781234567)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setPaymentStatus('processing');
    setMessage('Processing payment...');

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(formData.amount),
          phone: formData.phone
        }),
      });

      const data: PaymentResponse = await response.json();

      if (data.success) {
        setPaymentStatus('success');
        setMessage(`Payment request sent successfully for ${formatRWF(formData.amount)}!`);
        if (data.data?.ref) {
          setTransactionRef(data.data.ref);
          // Start checking transaction status
          checkTransactionStatus(data.data.ref);
        }
      } else {
        setPaymentStatus('failed');
        setMessage(`Payment failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setPaymentStatus('failed');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTransactionStatus = async (ref: string) => {
    try {
      const response = await fetch(`/api/transaction/${ref}`);
      const data: TransactionStatus = await response.json();
      setTransactionStatus(data);
      
      if (data.success && data.data?.status === 'SUCCESS') {
        setMessage('Payment completed successfully!');
        setPaymentStatus('success');
      } else if (data.success && data.data?.status === 'PENDING') {
        setMessage('Payment is being processed...');
        // Continue checking status
        setTimeout(() => checkTransactionStatus(ref), 5000);
      } else if (data.success && data.data?.status === 'FAILED') {
        setMessage('Payment failed');
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
    }
  };

  const resetForm = () => {
    setFormData({ amount: '', phone: '' });
    setPaymentStatus('idle');
    setMessage('');
    setTransactionRef(null);
    setTransactionStatus(null);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ANGE FASHION SHOP</h1>
          <p className="text-gray-600">Secure Payment Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (RWF)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm">
                RWF
              </span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                min="100"
                step="100"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                RWF
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum amount: 100 RWF</p>
            {formData.amount && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">
                  {formatRWF(formData.amount)}
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0781234567"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                pattern="07[0-9]{8}"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Pay Now
              </div>
            )}
          </button>
        </form>

        {/* Status Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg border ${getStatusColor()} bg-opacity-10`}>
            <div className="flex items-center justify-center space-x-2">
              {getStatusIcon()}
              <span className={`font-medium ${getStatusColor()}`}>{message}</span>
            </div>
          </div>
        )}

        {/* Transaction Reference */}
        {transactionRef && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Amount:</span> {formatRWF(formData.amount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Transaction Ref:</span> {transactionRef}
            </p>
          </div>
        )}

        {/* Transaction Status */}
        {transactionStatus && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">
              <span className="font-medium">Status:</span> {transactionStatus.data?.status || 'Unknown'}
            </p>
          </div>
        )}

        {/* Reset Button */}
        {paymentStatus !== 'idle' && (
          <button
            onClick={resetForm}
            className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            New Payment
          </button>
        )}

        {/* Payment Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by Paypack</p>
            <p className="mt-1">Secure • Fast • Reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
