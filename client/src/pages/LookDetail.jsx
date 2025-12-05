import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, ArrowLeft } from 'lucide-react';

const LookDetail = () => {
    const { id } = useParams();
    const [look, setLook] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUserId = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user.id : null;

    useEffect(() => {
        const fetchLook = async () => {
            try {
                // We need an endpoint to get a single look. 
                // Since we don't have one explicitly, we can fetch all looks for user or feed and filter, 
                // BUT it's better to add a GET /api/looks/:id endpoint.
                // For now, let's assume we add that endpoint or filter from feed if needed.
                // Actually, let's add the endpoint to backend first.
                // Wait, I can't edit backend in this step easily without context switch.
                // Let's try to fetch from feed and find it? No, inefficient.
                // I will add the endpoint in the next step.
                // For now, I will write the frontend code assuming the endpoint exists.
                const res = await axios.get(`https://anonstyle-api.onrender.com/api/looks/${id}`);
                setLook(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLook();
    }, [id]);

    const handleLike = async () => {
        try {
            const res = await axios.put(`https://anonstyle-api.onrender.com/api/looks/${id}/like`, {}, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setLook({ ...look, likes: res.data });
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;
    if (!look) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Look not found</div>;

    const isLiked = look.likes.includes(currentUserId);

    return (
        <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                <Link to={`/u/${look.user.username}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: '#888', textDecoration: 'none' }}>
                    <ArrowLeft size={20} /> Back to Profile
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={getImageUrl(look.imageUrl)} alt={look.title} style={{ width: '100%', display: 'block' }} />
                        </div>
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#333' }}>
                                {look.user.mainImage ? (
                                    <img src={getImageUrl(look.user.mainImage)} alt={look.user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {look.user.username[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '18px', margin: 0 }}>{look.title}</h2>
                                <Link to={`/u/${look.user.username}`} style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>@{look.user.username}</Link>
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <button
                                onClick={handleLike}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isLiked ? '#ff3040' : 'inherit', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                            >
                                <Heart size={24} fill={isLiked ? '#ff3040' : 'none'} />
                                {look.likes.length} likes
                            </button>
                        </div>

                        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '20px' }}>Shop the Look</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {look.links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        padding: '15px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                >
                                    {link.imageUrl ? (
                                        <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={getImageUrl(link.imageUrl)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', borderRadius: '4px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <ExternalLink size={20} color="#555" />
                                        </div>
                                    )}

                                    <div style={{ flex: 1 }}>
                                        <span style={{ display: 'block', fontSize: '14px', fontWeight: 500 }}>{link.title}</span>
                                        <span style={{ display: 'block', fontSize: '12px', color: '#666', marginTop: '2px' }}>View Product</span>
                                    </div>
                                    <ExternalLink size={16} color="#666" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LookDetail;
