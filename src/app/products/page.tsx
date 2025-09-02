'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/currency';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  stockQuantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState<string>('');
  const { addToCart } = useCart();

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'crochet', label: 'Crochet' },
    { value: 'knitted', label: 'Knitted' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home-decor', label: 'Home Decor' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProducts({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        sort: sortBy,
      });
      
      if (response.data && typeof response.data === 'object' && 'products' in response.data) {
        setProducts((response.data as { products: Product[] }).products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotificationProduct(product.name);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span>✓</span>
            <span>{notificationProduct} added to cart!</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 {/* Header */}
         <div className="mb-8">
           <h1 className="text-4xl font-bold text-gray-800 mb-3">Our Products</h1>
           <p className="text-gray-700 text-lg">Discover unique handcrafted items made with love</p>
         </div>

                 {/* Filters and Search */}
         <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                             <input
                 type="text"
                 placeholder="Search products..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-black placeholder-gray-500 bg-white"
               />
            </div>

            {/* Category Filter */}
                         <select
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-black bg-white"
             >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Sort */}
                         <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-black bg-white"
             >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

                         {/* Results Count */}
             <div className="flex items-center justify-end text-gray-700 font-medium">
               {products.length} product{products.length !== 1 ? 's' : ''} found
             </div>
          </div>
        </div>

        {/* Products Grid */}
                 {products.length === 0 ? (
           <div className="text-center py-12">
             <div className="text-6xl mb-4">🧶</div>
             <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
             <p className="text-gray-700 text-lg">Try adjusting your search or filter criteria</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-200 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                                 <div className="p-4">
                   <h3 className="font-bold text-xl text-gray-800 mb-3">{product.name}</h3>
                   <p className="text-gray-700 text-base mb-4 line-clamp-2 leading-relaxed">
                     {product.description}
                   </p>
                   
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-3xl font-bold text-purple-600">
                       {formatPrice(product.price)}
                     </span>
                     <span className="text-sm font-medium text-gray-600">
                       {product.stockQuantity} in stock
                     </span>
                   </div>

                                     <button
                     onClick={() => handleAddToCart(product)}
                     disabled={!product.inStock}
                     className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-base"
                   >
                     <ShoppingCart className="h-5 w-5" />
                     {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
