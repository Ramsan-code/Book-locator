# 📚 BookLink - Book Marketplace API

A RESTful API for a peer-to-peer book marketplace where users can buy, rent, and review books with location-based features.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Book Listings**: CRUD operations for books with geolocation support
- **Transaction System**: Buy and rent books with status tracking
- **Review System**: Rate and review books (1-5 stars)
- **Location-Based**: Geographic coordinates for proximity searches
- **Authentication**: JWT-based secure authentication
- **Pagination**: Efficient data retrieval with pagination support

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Deployment**: Vercel (Serverless)

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd booklink
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configurations:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. **Run the application**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 👤 Readers (Users)

#### Register a new user
```http
POST /api/readers/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": {
    "type": "Point",
    "coordinates": [80.2167, 6.0329]
  }
}
```

#### Login
```http
POST /api/readers/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get all readers
```http
GET /api/readers
```

#### Get user profile (Protected)
```http
GET /api/readers/profile
Authorization: Bearer <token>
```

#### Update profile (Protected)
```http
PUT /api/readers/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "location": {
    "type": "Point",
    "coordinates": [80.2167, 6.0329]
  }
}
```

---

### 📖 Books

#### Get all books (with pagination)
```http
GET /api/books?page=1&limit=10
```

#### Get book by ID
```http
GET /api/books/:id
```

#### Search books by genre
```http
GET /api/books/genre/Fiction
```

#### Create a new book
```http
POST /api/books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "Fiction",
  "condition": "Good",
  "price": 15.99,
  "mode": "Sell",
  "location": {
    "type": "Point",
    "coordinates": [80.2167, 6.0329]
  },
  "owner": "reader_id_here",
  "description": "Classic American novel",
  "available": true
}
```

#### Update a book
```http
PUT /api/books/:id
Content-Type: application/json

{
  "price": 12.99,
  "available": true
}
```

#### Delete a book
```http
DELETE /api/books/:id
```

---

### ⭐ Reviews

#### Get reviews for a book
```http
GET /api/reviews/:bookId
```

#### Create a review (Protected)
```http
POST /api/reviews/:bookId
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent book!"
}
```

#### Delete a review (Protected)
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

---

### 💰 Transactions

#### Create a transaction (Protected)
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book_id_here",
  "type": "Rent",
  "rentDurationDays": 14
}
```

#### Get user transactions (Protected)
```http
GET /api/transactions
Authorization: Bearer <token>
```

#### Get transaction by ID (Protected)
```http
GET /api/transactions/:id
Authorization: Bearer <token>
```

#### Update transaction status (Protected)
```http
PUT /api/transactions/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Completed"
}
```

---

## 📊 Data Models

### Reader
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  bio: String,
  avatar: String
}
```

### Book
```javascript
{
  title: String (required),
  author: String (required),
  category: Enum ["Fiction", "Non-fiction", "Education", "Comics", "Other"],
  condition: Enum ["New", "Good", "Used"],
  price: Number (required),
  mode: Enum ["Sell", "Rent"],
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  owner: ObjectId (ref: Reader),
  image: String,
  description: String,
  available: Boolean
}
```

### Review
```javascript
{
  book: ObjectId (ref: Book),
  reviewer: ObjectId (ref: Reader),
  rating: Number (1-5),
  comment: String
}
```

### Transaction
```javascript
{
  book: ObjectId (ref: Book),
  buyer: ObjectId (ref: Reader),
  seller: ObjectId (ref: Reader),
  type: Enum ["Buy", "Rent"],
  rentDurationDays: Number,
  price: Number,
  status: Enum ["Pending", "Completed", "Cancelled"]
}
```

---

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- CORS enabled
- Input validation via Mongoose schemas

---

## 🚀 Deployment

### Vercel
The project is configured for Vercel deployment:

```bash
vercel deploy
```

Make sure to set environment variables in Vercel dashboard:
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

ISC License

---

## 👨‍💻 Author

Your Name

---

## 🐛 Known Issues / TODO

- [ ] Add image upload functionality for books
- [ ] Implement location-based search (find books near me)
- [ ] Add email notifications for transactions
- [ ] Implement rate limiting
- [ ] Add input validation middleware
- [ ] Add comprehensive testing
- [ ] Implement book availability calendar for rentals

---

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.