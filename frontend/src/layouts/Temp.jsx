import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const PrivateLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">{children}</div>

      <Footer/>
    </>
  );
};

export default PrivateLayout;
