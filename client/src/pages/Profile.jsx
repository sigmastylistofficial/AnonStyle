import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Profile = () => {
    const { username } = useParams();
    const [looks, setLooks] = useState([]);

    useEffect(() => {
        const fetchLooks = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/looks/user/${username}`);
                setLooks(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLooks();
    }, [username]);

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '48px' }}>@{username}</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {looks.map((look, index) => (
                    <motion.div
                        key={look._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel"
                        style={{ overflow: 'hidden' }}
                    >
                        <img src={look.imageUrl} alt={look.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ marginBottom: '15px' }}>{look.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {look.links.map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center', transition: 'background 0.3s' }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>
                                        {link.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
