import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response?.data);
            alert('Registration failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
            <div className="glass-panel" style={{ padding: '40px' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Register</h2>
                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={onChange} className="input-field" required />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} className="input-field" required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign Up</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
                    Already have an account? <Link to="/login" style={{ color: 'white' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
