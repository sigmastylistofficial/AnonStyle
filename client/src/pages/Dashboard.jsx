import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Upload, User, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
    const [lookData, setLookData] = useState({ title: '', links: [{ title: '', url: '', image: null }] });
    const [lookImage, setLookImage] = useState(null);
    const [profileData, setProfileData] = useState({ caption: '' });
    const [profileImage, setProfileImage] = useState(null);
    const [activeTab, setActiveTab] = useState('look');
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/login');
    }, [navigate]);

    const onLookChange = e => setLookData({ ...lookData, [e.target.name]: e.target.value });

    const onLinkChange = (index, e) => {
        const newLinks = lookData.links.map((link, i) => {
            if (i === index) return { ...link, [e.target.name]: e.target.value };
            return link;
        });
        setLookData({ ...lookData, links: newLinks });
    };

    const onLinkImageChange = (index, file) => {
        const newLinks = lookData.links.map((link, i) => {
            if (i === index) return { ...link, image: file };
            return link;
        });
        setLookData({ ...lookData, links: newLinks });
    };

    const addLink = () => setLookData({ ...lookData, links: [...lookData.links, { title: '', url: '', image: null }] });

    const removeLink = (index) => {
        const newLinks = lookData.links.filter((_, i) => i !== index);
        setLookData({ ...lookData, links: newLinks });
    };

    const onLookSubmit = async e => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', lookData.title);
            if (lookImage) formData.append('mainImage', lookImage);
            else {
                alert('Please upload a main look image');
                return;
            }

            // Prepare links and item images
            // We need to map which image belongs to which link.
            // We'll send links as JSON, but add an 'imageIndex' property to link objects
            // that points to the index in the 'itemImages' file array.

            const linksToSend = [];
            let imageCounter = 0;

            lookData.links.forEach(link => {
                const linkObj = { title: link.title, url: link.url };
                if (link.image) {
                    formData.append('itemImages', link.image);
                    linkObj.imageIndex = imageCounter;
                    imageCounter++;
                }
                linksToSend.push(linkObj);
            });

            formData.append('links', JSON.stringify(linksToSend));

            const config = { headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' } };
            await axios.post('http://localhost:4000/api/looks', formData, config);
            alert('Look created!');
            setLookData({ title: '', links: [{ title: '', url: '', image: null }] });
            setLookImage(null);
        } catch (err) {
            console.error(err);
            alert('Error creating look');
        }
    };

    const onProfileSubmit = async e => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (profileData.caption) formData.append('caption', profileData.caption);
            if (profileImage) formData.append('mainImage', profileImage);

            const config = { headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' } };
            await axios.put('http://localhost:4000/api/users/profile', formData, config);
            alert('Profile updated!');
        } catch (err) {
            console.error(err);
            alert('Error updating profile');
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                    <button
                        onClick={() => setActiveTab('look')}
                        className={activeTab === 'look' ? 'btn-fashion' : 'btn-outline'}
                    >
                        New Look
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={activeTab === 'profile' ? 'btn-fashion' : 'btn-outline'}
                    >
                        Edit Profile
                    </button>
                </div>

                {activeTab === 'look' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 style={{ fontSize: '42px', marginBottom: '60px' }}>New Look</h2>

                        <form onSubmit={onLookSubmit}>
                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', color: '#666' }}>Title</label>
                                <input type="text" name="title" placeholder="E.g. Summer Evening" value={lookData.title} onChange={onLookChange} className="input-minimal" />
                            </div>

                            <div style={{ marginBottom: '60px' }}>
                                <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', color: '#666' }}>Main Look Image (Required)</label>
                                <div style={{ border: '1px dashed #333', padding: '40px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => document.getElementById('lookImageInput').click()}>
                                    {lookImage ? (
                                        <div style={{ position: 'relative', height: '300px' }}>
                                            <img
                                                src={URL.createObjectURL(lookImage)}
                                                alt="Preview"
                                                style={{ height: '100%', objectFit: 'contain', margin: '0 auto', display: 'block' }}
                                            />
                                            <p style={{ marginTop: '10px' }}>{lookImage.name}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={32} style={{ marginBottom: '10px', color: '#666' }} />
                                            <p style={{ color: '#666' }}>Click to upload main image</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    id="lookImageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setLookImage(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Items</h3>

                                {lookData.links.map((link, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        style={{
                                            background: '#111',
                                            padding: '20px',
                                            borderRadius: '8px',
                                            marginBottom: '20px',
                                            position: 'relative'
                                        }}
                                    >
                                        <button type="button" onClick={() => removeLink(index)} style={{ position: 'absolute', top: '10px', right: '10px', color: '#666' }}>
                                            <X size={20} />
                                        </button>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', marginBottom: '5px', color: '#666' }}>Item Name</label>
                                                <input type="text" name="title" placeholder="e.g. Black Boots" value={link.title} onChange={e => onLinkChange(index, e)} className="input-minimal" style={{ fontSize: '16px', padding: '10px 0' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', marginBottom: '5px', color: '#666' }}>Link URL</label>
                                                <input type="text" name="url" placeholder="https://..." value={link.url} onChange={e => onLinkChange(index, e)} className="input-minimal" style={{ fontSize: '16px', padding: '10px 0' }} />
                                            </div>
                                        </div>

                                        {/* Item Image Upload */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div
                                                onClick={() => document.getElementById(`itemImage-${index}`).click()}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    border: '1px dashed #444',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    overflow: 'hidden',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                {link.image ? (
                                                    <img src={URL.createObjectURL(link.image)} alt="Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <ImageIcon size={20} color="#444" />
                                                )}
                                            </div>
                                            <input
                                                id={`itemImage-${index}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={e => onLinkImageChange(index, e.target.files[0])}
                                                style={{ display: 'none' }}
                                            />
                                            <span style={{ fontSize: '12px', color: '#666' }}>
                                                {link.image ? 'Image selected' : 'Add optional item image'}
                                            </span>
                                        </div>

                                    </motion.div>
                                ))}

                                <button type="button" onClick={addLink} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '20px', color: 'var(--text-primary)' }}>
                                    <Plus size={18} /> Add Item
                                </button>
                            </div>

                            <div style={{ marginTop: '80px', textAlign: 'right' }}>
                                <button type="submit" className="btn-fashion">Publish Look</button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 style={{ fontSize: '42px', marginBottom: '60px' }}>Edit Profile</h2>

                        <form onSubmit={onProfileSubmit}>
                            <div style={{ marginBottom: '60px' }}>
                                <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', color: '#666' }}>Main Profile Image</label>
                                <div style={{ border: '1px dashed #333', padding: '40px', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('profileImageInput').click()}>
                                    {profileImage ? (
                                        <p>{profileImage.name}</p>
                                    ) : (
                                        <>
                                            <User size={32} style={{ marginBottom: '10px', color: '#666' }} />
                                            <p style={{ color: '#666' }}>Click to upload main image</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    id="profileImageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setProfileImage(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', color: '#666' }}>Caption / Bio</label>
                                <input type="text" placeholder="Tell us about your style..." value={profileData.caption} onChange={e => setProfileData({ ...profileData, caption: e.target.value })} className="input-minimal" />
                            </div>

                            <div style={{ marginTop: '40px', textAlign: 'right' }}>
                                <button type="submit" className="btn-fashion">Save Profile</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
