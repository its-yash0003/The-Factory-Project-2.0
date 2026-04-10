# THE FACTORY - Cap Ordering Website

A full-stack B2B e-commerce platform for custom caps ordering.

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + React Router v6
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Auth**: JWT stored in httpOnly cookies
- **Image Upload**: Multer (local storage)

## Project Structure

```
/
├── client/          # React frontend (Vite)
├── server/          # Express backend
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   ├── uploads/     # Product images (auto-created)
│   ├── index.js     # Entry point
│   ├── seed.js      # Product seeder
│   └── createAdmin.js
├── package.json     # Root package with concurrently
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Configure Environment

Create `server/.env`:

```bash
# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/factory-db?retryWrites=true&w=majority

# JWT secret - use a strong random string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server port (optional, defaults to 5000)
PORT=5000

# Node environment
NODE_ENV=development
```

For local MongoDB:
```bash
MONGO_URI=mongodb://localhost:27017/factory-caps
JWT_SECRET=supersecretkey123
```

### 3. Seed Initial Data

```bash
# Create admin user (run once)
npm run create-admin

# Seed sample products (run once)
npm run seed
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
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | Public | List all active products (supports ?category=, ?size=) |
| GET | /api/products/:id | Public | Single product details |
| POST | /api/products | Admin | Create product (with image upload) |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Soft delete (sets isActive: false) |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/orders | Public | Create new order |
| GET | /api/orders | Admin | List all orders (supports ?status=) |
| GET | /api/orders/:id | Admin | Single order details |
| PUT | /api/orders/:id/status | Admin | Update order status |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | Public | Admin login |
| POST | /api/auth/logout | Admin | Admin logout |
| GET | /api/auth/me | Admin | Get current admin user |

## Features

### Customer Side
- Browse products with category and size filters
- Product detail page with image gallery
- Shopping cart with localStorage persistence
- Complete checkout with form validation
- Order confirmation with order ID
- Toast notifications for all actions
- Loading skeletons while fetching data
- Mobile responsive design

### Admin Side
- Protected admin dashboard
- Product management (CRUD operations)
- Image upload (up to 4 images per product)
- Order management with status updates
- Status badges for order tracking
- Admin logout functionality

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com`
4. Deploy

### Backend (Render)

1. Create new Web Service
2. Connect GitHub repository
3. Set root directory to `server`
4. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
5. Deploy

### Important Notes

- CORS is configured for `http://localhost:5173` and `https://the-factory-project-2-0.vercel.app`
- Cookie `secure` flag is enabled in production
- Images are stored locally in `/uploads` folder
- For production image storage, consider using Cloudinary or AWS S3

## Order Status Flow

```
pending → confirmed → processing → shipped → delivered
                              ↓
                         cancelled
```

## Development Scripts

```bash
npm run dev          # Run both servers concurrently
npm run client       # Run frontend only
npm run server       # Run backend only
npm run install-all  # Install all dependencies
npm run seed         # Seed sample products
npm run create-admin # Create admin user
```
