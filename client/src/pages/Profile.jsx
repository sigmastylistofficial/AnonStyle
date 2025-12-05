import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [looks, setLooks] = useState([]);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`https://anonstyle-api.onrender.com/api/looks/user/${username}`);
                setProfileData(res.data.user);
                setLooks(res.data.looks);

                // Check ownership
                const token = localStorage.getItem('token');
                if (token) {
                    const meRes = await axios.get('https://anonstyle-api.onrender.com/api/users/me', {
                        headers: { 'x-auth-token': token }
                    });
                    if (meRes.data.username === username) setIsOwner(true);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [username]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this look?')) return;
        try {
            await axios.delete(`https://anonstyle-api.onrender.com/api/looks/${id}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setLooks(looks.filter(look => look._id !== id));
        } catch (err) {
            console.error(err);
            alert('Error deleting look');
        }
    };

    if (!profileData) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
            <div className="container">

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ marginBottom: '100px', textAlign: 'center' }}
                >
                    {profileData.mainImage ? (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                height: '400px',
                                margin: '0 auto 30px',
                                overflow: 'hidden',
                                borderRadius: '4px'
                            }}
                        >
                            <img src={profileData.mainImage} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </motion.div>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            style={{
                                width: '100px',
                                height: '100px',
                                background: '#222',
                                borderRadius: '50%',
                                margin: '0 auto 30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px',
                                fontFamily: 'var(--font-serif)',
                                fontStyle: 'italic',
                                cursor: 'default'
                            }}
                        >
                            {username[0].toUpperCase()}
                        </motion.div>
                    )}

                    <h1 style={{ fontSize: '48px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                        {username}
                        {isOwner && (
                            <Link to="/settings" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                                <SettingsIcon size={24} />
                            </Link>
                        )}
                    </h1>
                    {profileData.mainImageCaption && (
                        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 10px' }}>
                            {profileData.mainImageCaption}
                        </p>
                    )}
                    <p style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '12px' }}>
                        Digital Archive
                    </p>
                </motion.div>

                {/* Looks Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    <AnimatePresence>
                        {looks.map((look, index) => (
                            <motion.div
                                key={look._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                style={{ position: 'relative', aspectRatio: '3/4' }}
                            >
                                {isOwner && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleDelete(look._id); }}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            zIndex: 10,
                                            background: 'rgba(0,0,0,0.6)',
                                            padding: '8px',
                                            borderRadius: '50%',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                <Link to={`/look/${look._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}
                                    >
                                        <img
                                            src={look.imageUrl}
                                            alt={look.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />

                                        {/* Hover Overlay with Title */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: '20px',
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                color: 'white'
                                            }}
                                        >
                                            <h3 style={{ fontSize: '16px', margin: 0 }}>{look.title}</h3>
                                        </motion.div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Profile;
