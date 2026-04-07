# THE FACTORY - Cap Ordering Website

A full-stack B2B e-commerce platform for custom caps ordering.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + React Router v6
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Auth**: JWT stored in httpOnly cookies
- **Image Upload**: Multer (local storage)

## Project Structure

```
/
├── client/          # React frontend (Vite)
├── server/          # Express backend
├── uploads/         # Product images (auto-created)
├── package.json     # Root package with concurrently
└── README.md
```

## Prerequisites

- Node.js 18+ 
- MongoDB running locally on port 27017

## Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Configure Environment

The server uses `server/.env` with these defaults:

```
MONGO_URI=mongodb://localhost:27017/factory-caps
JWT_SECRET=supersecretkey123
PORT=5000
```

### 3. Seed Initial Data

```bash
# Create admin user (run once)
node server/createAdmin.js

# Seed sample products (run once)
node server/seed.js
```

### 4. Run Development Servers

```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Admin Access

- **URL**: http://localhost:5173/admin/login
- **Email**: admin@factory.com
- **Password**: admin123

## API Endpoints

### Products
- `GET /api/products` - List all active products (supports ?category=, ?size=)
- `GET /api/products/:id` - Single product details
- `POST /api/products` - Create product (admin only, with image upload)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Soft delete (admin only)

### Orders
- `POST /api/orders` - Create new order (public)
- `GET /api/orders` - List all orders (admin only, supports ?status=)
- `GET /api/orders/:id` - Single order details (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin user

## Features

- Browse products by category and size
- Add to cart with localStorage persistence
- Complete checkout with order tracking
- Admin dashboard for product management
- Order status tracking
- Image upload for products (up to 4 images)
