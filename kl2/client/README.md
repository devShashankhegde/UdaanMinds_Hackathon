# KrishiLink Frontend

React TypeScript frontend for the KrishiLink agricultural platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Role-based access control

### Community Chat
- Ask and answer questions
- Category-based filtering
- Search functionality
- Real-time updates

### Fair Pricing
- Browse crop listings
- Create new listings (sellers)
- Contact sellers (buyers)
- Advanced filtering options

### Services
- Tool rental/sale listings
- Equipment categories
- Owner contact information
- Condition and pricing details

## Components Structure

### Pages
- `Home` - Landing page with features overview
- `CommunityChat` - Q&A community platform
- `FairPricing` - Crop marketplace
- `Services` - Tool and service listings

### Auth Components
- `Login` - User authentication
- `Register` - New user registration
- `ProtectedRoute` - Route protection wrapper
- `RoleBasedRoute` - Role-specific access control

### Common Components
- `Header` - Navigation and user menu
- `Footer` - Site footer information

## State Management

### AuthContext
- User authentication state
- Login/logout functionality
- Token management
- User profile data

### React Query
- API data fetching
- Caching and synchronization
- Loading and error states
- Optimistic updates

## Styling

- Material-UI components
- Responsive design
- Custom theme with agricultural colors
- Mobile-first approach

## API Integration

- Axios for HTTP requests
- Automatic token injection
- Error handling and redirects
- Request/response interceptors
