# Truck Dispatch Management System - React Frontend

A modern, animated React frontend for managing truck dispatch operations with features for drivers and administrators.

## 🚀 Features

### Landing Page
- **Hero Section**: Animated gradient background with CTA buttons
- **About Section**: Feature highlights with icons and fade-in animations
- **Services Section**: Animated cards showcasing platform services
- **How It Works**: Step-by-step process visualization
- **Statistics Section**: Live metrics with animated counters
- **Contact Form**: Input focus animations and form submission

### Authentication
- **Login Page**: Animated form with responsive design
- **Register Page**: Multi-field form with password confirmation
- **JWT-based Auth**: Secure token storage in localStorage
- **Role-based Routing**: Driver and Admin access control

### Driver Dashboard
- **Assigned Loads**: Grid/card view with status indicators
- **Load Details**: Pickup, dropoff, weight, and status information
- **Load Form**: Submit new pickup requests
- **Real-time Updates**: Refresh button to sync load data

### Admin Dashboard
- **Statistics Cards**: Total loads, drivers, pending, delivered counts
- **Load Management Table**: View all loads with sortable columns
- **Driver Assignment**: Dropdown to assign drivers to loads
- **Status Updates**: Change load status (pending → assigned → delivered)
- **Highlight Animation**: New/updated items highlighted with animation

### Components
- **Navbar**: Sticky navigation with mobile hamburger menu
- **Footer**: Links and copyright information
- **LoadForm**: Animated form for submitting new loads
- **PrivateRoute**: Role-based route protection
- **Motion Components**: Framer Motion animations for smooth UX

## 📋 Tech Stack

- **React** 18.3.1
- **React Router DOM** 6.14.2 - Client-side routing
- **Axios** 1.6.0 - HTTP client with interceptors
- **Framer Motion** 10.16.4 - Animations and transitions
- **Tailwind CSS** 3.4.4 - Utility-first styling
- **Vite** 5.4.1 - Build tool and dev server

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on `http://localhost:5000/api`

### Steps

1. **Navigate to project directory**
   ```bash
   cd e:\InternshipProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5174/`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # App routing
├── index.css             # Global styles & animations
├── api/
│   └── api.js            # Axios instance with JWT interceptor
├── components/
│   ├── Navbar.jsx        # Navigation header
│   ├── Footer.jsx        # Footer
│   ├── LoadForm.jsx      # Load submission form
│   └── PrivateRoute.jsx  # Role-based route protection
├── pages/
│   ├── Home.jsx          # Landing page with all sections
│   ├── Login.jsx         # Login page
│   ├── Register.jsx      # Registration page
│   ├── DriverDashboard.jsx  # Driver dashboard
│   └── AdminDashboard.jsx   # Admin dashboard
```

## 🔌 API Endpoints

The frontend communicates with backend at `http://localhost:5000/api`:

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user

### Loads
- `GET /loads` - Fetch all loads (admin)
- `GET /loads/my` - Fetch driver's loads
- `POST /loads` - Create new load
- `PUT /loads/:id/assign` - Assign driver to load
- `PUT /loads/:id/status` - Update load status

### Drivers
- `GET /drivers` - Fetch all drivers (admin)

## 🎨 Animations & Interactions

- **Hero Section Blobs**: Continuous floating blob animations
- **Fade-in on Scroll**: Sections animate in when scrolling into view
- **Input Focus**: Scale and color transition on input focus
- **Button Hover/Tap**: Scale animations on button interactions
- **Status Highlights**: Green flash when updates occur
- **Modal Animations**: Smooth entrance/exit transitions
- **Loading States**: Animated spinners during data fetch

## 🔐 Security Features

- **JWT Token Storage**: Tokens saved in localStorage
- **Request Interceptor**: JWT automatically added to API requests
- **Route Protection**: PrivateRoute component checks auth and role
- **Auto Redirect**: Redirects to login if token expires

## 📱 Responsive Design

- **Desktop**: Full multi-column layouts
- **Tablet**: Optimized 2-column grids
- **Mobile**: Single column with hamburger menu
- **Touch-friendly**: Larger tap targets for mobile devices

## 🎯 User Roles

### Driver
- View assigned loads
- Submit new load requests
- Track load status

### Admin
- View all loads and drivers
- Assign drivers to loads
- Update load status
- View platform statistics

## 💡 Key Features Implementation

### JWT Authentication Flow
1. User logs in → POST /auth/login
2. Token received and stored in localStorage
3. Token automatically added to all API requests via interceptor
4. Role stored alongside token
5. PrivateRoute checks token and role before rendering

### Load Management
- Drivers submit loads via LoadForm
- Admin assigns drivers using dropdown
- Status updates trigger highlight animation
- Real-time sync with Refresh button

### Animations
- Framer Motion for component animations
- Tailwind CSS for state-based styling
- IntersectionObserver for scroll-triggered animations

## 🚀 Performance Optimizations

- Lazy loading of components
- Efficient state management with hooks
- Debounced refresh operations
- Optimized re-renders with motion layout

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check CORS settings on backend
- Verify API endpoints match frontend calls

### Authentication Issues
- Clear localStorage and retry login
- Check JWT token expiration
- Verify backend returns token in login response

### Animation Glitches
- Clear browser cache
- Update Framer Motion: `npm install framer-motion@latest`
- Check browser hardware acceleration settings

## 📦 Dependencies

See `package.json` for complete list. Key packages:
- react & react-dom: UI framework
- react-router-dom: Routing
- axios: API calls
- framer-motion: Animations
- tailwindcss: Styling

## 📄 License

Project for educational purposes.

## 🤝 Support

For issues or improvements, check the backend API documentation and ensure endpoints match frontend calls.
