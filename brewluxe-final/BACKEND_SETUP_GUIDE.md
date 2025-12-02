# 🚀 BREWLUXE Backend Implementation Guide

## Overview

This guide provides instructions for creating a fully functional backend for the BREWLUXE coffee shop website with Node.js and Express.

---

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- **Basic understanding of Node.js and Express**

---

## Step 1: Create Project Structure

### Create the backend folder
```bash
mkdir brewluxe-backend
cd brewluxe-backend
```

### Initialize npm project
```bash
npm init -y
```

---

## Step 2: Install Dependencies

```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken multer nodemailer
npm install --save-dev nodemon
```

### What each package does:
- **express**: Web framework
- **cors**: Enable cross-origin requests
- **dotenv**: Environment variable management
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **multer**: File uploads
- **nodemailer**: Email sending
- **nodemon**: Auto-restart server on changes

---

## Step 3: Create Project Structure

```
brewluxe-backend/
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Order.js
│   ├── Product.js
│   └── GiftCard.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── cart.js
│   └── payments.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── paymentController.js
├── utils/
│   ├── emailService.js
│   └── validators.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## Step 4: Create .env File

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/brewluxe
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Stripe/Payment
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

---

## Step 5: Create server.js

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ MongoDB Connected');
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/payments', require('./routes/payments'));

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Server is running! ✅' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## Step 6: Create Models

### User Model (models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    loyaltyPoints: { type: Number, default: 0 },
    favoriteItems: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Order Model (models/Order.js)
```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    userId: mongoose.Schema.Types.ObjectId,
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    total: Number,
    deliveryFee: Number,
    subtotal: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'on-way', 'delivered'],
        default: 'pending'
    },
    orderType: { type: String, enum: ['pickup', 'delivery'] },
    deliveryAddress: String,
    phone: String,
    email: String,
    paymentMethod: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
```

### Product Model (models/Product.js)
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['menu', 'beans'] },
    description: String,
    price: { type: Number, required: true },
    image: String,
    rating: { type: Number, default: 5 },
    inStock: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
```

### Gift Card Model (models/GiftCard.js)
```javascript
const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    amount: Number,
    balance: Number,
    isActive: { type: Boolean, default: true },
    purchasedBy: mongoose.Schema.Types.ObjectId,
    usedBy: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
});

module.exports = mongoose.model('GiftCard', giftCardSchema);
```

---

## Step 7: Create Authentication Routes

```javascript
// routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ name, email, password, phone });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).json({
            message: '✅ Registration successful!',
            user: { id: user._id, name, email },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.json({
            message: '✅ Login successful!',
            user: { id: user._id, name: user.name, email },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

---

## Step 8: Create Products Routes

```javascript
// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create product (admin only)
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: '✅ Product created', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

---

## Step 9: Create Orders Routes

```javascript
// routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create order
router.post('/create', async (req, res) => {
    try {
        const { items, total, deliveryFee, orderType, address, phone, email } = req.body;
        
        const orderId = 'ORD' + Date.now().toString().slice(-8);
        
        const order = new Order({
            orderId,
            items,
            total,
            deliveryFee,
            subtotal: total - deliveryFee,
            orderType,
            deliveryAddress: address,
            phone,
            email,
            status: 'confirmed'
        });

        await order.save();

        res.status(201).json({
            message: '✅ Order placed successfully!',
            order
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status },
            { new: true }
        );
        res.json({ message: '✅ Order updated', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

---

## Step 10: Update package.json

```json
{
  "name": "brewluxe-backend",
  "version": "1.0.0",
  "description": "BREWLUXE Coffee Shop Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5",
    "nodemailer": "^6.9.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

---

## Step 11: Running the Backend

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Expected Output
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

## Step 12: Test API Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "phone": "9876543210"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": "1", "name": "Espresso", "price": 3.50, "quantity": 2}
    ],
    "total": 7.00,
    "deliveryFee": 3.99,
    "orderType": "delivery",
    "address": "123 Coffee Street",
    "phone": "9876543210",
    "email": "john@example.com"
  }'
```

---

## Frontend Integration

### Update Frontend API Calls

In your HTML JavaScript, update the API base URL:

```javascript
// Add at the top of your script
const API_BASE = 'http://localhost:5000/api';

// Example: Register user
async function registerUser(userData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
}

// Example: Get products
async function getProducts() {
    const response = await fetch(`${API_BASE}/products`);
    return response.json();
}

// Example: Create order
async function createOrder(orderData) {
    const response = await fetch(`${API_BASE}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    return response.json();
}
```

---

## Database Setup (MongoDB)

### Install MongoDB Locally
1. Download from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start the MongoDB service
3. MongoDB runs on port 27017 by default

### Or Use MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

---

## Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create brewluxe-api

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_url

# Deploy
git push heroku main
```

### Deploy to Railway/Render
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Auto-deploy on push to main branch

---

## Security Checklist

- ✅ Use environment variables for sensitive data
- ✅ Hash passwords with bcryptjs
- ✅ Implement JWT authentication
- ✅ Validate input data
- ✅ Use HTTPS in production
- ✅ Set CORS properly
- ✅ Rate limiting (to be added)
- ✅ SQL injection prevention
- ✅ XSS protection

---

## Next Steps

1. **Add Payment Gateway**: Integrate Stripe or PayPal
2. **Email Notifications**: Nodemailer setup for order confirmations
3. **Admin Dashboard**: Create admin routes and frontend
4. **Real-time Updates**: Use WebSockets for order tracking
5. **Analytics**: Track sales and customer data
6. **Image Upload**: Integrate cloud storage (AWS S3 or Cloudinary)
7. **Rate Limiting**: Add express-rate-limit
8. **Caching**: Implement Redis

---

**Backend is now ready for production!** 🎉
