import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('loggedIn', 'true');
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(`Server error. Please try again. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid login-container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-5 col-xl-4">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white text-center py-4">
              <FaUserCircle className="mb-2" size={50} />
              <h3 className="font-weight-bold">Welcome Back!</h3>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaEnvelope className="text-primary" />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="emailInput" className="d-none">Email address</label>
                  </div>
                </div>

                <div className="form-floating mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaLock className="text-primary" />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="passwordInput" className="d-none">Password</label>
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" /> Login
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="card-footer bg-light p-3 text-center">
              <a href="#" className="text-decoration-none text-primary">Forgot Password?</a>
              <div className="mt-3">
                <small className="text-muted">Don't have an account? <a href="#" className="text-decoration-none text-primary">Sign Up</a></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;