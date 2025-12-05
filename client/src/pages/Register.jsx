import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('https://anonstyle-api.onrender.com/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response?.data);
            alert('Registration failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
            >
                <h2 style={{ fontSize: '32px', marginBottom: '40px', textAlign: 'center' }}>Join the Collective</h2>

                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '30px' }}>
                        <input
                            type="text"
                            name="username"
                            placeholder="CHOOSE USERNAME"
                            value={formData.username}
                            onChange={onChange}
                            className="input-minimal"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '50px' }}>
                        <input
                            type="password"
                            name="password"
                            placeholder="CHOOSE PASSWORD"
                            value={formData.password}
                            onChange={onChange}
                            className="input-minimal"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-fashion" style={{ width: '100%' }}>Create Account</button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <Link to="/login" style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Already a Member?
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
