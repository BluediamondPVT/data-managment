// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import CustomerManagement from './pages/CustomerManagement'; 
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';



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
      <Home />
    </PrivateRoute>
  }
/>

<Route
  path="/customers"
  element={
    <PrivateRoute>
      <CustomerManagement />
    </PrivateRoute>
  }
/>

    </Routes>
  );
}

export default App;