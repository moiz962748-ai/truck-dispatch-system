# Quick Start & Developer Reference

## 🚀 Server Startup

```bash
cd e:\InternshipProject
npm run dev
```

Open `http://localhost:5174/` in browser

## 📱 Pages & Routes

| Route | Component | Access | Purpose |
|-------|-----------|--------|---------|
| `/` | Home | Public | Landing page |
| `/login` | Login | Public | User authentication |
| `/register` | Register | Public | Account creation |
| `/dashboard` | DriverDashboard | Protected (driver) | Driver's loads |
| `/admin` | AdminDashboard | Protected (admin) | Fleet management |

## 🔑 Key Components

### Navbar
```jsx
import Navbar from './components/Navbar';

// Fixed at top, sticky positioning z-50
// Auto-detects logged in status
// Shows role-based menu items
```

### Footer
```jsx
import Footer from './components/Footer';

// Company info, links, social
// Responsive grid layout
```

### LoadForm
```jsx
import LoadForm from './components/LoadForm';

<LoadForm onSuccess={refreshFunction} />

// Form to submit new loads
// Triggers parent refresh on success
```

### PrivateRoute
```jsx
import PrivateRoute from './components/PrivateRoute';

<PrivateRoute allowedRoles={["driver"]}>
  <DriverDashboard />
</PrivateRoute>

// Checks token and role
// Redirects to login if unauthorized
```

## 🌐 API Functions

All in `src/api/api.js`:

```javascript
import { 
  loginUser,
  registerUser,
  fetchMyLoads,
  createLoad,
  fetchAllLoads,
  fetchDrivers,
  assignDriver,
  updateLoadStatus 
} from '../api/api.js';

// Usage:
const data = await loginUser({ email, password });
const loads = await fetchMyLoads();
await assignDriver(loadId, driverId);
```

## 🎨 Common Patterns

### Animated Entrance
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Input with Focus Animation
```jsx
<motion.input
  whileFocus={{ scale: 1.02 }}
  type="text"
  className="rounded-lg border-2 border-slate-300 focus:ring-2 focus:ring-blue-200"
/>
```

### Button with Tap Animation
```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={handleClick}
>
  Click Me
</motion.button>
```

### Loading State
```jsx
const [loading, setLoading] = useState(false);

{loading ? (
  <svg className="animate-spin h-4 w-4" />
) : (
  'Submit'
)}
```

### Error Alert
```jsx
{error && (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-red-50 p-3 rounded-lg text-red-700"
  >
    {error}
  </motion.div>
)}
```

### Success Toast
```jsx
const [success, setSuccess] = useState(false);

setTimeout(() => setSuccess(false), 2000);

{success && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-green-50 p-3 rounded-lg text-green-700"
  >
    ✓ Success message
  </motion.div>
)}
```

## 💾 LocalStorage & State

```javascript
// Saving auth data
localStorage.setItem('token', data.token);
localStorage.setItem('role', data.role);

// Getting auth data
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// Clearing on logout
localStorage.removeItem('token');
localStorage.removeItem('role');
```

## 🎯 Form Handling Pattern

```jsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');
  setLoading(true);

  try {
    const result = await apiFunction(formData);
    // Handle success
  } catch (err) {
    setError(err.response?.data?.message || 'Error message');
  } finally {
    setLoading(false);
  }
};
```

## 📊 Scroll Animation Pattern

```jsx
import { useEffect, useRef, useState } from 'react';

const refs = useRef({});
const [isVisible, setIsVisible] = useState({});

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ 
            ...prev, 
            [entry.target.id]: true 
          }));
        }
      });
    },
    { threshold: 0.1 }
  );

  Object.values(refs.current).forEach(ref => {
    if (ref) observer.observe(ref);
  });

  return () => observer.disconnect();
}, []);

// Usage:
<motion.section
  ref={el => (refs.current.section = el)}
  id="section"
  initial={{ opacity: 0 }}
  animate={isVisible.section ? { opacity: 1 } : {}}
>
  Content
</motion.section>
```

## 🔐 Protected Route Pattern

```jsx
<PrivateRoute allowedRoles={["admin"]}>
  <AdminDashboard />
</PrivateRoute>

// In PrivateRoute component:
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token) {
  return <Navigate to="/login" replace />;
}

if (allowedRoles && !allowedRoles.includes(role)) {
  return <Navigate to="/" replace />;
}

return children;
```

## 🆐 Responsive Classes

```jsx
// Mobile first approach:
<div className="text-sm md:text-base lg:text-lg">
  Text scales on bigger screens
</div>

// Responsive grid:
<div className="grid md:grid-cols-2 lg:grid-cols-3">
  This becomes 2 cols on md, 3 cols on lg
</div>

// Hide/show by breakpoint:
<div className="hidden md:block">
  Visible only on desktop
</div>

<div className="md:hidden">
  Hidden on desktop, visible on mobile
</div>

// Responsive padding:
<div className="p-4 md:p-6 lg:p-8">
  Different padding per breakpoint
</div>
```

## 🎬 Common Animations

### Fade In
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
/>
```

### Slide In Left
```jsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
/>
```

### Slide In Top
```jsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
/>
```

### Scale In
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
/>
```

### Staggered List
```jsx
<motion.div>
  {items.map((item, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

## 📝 Common Tailwind Classes

```jsx
// Spacing
px-4 py-3 gap-4 mb-6

// Colors
bg-blue-600 text-white border-slate-300

// Typography
text-2xl font-bold text-slate-900

// Layout
grid grid-cols-1 md:grid-cols-2

// Effects
rounded-lg shadow-lg hover:shadow-xl

// Flexbox
flex items-center justify-between gap-4

// Sizing
w-full h-auto max-w-6xl

// Positioning
relative absolute sticky z-50

// Responsive
hidden md:block sm:flex
```

## 🧪 Testing the Frontend

1. **Sign Up**
   - Go to `/register`
   - Fill form and submit
   - Should redirect to dashboard

2. **Log In**
   - Go to `/login`
   - Enter credentials
   - Should redirect based on role

3. **Driver Flow**
   - View assigned loads
   - Submit new load via form
   - See success message

4. **Admin Flow**
   - View all loads
   - Assign driver to load
   - Update load status
   - See highlight animation

## 🐛 Debugging Tips

```javascript
// Check localStorage
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('role'));

// Debug API calls in Network tab (browser DevTools)
// Check request headers for JWT

// Check for errors in Console tab

// Check if backend is running:
curl http://localhost:5000/api/loads
```

## 📦 Building for Production

```bash
npm run build
# Creates /dist folder with optimized files

npm run preview
# Preview production build locally
```

## 🎓 Learning Path

1. Start with `App.jsx` - see routing structure
2. Explore `pages/Home.jsx` - see animations
3. Check `components/Navbar.jsx` - responsive design
4. Study `api/api.js` - API integration
5. Review `pages/DriverDashboard.jsx` - data fetching
6. Examine `pages/AdminDashboard.jsx` - table management

---

**Happy Coding! The frontend is ready for integration.** 🚀
