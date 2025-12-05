import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ExternalLink, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/image';

const Feed = ({ searchQuery = '' }) => {
    const [looks, setLooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user.id : null;

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                setLoading(true);
                const url = searchQuery
                    ? `https://anonstyle-api.onrender.com/api/looks/feed?q=${encodeURIComponent(searchQuery)}`
                    : 'https://anonstyle-api.onrender.com/api/looks/feed';

                const res = await axios.get(url);
                setLooks(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        // Debounce if search query is present
        const timeoutId = setTimeout(() => {
            fetchFeed();
        }, searchQuery ? 500 : 0);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleLike = async (lookId) => {
        try {
            const res = await axios.put(`https://anonstyle-api.onrender.com/api/looks/${lookId}/like`, {}, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });

            setLooks(looks.map(look => {
                if (look._id === lookId) {
                    return { ...look, likes: res.data };
                }
                return look;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading feed...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '100px', paddingBottom: '100px' }}>
            {looks.map((look, index) => {
                const isLiked = look.likes.includes(currentUserId);

                return (
                    <motion.div
                        key={look._id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{ marginBottom: '80px', borderBottom: '1px solid #222', paddingBottom: '40px' }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                            <Link to={`/u/${look.user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {look.user.mainImage ? (
                                        <img src={getImageUrl(look.user.mainImage)} alt={look.user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '12px' }}>{look.user.username[0].toUpperCase()}</span>
                                    )}
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>{look.user.username}</span>
                            </Link>
                        </div>

                        {/* Main Image */}
                        <div style={{ marginBottom: '15px', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={getImageUrl(look.imageUrl)} alt={look.title} style={{ width: '100%', display: 'block' }} />
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                            <button
                                onClick={() => handleLike(look._id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isLiked ? '#ff3040' : 'inherit', transition: 'color 0.2s' }}
                            >
                                <Heart size={24} fill={isLiked ? '#ff3040' : 'none'} />
                                <span style={{ fontSize: '14px' }}>{look.likes.length}</span>
                            </button>
                        </div>

                        {/* Caption */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{look.title}</h3>
                        </div>

                        {/* Items */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {look.links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: '#111',
                                        padding: '8px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        color: '#ccc',
                                        textDecoration: 'none',
                                        border: '1px solid #333'
                                    }}
                                >
                                    {link.imageUrl && (
                                        <img src={getImageUrl(link.imageUrl)} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                                    )}
                                    {link.title}
                                    <ExternalLink size={10} />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default Feed;
