import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddUserForm from '../pages/Form';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/login');
  };



const [gmailName, setGmailName] = useState('User');

useEffect(() => {
    // Fetch user data from backend or localStorage
    const fetchUser = async () => {
        // Try to get from localStorage first
        let name = localStorage.getItem('gmailName');
        if (!name) {
            // If not in localStorage, fetch from backend
            try {
                const res = await fetch(`http://localhost:5000/api/auth/me`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    name = data.name || data.email || 'User';
                    localStorage.setItem('gmailName', name);
                }
            } catch {
                name = 'User';
            }
        }
        setGmailName(name || 'User');
    };
    fetchUser();
}, []);

// Get the first letter for the rounded icon
const firstLetter = gmailName.charAt(0).toUpperCase();

const [showForm, setShowForm] = useState(false);

return (
    <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 20,
                            marginRight: 10,
                        }}
                    >
                        {firstLetter}
                    </div>
                    <span>{gmailName}</span>
                </div>
                <div>
                    <button
                        className="btn me-3 btn-outline-primary"
                        onClick={() => setShowForm(true)}
                    >
                        +Add Lead
                    </button>
                    <button onClick={handleLogout} className="btn btn-outline-danger me-2">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
        {showForm && (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050,
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        background: '#fff',
                        borderRadius: 8,
                        padding: 24,
                        minWidth: 350,
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                    }}
                >
                    <button
                        onClick={() => setShowForm(false)}
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'transparent',
                            border: 'none',
                            fontSize: 22,
                            cursor: 'pointer',
                        }}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <AddUserForm onClose={() => setShowForm(false)} />
                </div>
            </div>
        )}
    </>
);
};

export default Navbar;
