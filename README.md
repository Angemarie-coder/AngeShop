# Ange Shop - Frontend

A modern e-commerce frontend built with Next.js, React, TypeScript, and Tailwind CSS. This is the frontend part of the Ange Shop application, connecting to a separate Express.js backend.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **User Authentication**: JWT-based authentication with backend API
- **Product Management**: Browse products with search and filtering
- **Shopping Cart**: Persistent cart with localStorage and real-time updates
- **Order Management**: Complete order processing and tracking
- **Search & Filtering**: Advanced product search and category filtering
- **Responsive Design**: Mobile-first approach with excellent mobile experience
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js API (separate repository)
- **Authentication**: JWT with backend API
- **Icons**: Lucide React, Heroicons
- **UI Components**: Headless UI

## 📋 Prerequisites

- Node.js 18+ 
- Backend API running (see backend repository)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to the project directory
cd ange-shop

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Backend First

Make sure your backend server is running on `http://localhost:5000`

### 4. Run the Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
ange-shop/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── cart/           # Shopping cart page
│   │   ├── products/       # Products listing page
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable React components
│   │   └── Navbar.tsx      # Navigation component
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── CartContext.tsx # Shopping cart state
│   └── lib/                # Utility functions
│       └── api.ts          # API client for backend
├── public/                 # Static assets
├── .env.local             # Environment variables
└── package.json           # Dependencies and scripts
```

## 🔧 Backend API

This frontend connects to a separate Express.js backend API. The backend provides the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status (admin)
- `POST /api/orders` - Create new order

## 👤 User Features

- **Browse Products**: View all products with search and filtering
- **Shopping Cart**: Add/remove items, update quantities
- **User Registration/Login**: Secure authentication
- **Order History**: View past orders and status
- **Checkout**: Complete purchase with shipping and payment info

## 🔐 Admin Features

- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **User Management**: View user accounts
- **Inventory Tracking**: Monitor stock levels

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Components in the respective component files
- Global styles in `src/app/globals.css`

### Adding New Features
1. Create new API routes in `src/app/api/`
2. Add new pages in `src/app/`
3. Create reusable components in `src/components/`
4. Update models in `src/models/` if needed

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your MongoDB connection
3. Ensure all environment variables are set
4. Check that all dependencies are installed

## 🎯 Next Steps

Potential improvements and features to add:
- Payment gateway integration (Stripe, PayPal)
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced admin analytics
- Multi-language support
- Image upload functionality
- Social media integration

---

**Made with ❤️ in Rwanda**
