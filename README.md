Full Stack E-commerce Platform

A scalable, production-ready full stack e-commerce platform built with React, Node.js, Express, and MongoDB. Features a clean service-layer backend, real-time Razorpay payments, Redis caching, and a planned AI recommendation microservice.

---

## 🚀 Features

### ✅ Backend
- JWT authentication (access + refresh tokens)
- Role-based access control (User / Admin)
- Product management with Cloudinary image uploads
- Cart system with embedded MongoDB documents
- Order management with status tracking
- **Razorpay payment integration**
- Review and rating system
- Coupon and discount system
- Category management
- Request validation with Zod
- Centralized error handling
- Rate limiting and security headers
- Winston logging + Morgan request logs
- ⚡ Redis caching for performance optimization
- Service-layer architecture

### ✅ Frontend
- Product listing with search and category filters
- Cart UI connected to backend
- Checkout page with Razorpay popup
- Auth pages (Login / Register)
- Order history page

### 🚧 Planned
- OAuth 2.0 (Google Login via Passport.js)
- AI recommendation microservice (FastAPI)
- Expanded product dataset (20+ items)
- Dockerization (backend + frontend + MongoDB)
- Deployment — Backend on Render, Frontend on Vercel

---

## 🧠 Architecture Highlights

- Service-layer architecture (Route → Controller → Service → Model)
- Centralized error handling via `error.middleware.js`
- Redis caching for performance
- Middleware-driven request lifecycle
- Secure authentication with httpOnly cookies
- Role-based access control

---

## 🧩 System Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌─────────────┐
│   React UI  │ ──────▶│  Express Backend │ ──────▶│  MongoDB    │
└─────────────┘        └──────────────────┘        └─────────────┘
       │                        │
       │                        ├──────────────────▶ Redis (cache)
       │                        │
       │                        ├──────────────────▶ Cloudinary (media)
       │                        │
       │                        └──────────────────▶ FastAPI (AI - planned)
       │
       └──────────────────────────────────────────▶ Razorpay (payments)
```

---

## 💳 Payments Flow (Razorpay)

```
1. User clicks "Pay" on Checkout page
        ↓
2. Frontend calls POST /api/v1/orders/create-razorpay-order
        ↓
3. Backend creates a Razorpay order → returns order_id
        ↓
4. Razorpay popup opens on Frontend
        ↓
5. User completes payment
        ↓
6. Frontend calls POST /api/v1/orders/verify-payment
        ↓
7. Backend verifies signature → creates order in DB
        ↓
8. Order confirmation shown to user ✅
```

---

## 🔐 OAuth 2.0 (Planned)

Google Login via Passport.js:

```
User clicks "Login with Google"
        ↓
Passport.js redirects to Google OAuth
        ↓
Google returns profile + tokens
        ↓
Backend creates/finds user → issues JWT
        ↓
User is logged in ✅
```

---

## 🤖 AI Recommendation Microservice (Planned)

A FastAPI-based recommendation engine will run as a separate microservice:

```
User views a product
        ↓
Frontend calls GET /api/v1/products/:id/recommendations
        ↓
Backend proxies to FastAPI microservice
        ↓
FastAPI returns similar products based on category + ratings
        ↓
Frontend displays "You might also like..." section
```

---

## 🐳 Docker (Planned)

```yaml
services:
  backend:   # Node.js + Express
  frontend:  # React + Vite
  mongo:     # MongoDB
  redis:     # Redis cache
```

Run everything with:
```bash
docker-compose up --build
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database & ODM |
| Redis | Caching layer |
| JWT | Authentication |
| Razorpay | Payment gateway |
| Zod | Request validation |
| Multer | File upload handling |
| Cloudinary | Cloud media storage |
| bcrypt | Password hashing |
| Winston | Application logging |
| Morgan | HTTP request logging |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |

### Frontend
| Technology | Purpose |
|---|---|
| React | UI library |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React Router | Client-side routing |
| Context API | Global state management |

---

## 📁 Project Structure

```
Ecommerce-backend/
│
├── Backend/
│   └── src/
│       ├── config/              # DB, Cloudinary, Redis
│       ├── constants/           # Roles, order/payment status enums
│       ├── controllers/         # Thin route handlers
│       ├── services/            # Business logic layer
│       ├── models/              # Mongoose schemas
│       ├── routes/              # Express routers
│       ├── middlewares/         # Auth, admin, validation, error handler
│       ├── validators/          # Zod schemas
│       ├── utils/               # ApiError, ApiResponse, asyncHandler, logger
│       ├── app.js
│       └── index.js
│
└── Frontend/
    └── src/
        ├── components/          # Navbar, ProductCard, Loader, Button
        ├── pages/               # Home, Products, Cart, Orders, Auth
        ├── services/            # API calls (axios)
        ├── context/             # AuthContext, CartContext
        ├── hooks/               # useAuth, useCart
        └── utils/               # formatPrice
```

---

## 🏗️ Request Lifecycle

```
Request → Route → Middleware → Controller → Service → Model → DB
                                    ↓
                     ApiResponse({ success, message, data })
                                    ↓
                      error.middleware.js (global catch)
```

Cart uses embedded documents — no junction tables:
```
cart → { userId, items: [{ productId, quantity }], totalPrice }
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Redis instance
- Razorpay account

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend/frontend
npm install
npm run dev
```

### Environment Variables

**Backend `.env`:**
```env
PORT=8000
CORS_ORIGIN=*
MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_URL=your_redis_url

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 📡 API Endpoints

### Auth — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register user |
| POST | `/login` | ❌ | Login |
| POST | `/logout` | ✅ | Logout |
| POST | `/refresh-token` | ❌ | Refresh access token |

### Products — `/api/v1/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | Get all products |
| GET | `/:id` | ❌ | Get single product |
| POST | `/` | ✅ Admin | Create product |
| PATCH | `/:id` | ✅ Admin | Update product |
| DELETE | `/:id` | ✅ Admin | Delete product |

### Cart — `/api/v1/cart`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get user cart |
| POST | `/` | ✅ | Add item to cart |
| PATCH | `/` | ✅ | Update item quantity |
| DELETE | `/:productId` | ✅ | Remove item |
| DELETE | `/clear` | ✅ | Clear cart |

### Orders — `/api/v1/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create-razorpay-order` | ✅ | Create Razorpay order |
| POST | `/verify-payment` | ✅ | Verify payment + save order |
| GET | `/` | ✅ | Get user orders |
| GET | `/:id` | ✅ | Get single order |
| PATCH | `/:id/status` | ✅ Admin | Update order status |

---

## 🛡️ Security

- Helmet for HTTP security headers
- Rate limiting on all routes
- JWT httpOnly cookies
- Password hashing with bcrypt
- Input validation with Zod on every route
- Role-based middleware (user / admin)
- Razorpay signature verification on payment callback

---

## 🚀 Deployment (Planned)

| Service | Platform |
|---|---|
| Backend | Render |
| Frontend | Vercel |
| Database | MongoDB Atlas |
| Cache | Redis Cloud |
| Media | Cloudinary |

---

## 📈 Project Status

| Feature | Status |
|---|---|
| Auth (JWT) | ✅ Complete |
| Product System | ✅ Complete |
| Cart System | ✅ Complete |
| Order System | ✅ Complete |
| Razorpay Integration | ✅ Complete |
| Frontend UI | ✅ Complete |
| Redis Caching | ✅ Complete |
| OAuth (Google) | 🚧 Planned |
| AI Recommendations | 🚧 Planned |
| Docker | 🚧 Planned |
| Deployment | 🚧 Planned |

---

## 📄 License

This project is licensed under the ISC License.
