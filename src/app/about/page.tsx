import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Ange Shop
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Your trusted destination for quality products and exceptional shopping experiences
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Founded with a passion for quality and customer satisfaction, Ange Shop has been serving customers 
              with the finest products since our establishment. We believe in providing not just products, 
              but complete shopping experiences that exceed expectations.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our journey began with a simple mission: to make quality products accessible to everyone. 
              Today, we continue to uphold this mission while embracing innovation and technology to 
              provide seamless online shopping experiences.
            </p>
            <p className="text-lg text-gray-600">
              We take pride in our carefully curated selection of products, ensuring that every item 
              meets our high standards for quality, design, and value.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality First</h3>
              <p className="text-gray-600">
                Every product in our collection is carefully selected to ensure the highest quality standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the way we serve our customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our top priority. We're committed to providing exceptional service 
                and support at every step of your shopping journey.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600">
                We maintain strict quality standards for all our products, ensuring you receive only 
                the best items that meet your expectations.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously embrace new technologies and trends to provide you with the most 
                modern and efficient shopping experience possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind Ange Shop who work tirelessly to bring you the best shopping experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">A</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ange Marie</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">D</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Development Team</h3>
            <p className="text-gray-600">Technology & Innovation</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">S</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Support Team</h3>
            <p className="text-gray-600">Customer Service</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Discover our amazing collection of products and experience the Ange Shop difference.
          </p>
          <a 
            href="/products" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Browse Products
          </a>
        </div>
      </div>
    </div>
  );
}
