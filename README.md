# KrishiLink - Agricultural Platform

A comprehensive platform connecting farmers, buyers, and agricultural services.

## Features

- **User Authentication**: Secure registration and login system
- **Community Q&A**: Platform for farmers to ask questions and share knowledge
- **Market Pricing**: Real-time and historical crop price information
- **Services Marketplace**: Tools, labor, and storage services listings
- **Responsive Design**: Mobile-friendly interface

## Technology Stack

### Frontend
- HTML5, CSS3 (Flexbox/Grid)
- Minimal JavaScript for form validation
- Responsive design

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- Passport.js for authentication
- Session-based auth with bcrypt

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB connection string and session secret

5. Build and run:
   ```bash
   npm run build
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout
- `GET /auth/me` - Current user profile

### Community
- `GET /community/questions` - List questions
- `POST /community/questions` - Add question
- `POST /community/questions/:id/answers` - Add answer

### Market
- `GET /market-prices` - Get crop prices

### Listings
- CRUD endpoints for managing crop, tool, labor, and storage listings

## Deployment

The application is designed to be deployed on cloud platforms like Railway, Heroku, or VPS with MongoDB Atlas for database hosting.

## License

MIT License
