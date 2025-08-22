# KrishiLink Backend API

Node.js/Express backend for the KrishiLink agricultural platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Auth Routes (`/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

#### Community Routes (`/community`)
- `GET /questions` - Get all questions (with pagination)
- `POST /questions` - Create new question (protected)
- `GET /questions/:id` - Get specific question
- `POST /questions/:id/answers` - Answer a question (protected)
- `DELETE /questions/:id` - Delete question (protected, owner only)

#### Listings Routes (`/listings`)
- `GET /` - Get all crop listings (with filters)
- `POST /` - Create new listing (protected, seller only)
- `GET /my-listings` - Get user's listings (protected)
- `GET /:id` - Get specific listing
- `PUT /:id` - Update listing (protected, owner only)
- `DELETE /:id` - Delete listing (protected, owner only)
- `POST /:id/contact` - Get seller contact info (protected, buyer only)

#### Services Routes (`/services`)
- `GET /tools` - Get tool listings (with filters)
- `POST /tools` - Create tool listing (protected)
- `GET /tools/my-tools` - Get user's tools (protected)
- `GET /tools/:id` - Get specific tool
- `PUT /tools/:id` - Update tool (protected, owner only)
- `DELETE /tools/:id` - Delete tool (protected, owner only)

## Database Models

### User
- Personal information and authentication
- Role-based access (seller/buyer/both)
- Location details

### Question
- Community questions with answers
- Categories and tags
- Voting and view tracking

### Listing
- Crop listings with pricing
- Quality grades and quantities
- Location and contact tracking

### Tool
- Agricultural tool listings
- Rental/sale options
- Specifications and condition

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- CORS protection
- Helmet security headers
