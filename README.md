# Vendora 🛍️

Vendora is a premium, full-stack boutique e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). Designed with a focus on modern aesthetics, editorial typography, and seamless user experience, Vendora offers a complete end-to-end shopping platform.

![Vendora Banner](https://placehold.co/1200x400/18181b/c4a882?text=Vendora+E-Commerce)

## ✨ Key Features

### 👤 User Experience
*   **Premium UI/UX:** Custom, vanilla CSS design system featuring micro-animations, glassmorphism, and responsive layouts.
*   **Authentication:** Secure JWT-based user login and registration.
*   **Product Discovery:** Full-text search, category filtering, and server-side pagination for fast loading.
*   **Smart Cart & Wishlist:** 
    *   Add items to the cart or save them to your wishlist.
    *   Seamlessly move items between your cart and wishlist.
    *   Smart "Go to Cart" dynamic buttons to prevent duplicate additions.
*   **Checkout & Payments:** Integrated Razorpay payment gateway for secure transactions.
*   **Order History:** Detailed order tracking and history in the user profile.
*   **Reviews & Ratings:** Users can leave detailed reviews and star ratings on purchased products.

### 🛡️ Admin Dashboard
*   **Product Management:** Full CRUD capabilities for the product catalog.
*   **Cloud Storage:** Direct integration with Cloudinary for seamless product image hosting and automatic orphaned image cleanup.
*   **Order Management:** Track and update user order statuses.
*   **Admin Pagination & Search:** Easily navigate large product catalogs via the admin panel.

## 🛠️ Technology Stack

**Frontend:**
*   React (via Vite)
*   React Router DOM (Routing)
*   Context API (State Management for Cart & Auth)
*   Vanilla CSS (Custom Design System)
*   React Hot Toast (Notifications)
*   Axios (API Client)

**Backend:**
*   Node.js & Express.js
*   MongoDB Atlas (Database) & Mongoose (ODM)
*   JSON Web Tokens (JWT Authentication)
*   Bcrypt.js (Password Hashing)
*   Multer & Cloudinary (Image Uploads)
*   Razorpay (Payment Processing)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   MongoDB Atlas Account
*   Cloudinary Account
*   Razorpay Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmeyaSingh23/ecommerce.git
   cd ecommerce
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `/client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```

4. **Run the Application**
   Open two terminals and start the development servers:
   
   **Terminal 1 (Backend):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   cd client
   npm run dev
   ```

## 🌐 Deployment
Vendora is configured for seamless deployment. The backend can be hosted on services like Render or Heroku, while the frontend is optimized for deployment on Vercel or Netlify.

---
*Built with ❤️ by Ameya Singh*
