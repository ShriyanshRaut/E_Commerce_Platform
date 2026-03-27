# 🛒 Scalable E-commerce Backend

A scalable, production-ready e-commerce backend system built with Node.js and Express, featuring authentication, caching, media uploads, and a clean service-layer architecture.

---

## 🚀 Features

- JWT-based authentication (access + refresh tokens)
- Role-based access control (User / Admin)
- Product management with image uploads via Cloudinary
- Cart system with embedded MongoDB documents
- Order management with status tracking
- Review and rating system
- Coupon and discount system
- Category management
- Request validation with Zod
- Centralized error handling
- Rate limiting and security headers
- Winston logging + Morgan request logs
- ⚡ Redis caching for performance optimization

---

## 🧠 Architecture Highlights

- Service-layer architecture for scalability
- Centralized error handling
- Redis caching for performance
- Middleware-driven request lifecycle
- Secure authentication & role-based access

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database & ODM |
| Redis | Caching layer |
| JWT | Authentication |
| Zod | Request validation |
| Multer | File upload handling |
| Cloudinary | Cloud media storage |
| bcrypt | Password hashing |
| Winston | Application logging |
| Morgan | HTTP request logging |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| dotenv | Environment config |

---

## 📁 Project Structure

```
src/
├── config/                   # External service configs
│   ├── db.js
│   ├── cloudinary.js
│   └── redis.js
├── constants/                # Enums & magic string prevention
│   ├── roles.js
│   ├── orderStatus.js
│   └── paymentStatus.js
├── controllers/              # Route handlers (thin layer)
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── order.controller.js
│   ├── review.controller.js
│   ├── coupon.controller.js
│   └── category.controller.js
├── services/                 # Business logic layer
│   ├── user.service.js
│   ├── product.service.js
│   ├── cart.service.js
│   ├── order.service.js      # payment logic lives here
│   ├── review.service.js
│   └── coupon.service.js
├── models/                   # Mongoose schemas
│   ├── user.model.js
│   ├── product.model.js
│   ├── cart.model.js
│   ├── order.model.js
│   ├── review.model.js
│   ├── coupon.model.js
│   └── category.model.js
├── routes/                   # Express routers
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── review.routes.js
│   ├── coupon.routes.js
│   └── category.routes.js
├── middlewares/              # Custom middleware
│   ├── auth.middleware.js
│   ├── admin.middleware.js
│   ├── multer.middleware.js
│   ├── rateLimiter.js
│   ├── validate.js           # applies Zod schemas
│   └── error.middleware.js   # global error handler
├── validators/               # Zod schemas only
│   ├── user.validator.js
│   ├── product.validator.js
│   ├── cart.validator.js
│   └── order.validator.js
├── utils/                    # Utility classes
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── logger.js
├── app.js
├── constants.js
└── index.js
```

---

## 🏗️ Architecture

```
Request → Route → Middleware → Controller → Service → Model → DB
                                    ↓
                             ApiResponse({ success, message, data })
                                    ↓
                          error.middleware.js (global catch)
```

Cart schema uses embedded documents (MongoDB style) — no junction tables:
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

### Installation

```bash
git clone https://github.com/ShriyanshRaut/Ecommerce-backend.git
cd Ecommerce-backend
npm install
```

### Environment Variables

Create a `.env` file in the root:

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
```

### Run the Server

```bash
npm run dev
```

Server starts on `http://localhost:8000`

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
| POST | `/` | ✅ | Create order from cart |
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

---

## 📈 Project Status

Phase 6: Backend Completed ✅

---

## 📄 License

This project is licensed under the ISC License.
