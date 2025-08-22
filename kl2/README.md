# 🌾 KrishiLink - Agricultural Community Platform

**"For the farmers, by the farmers, to the farmers"**

KrishiLink is a comprehensive full-stack web application that connects farmers across India for community support, fair pricing, and agricultural services. Built as a hackathon solution to address real farming challenges.

## 🚀 Features

### 🗣️ Community Chat
- Ask questions and get answers from experienced farmers
- Share agricultural knowledge and best practices
- Categorized discussions (farming, pricing, tools, weather)
- Real-time Q&A with voting system

### 💰 Fair Pricing Marketplace
- Transparent crop pricing with market rates
- Direct seller-buyer connections
- Quality grading system (Grade A, B, C)
- Location-based listings with contact information

### 🛠️ Agricultural Services
- **Tool Rental/Sale**: Tractors, harvesters, ploughs, sprayers
- **Labor Services**: Find skilled agricultural workers (Coming Soon)
- **Storage & Land**: Storage facilities and land lease options (Coming Soon)

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access (Seller, Buyer, Both)
- Protected routes and API endpoints
- Input validation and sanitization

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Joi** for input validation

### Frontend
- **React 18** with TypeScript
- **Material-UI** for modern UI components
- **React Router v6** for navigation
- **React Query** for data fetching
- **React Hook Form** for form handling
- **Axios** for API calls

## 📁 Project Structure

```
kl2/
├── server/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── config/         # Database config
│   │   └── utils/          # Helper functions
│   └── package.json
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Main pages
│   │   ├── context/        # React contexts
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Setup
```bash
cd kl2
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/krishilink
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Community
- `GET /api/community/questions` - Get all questions
- `POST /api/community/questions` - Create question
- `GET /api/community/questions/:id` - Get specific question
- `POST /api/community/questions/:id/answers` - Answer question

### Fair Pricing
- `GET /api/listings` - Get all crop listings
- `POST /api/listings` - Create new listing
- `GET /api/listings/:id` - Get specific listing
- `POST /api/listings/:id/contact` - Contact seller

### Services
- `GET /api/services/tools` - Get tool listings
- `POST /api/services/tools` - Create tool listing
- `GET /api/services/tools/:id` - Get specific tool

## 👥 User Roles

### Seller
- Create crop listings
- Manage own listings
- Participate in community discussions
- List tools and services

### Buyer
- Browse crop listings
- Contact sellers
- Participate in community discussions
- Access tool rental services

### Both
- All seller and buyer privileges
- Maximum platform access

## 🎯 Hackathon Features

### Problem Solved
- **Information Gap**: Farmers lack access to market information
- **Price Manipulation**: Middlemen exploit farmers with unfair prices
- **Resource Sharing**: Limited access to expensive agricultural tools
- **Knowledge Sharing**: Isolated farming practices without community support

### Innovation Points
- **Direct Farmer-to-Buyer Connection**: Eliminates middlemen
- **Community-Driven Knowledge**: Peer-to-peer learning platform
- **Resource Optimization**: Shared tool economy for farmers
- **Transparent Pricing**: Open marketplace with fair price discovery

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **Real-time Chat**: WebSocket-based messaging
- **Weather Integration**: Weather forecasts and alerts
- **Payment Gateway**: Integrated payment processing
- **AI Recommendations**: ML-based crop and price suggestions
- **Multilingual Support**: Regional language support
- **GPS Integration**: Location-based services
- **Rating System**: User and product rating system

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for farmers across India
- Inspired by the need for agricultural digitization
- Designed to empower rural communities
- Created with ❤️ for the farming community

---

**KrishiLink** - Connecting farmers, empowering agriculture, building the future of farming in India.
