// // src/layouts/PrivateLayout.jsx
// import Footer from '../components/Footer';
// import Navbar from '../components/Navbar';

// const PrivateLayout = ({ children }) => {
//   return (
//     <>
//       <Navbar />
//       <div className="container mt-4">{children}</div>

//       <Footer/>
//     </>
//   );
// };

// export default PrivateLayout;


import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? (
    <>
      <Navbar />
      <div className="container mt-4">{children}</div>
      <Footer />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
