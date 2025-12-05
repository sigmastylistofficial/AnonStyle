import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Lock, Bell, Shield, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null); // null = main menu
    const [user, setUser] = useState(null);

    // Form States
    const [profileForm, setProfileForm] = useState({ username: '', caption: '' });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
    const [settingsForm, setSettingsForm] = useState({ notifications: true, privacy: false });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('https://anonstyle-api.onrender.com/api/users/me', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setUser(res.data);
                setProfileForm({ username: res.data.username, caption: res.data.mainImageCaption || '' });
                if (res.data.settings) {
                    setSettingsForm(res.data.settings);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', profileForm.username);
            formData.append('caption', profileForm.caption);
            // Image handling would go here if we added a file input to this form

            await axios.put('https://anonstyle-api.onrender.com/api/users/profile', formData, {
                headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' }
            });
            alert('Profile updated');
            setActiveSection(null);
        } catch (err) {
            alert(err.response?.data?.msg || 'Error updating profile');
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        try {
            await axios.put('https://anonstyle-api.onrender.com/api/users/password', passwordForm, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            alert('Password updated');
            setPasswordForm({ oldPassword: '', newPassword: '' });
            setActiveSection(null);
        } catch (err) {
            alert(err.response?.data?.msg || 'Error updating password');
        }
    };

    const updateSettings = async (key, value) => {
        const newSettings = { ...settingsForm, [key]: value };
        setSettingsForm(newSettings);
        try {
            await axios.put('https://anonstyle-api.onrender.com/api/users/settings', { [key]: value }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const sections = [
        { id: 'profile', icon: User, label: 'Edit Profile', desc: 'Change your bio and username' },
        { id: 'password', icon: Lock, label: 'Password & Security', desc: 'Manage your password' },
        { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Choose what you want to hear about' },
        { id: 'privacy', icon: Shield, label: 'Privacy', desc: 'Control who sees your content' },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 style={{ marginBottom: '30px' }}>Edit Profile</h2>
                        <form onSubmit={updateProfile}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Username</label>
                                <input
                                    type="text"
                                    value={profileForm.username}
                                    onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                                    className="input-minimal"
                                />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Bio</label>
                                <input
                                    type="text"
                                    value={profileForm.caption}
                                    onChange={e => setProfileForm({ ...profileForm, caption: e.target.value })}
                                    className="input-minimal"
                                />
                            </div>
                            <button type="submit" className="btn-fashion">Save Changes</button>
                        </form>
                    </motion.div>
                );
            case 'password':
                return (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 style={{ marginBottom: '30px' }}>Change Password</h2>
                        <form onSubmit={updatePassword}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.oldPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                    className="input-minimal"
                                />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="input-minimal"
                                />
                            </div>
                            <button type="submit" className="btn-fashion">Update Password</button>
                        </form>
                    </motion.div>
                );
            case 'notifications':
                return (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 style={{ marginBottom: '30px' }}>Notifications</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#111', borderRadius: '8px' }}>
                            <span>Push Notifications</span>
                            <div
                                onClick={() => updateSettings('notifications', !settingsForm.notifications)}
                                style={{
                                    width: '50px',
                                    height: '26px',
                                    background: settingsForm.notifications ? '#fff' : '#333',
                                    borderRadius: '13px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: settingsForm.notifications ? '#000' : '#fff',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: settingsForm.notifications ? '26px' : '2px',
                                    transition: 'left 0.3s'
                                }} />
                            </div>
                        </div>
                    </motion.div>
                );
            case 'privacy':
                return (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h2 style={{ marginBottom: '30px' }}>Privacy</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#111', borderRadius: '8px' }}>
                            <div>
                                <span style={{ display: 'block' }}>Private Account</span>
                                <span style={{ fontSize: '12px', color: '#666' }}>Only followers can see your looks</span>
                            </div>
                            <div
                                onClick={() => updateSettings('privacy', !settingsForm.privacy)}
                                style={{
                                    width: '50px',
                                    height: '26px',
                                    background: settingsForm.privacy ? '#fff' : '#333',
                                    borderRadius: '13px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: settingsForm.privacy ? '#000' : '#fff',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: settingsForm.privacy ? '26px' : '2px',
                                    transition: 'left 0.3s'
                                }} />
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px', maxWidth: '600px', margin: '0 auto' }}>
            <div className="container">

                {activeSection ? (
                    <div>
                        <button
                            onClick={() => setActiveSection(null)}
                            style={{ background: 'none', border: 'none', color: '#888', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', cursor: 'pointer' }}
                        >
                            <ArrowLeft size={20} /> Back
                        </button>
                        {renderSection()}
                    </div>
                ) : (
                    <>
                        <h1 style={{ fontSize: '32px', marginBottom: '40px', fontFamily: 'var(--font-serif)' }}>Settings</h1>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {sections.map((item, index) => (
                                <motion.div
                                    key={index}
                                    onClick={() => setActiveSection(item.id)}
                                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <item.icon size={24} color="#888" />
                                        <div>
                                            <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{item.label}</h3>
                                            <p style={{ fontSize: '12px', color: '#666' }}>{item.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} color="#444" />
                                </motion.div>
                            ))}

                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ x: 5, backgroundColor: 'rgba(255, 50, 50, 0.1)' }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255, 50, 50, 0.2)',
                                    background: 'none',
                                    marginTop: '40px',
                                    width: '100%',
                                    textAlign: 'left',
                                    color: '#ff4444'
                                }}
                            >
                                <LogOut size={24} />
                                <div>
                                    <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>Log Out</h3>
                                    <p style={{ fontSize: '12px', opacity: 0.7 }}>Sign out of your account</p>
                                </div>
                            </motion.button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Settings;
