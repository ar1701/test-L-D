# SmartCard AI - L&D Management Platform

A comprehensive Learning & Development (L&D) management platform with demo account functionality. This project features a React frontend with two distinct portals (User Portal and Admin Portal) and a Flask backend API.

## Project Structure

```
smartcard-project/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin portal components
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminLogin.jsx
│   │   │   ├── ld-saas-platform/  # User portal components
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   └── ...
│   │   │   ├── ui/             # Shared UI components
│   │   │   └── theme-provider.jsx
│   │   ├── config/
│   │   │   └── api.js          # API configuration
│   │   ├── services/
│   │   │   └── api.js          # API service utilities
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx           # Application entry point
│   ├── .env                    # Environment variables (development)
│   ├── .env.production        # Environment variables (production)
│   └── package.json           # Frontend dependencies
└── backend/                   # Flask backend API
    ├── app.py                # Main Flask application
    ├── requirements.txt      # Python dependencies
    ├── .env                  # Backend environment variables (development)
    └── .env.production      # Backend environment variables (production)
```

## Features

### User Portal (LD SaaS Platform)

- **Homepage**: Landing page with platform overview
- **Registration**: User registration with L&D and Demo account types
- **Login/Authentication**: Secure user authentication
- **Dashboard**: Personalized learning dashboard
- **Course Management**: Learning content and progress tracking

### Admin Portal

- **Admin Authentication**: Secure admin login
- **Customer Management**: Manage L&D registrations and demo accounts
- **User Analytics**: Track user engagement and platform usage
- **Demo Account Control**: Create, revoke, and renew demo accounts

## Environment Configuration

The project uses environment variables for easy configuration management:

### Frontend Environment Variables

**Development (.env.development)**:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ENV=development
```

**Production (.env.production)**:

```bash
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_APP_ENV=production
```

### Backend Environment Variables

**Development (.env)**:

```bash
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-super-secret-key-change-in-production
API_BASE_URL=http://localhost:5000/api
CORS_ORIGINS=http://localhost:3000
```

**Production (.env.production)**:

```bash
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-production-secret-key-here
API_BASE_URL=https://your-production-domain.com/api
CORS_ORIGINS=https://your-production-domain.com
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or pnpm

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd smartcard-project/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd smartcard-project/backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```

The backend API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Portal APIs

- `GET /api/user/profile` - Get user profile
- `GET /api/user/dashboard` - Get user dashboard data

### Admin Portal APIs

- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users (admin only)

### Portal Routes

- `/user-portal` - Access User Portal (LD SaaS Platform)
- `/admin-portal` - Access Admin Portal

## Usage

### Accessing User Portal

Visit `http://localhost:5000/user-portal` to access the user-facing LD SaaS platform.

### Accessing Admin Portal

Visit `http://localhost:5000/admin-portal` to access the admin dashboard.

**Demo Credentials:**

- Admin: `admin` / `admin123`
- User: `user` / `user123`

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

### Backend Production

1. Update `.env.production` with your production settings
2. Use a production WSGI server like Gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

## Configuration Management

### Changing API Base URL

**For Development**: Update `frontend/.env.development`

```bash
VITE_API_BASE_URL=http://your-dev-api.com/api
```

**For Production**: Update `frontend/.env.production`

```bash
VITE_API_BASE_URL=https://your-production-api.com/api
```

The application will automatically use the correct environment configuration based on the build mode.

## Technology Stack

### Frontend

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API calls

### Backend

- **Flask**: Lightweight Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **Python-dotenv**: Environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
