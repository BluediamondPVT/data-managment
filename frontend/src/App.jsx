// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import CustomerManagement from './pages/CustomerManagement'; 
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import PrivateLayout from './layouts/Temp';
// import PrivateLayout from './layouts/PrivateLayout';



function App() {
  return (
    <Routes>
      {/* Public Route (No Navbar) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Private Route with Navbar layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Home />
            </PrivateLayout>
          </PrivateRoute>
        }
      />

      {/* Add new route for CustomerManagement */}
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <CustomerManagement />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;