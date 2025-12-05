import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, PlusSquare, User, Settings } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            try {
                fetch('https://anonstyle-api.onrender.com/api/users/me', {
                    headers: { 'x-auth-token': token }
                })
                    .then(res => {
                        if (res.status === 401) {
                            localStorage.removeItem('token');
                            setIsLoggedIn(false);
                            setUsername('');
                            return null;
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (data && data.username) setUsername(data.username);
                    })
                    .catch(() => { });
            } catch (e) { }
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
    }, [location]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(3, 3, 3, 0.9)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
        >
            <Link to="/" style={{ zIndex: 10, textDecoration: 'none', color: 'white' }}>
                <h1 style={{
                    fontSize: '24px',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    margin: 0
                }}>
                    AnonStyle
                </h1>
            </Link>

            <div className="nav-links" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                {isLoggedIn ? (
                    <>
                        <Link to="/" title="Home" style={{ color: location.pathname === '/' ? 'white' : '#888' }}>
                            <Home size={24} />
                        </Link>
                        <Link to="/feed" title="Explore" style={{ color: location.pathname === '/feed' ? 'white' : '#888' }}>
                            <Search size={24} />
                        </Link>
                        <Link to="/dashboard" title="Create" style={{ color: location.pathname === '/dashboard' ? 'white' : '#888' }}>
                            <PlusSquare size={24} />
                        </Link>
                        {username && (
                            <Link to={`/u/${username}`} title="Profile" style={{ color: location.pathname.includes('/u/') ? 'white' : '#888' }}>
                                <User size={24} />
                            </Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Login</Link>
                        <Link to="/register" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Join</Link>
                    </>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
