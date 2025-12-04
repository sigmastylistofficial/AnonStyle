import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [formData, setFormData] = useState({ imageUrl: '', title: '', links: [{ title: '', url: '' }] });
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/login');
    }, [navigate]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onLinkChange = (index, e) => {
        const newLinks = formData.links.map((link, i) => {
            if (i === index) return { ...link, [e.target.name]: e.target.value };
            return link;
        });
        setFormData({ ...formData, links: newLinks });
    };

    const addLink = () => setFormData({ ...formData, links: [...formData.links, { title: '', url: '' }] });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
            await axios.post('http://localhost:5000/api/looks', formData, config);
            alert('Look created!');
            setFormData({ imageUrl: '', title: '', links: [{ title: '', url: '' }] });
        } catch (err) {
            console.error(err);
            alert('Error creating look');
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <h2 style={{ marginBottom: '30px' }}>Create New Look</h2>
            <div className="glass-panel" style={{ padding: '30px' }}>
                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <input type="text" name="title" placeholder="Look Title" value={formData.title} onChange={onChange} className="input-field" />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={onChange} className="input-field" required />
                    </div>
                    <h3 style={{ marginBottom: '15px' }}>Links</h3>
                    {formData.links.map((link, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input type="text" name="title" placeholder="Link Title" value={link.title} onChange={e => onLinkChange(index, e)} className="input-field" />
                            <input type="text" name="url" placeholder="URL" value={link.url} onChange={e => onLinkChange(index, e)} className="input-field" />
                        </div>
                    ))}
                    <button type="button" onClick={addLink} style={{ color: '#888', marginBottom: '20px', display: 'block' }}>+ Add Link</button>
                    <button type="submit" className="btn-primary">Post Look</button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
