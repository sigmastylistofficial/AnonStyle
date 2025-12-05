import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/image';

const Profile = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [looks, setLooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`https://anonstyle-api.onrender.com/api/looks/user/${username}`);
                setProfileData(res.data.user);
                setLooks(res.data.looks);
                setLoading(false);

                // Check if current user is owner
                const token = localStorage.getItem('token');
                if (token) {
                    const meRes = await axios.get('https://anonstyle-api.onrender.com/api/users/me', {
                        headers: { 'x-auth-token': token }
                    });
                    if (meRes.data.username === username) {
                        setIsOwner(true);
                    }
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this look?')) {
            try {
                await axios.delete(`https://anonstyle-api.onrender.com/api/looks/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setLooks(looks.filter(look => look._id !== id));
            } catch (err) {
                console.error(err);
                alert('Error deleting look');
            }
        }
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading profile...</div>;
    if (!profileData) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>User not found</div>;

    return (
        <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
            <div className="container">

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 20px',
                        background: '#222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        {profileData.mainImage ? (
                            <img src={getImageUrl(profileData.mainImage)} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '40px', color: '#555' }}>{username[0].toUpperCase()}</span>
                        )}
                    </div>

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

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        <span>{looks.length} Looks</span>
                        {/* Placeholder for followers/following */}
                        <span>0 Followers</span>
                        <span>0 Following</span>
                    </div>
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
                                            src={getImageUrl(look.imageUrl)}
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
