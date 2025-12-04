import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="glass-panel" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SigmaStylist
            </Link>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/dashboard" style={{ color: '#aaa', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#aaa'}>Dashboard</Link>
                <Link to="/login" style={{ color: '#aaa', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#aaa'}>Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
