# KrishiLink – A Platform Connecting Farmers, Buyers, and Agricultural Services

**CodeFury 8.0 Hackathon, UVCE College**

KrishiLink is a web platform designed to empower Indian farmers by providing transparent crop pricing, direct buyer-seller connections, agricultural services listings, and community Q&A. It integrates a clean, responsive frontend with a robust Node.js and MongoDB backend — featuring session-based authentication, secure data handling, and REST APIs.

## Project Overview

KrishiLink is an integrated digital marketplace and community platform designed to streamline agricultural trade and services. It connects farmers, buyers, and agricultural service providers within a user-friendly web application, empowering stakeholders to transact transparently, access real-time market information, and leverage community knowledge.

### Key Features

- **Responsive Multi-page Frontend** with modern HTML5 and CSS3 (Flexbox/Grid)  
- **User Authentication**: Secure session-based login/registration for farmers, buyers  
- **Community Q&A**: Platform for asking and answering agricultural questions  
- **Live Crop Pricing**: Timely market price display using cards and tables  
- **Listings Management**: CRUD operations for crops, tools, labor, and storage services  
- **Image & File Upload**: Support for product and service listings  
- **RESTful API Backend** built with Node.js, Express.js, and TypeScript  
- **MongoDB + Mongoose** for scalable data storage  
- **Authentication Security** using Passport.js (Local Strategy) and bcrypt  
- **Input Validation** using Joi for robust data integrity  
- **Static Frontend Files Served via Express** for ease of deployment  
- **Clean Navigation** with consistent header/footer and relative linking  
- **Modular Codebase** designed for scalability and further extension  

### Benefits

- Reduced information asymmetry between farmers and buyers  
- Transparent and fair pricing for agricultural products  
- Easy access to agricultural tools, labor, and storage service listings  
- A collaborative platform enabling farmers to share knowledge and resolve issues  
- Secure, scalable, and maintainable codebase suitable for production use  

---

## Technology Stack

| Layer            | Technology                   | Description                                      |
|------------------|-----------------------------|------------------------------------------------|
| **Frontend**     | HTML5, CSS3 with Flexbox/Grid | Clean and responsive static multi-page design  |
|                  | Minimal JavaScript             | Basic validation and interactivity              |
| **Backend**      | Node.js, Express.js           | REST API server with TypeScript optional        |
|                  | Passport.js (Local Strategy)  | Secure session-based authentication              |
|                  | Multer                       | Handling file and image uploads                   |
|                  | Joi                          | Input validation and sanitization                 |
| **Database**     | MongoDB, Mongoose             | Schema-based NoSQL database                       |
| **Deployment**   | Railway / Heroku / VPS        | Cloud hosting with static file serving            |

---

## Architecture Overview

- **Frontend**:  
  Multi-page static site (home, login, register, community Q&A, pricing, services) served as static files from backend using `express.static()`.  
  Navigation uses relative links maintained via consistent header/footer components.

- **Backend REST API**:  
  Handles authentication, Q&A CRUD, marketplace listings CRUD, and crop pricing endpoints.  
  Includes secure session management with Passport.js and bcrypt password hashing.

- **Database**:  
  MongoDB stores users, listings, questions, answers, and pricing data.  
  Mongoose schemas enforce data models with validation using Joi.

- **Deployment**:  
  The Node.js server hosts APIs and static frontend, deployable on cloud platforms with environment variable configuration for secrets and database connectivity.

---

This modular architecture ensures scalability, security, and maintainability, making KrishiLink a robust solution for agricultural marketplace needs.

## Screenshots & Demo Walkthrough

### 1. Landing Page (home.html)
Welcome page showcasing platform features, benefits, and quick navigation.

![Landing Page](ScreenShots/homepage.jpg)

---

### 2. User Authentication
Clean login and registration forms supporting secure farmer and buyer access.

![Login Page](screenshots/login.png)  
![Register Page](screenshots/register.png)

---

### 3. Community Q&A (community.html)
Interactive Q&A space where users ask questions, share knowledge, and answer queries.

![Community Q&A](screenshots/community.png)

---

### 4. Crop Market Pricing (pricing.html)
Real-time crop prices displayed in easy-to-read cards and tables for informed decisions.

![Market Pricing](screenshots/pricing.png)

---

### 5. Agricultural Services Listings (services.html)
Tools, labor, and storage services with images, descriptions, and contact information.

![Services Listings](screenshots/services.png)

---

### 6. Product Marketplace & Listings
Browse, search, and filter crop listings posted by farmers with images and pricing.

![Marketplace](screenshots/marketplace.png)

---

### 7. Backend API Demo
Use of REST API endpoints to fetch and post user data, listings, and community content.

![API Postman Demo](screenshots/api-postman.png)

---

### 8. Responsive Design
Fully responsive UI adapting seamlessly across mobile, tablet, and desktop.

![Responsive Design](screenshots/responsive-demo.png)

---

### 9. Demo Walkthrough Video
A short video showcasing user registration, product listing creation, browsing, and price viewing.

[Watch Demo Video](link-to-your-demo-video)

---

*Ensure screenshots are saved in a `screenshots/` folder relative to the README.md file.*

