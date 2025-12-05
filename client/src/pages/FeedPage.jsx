import { useState } from 'react';
import Feed from '../components/Feed';
import { Search } from 'lucide-react';

const FeedPage = () => {
    const [query, setQuery] = useState('');

    return (
        <div style={{ minHeight: '100vh', paddingTop: '0' }}>
            <div style={{
                position: 'fixed',
                top: '80px',
                left: 0,
                right: 0,
                zIndex: 90,
                background: 'rgba(3,3,3,0.9)',
                backdropFilter: 'blur(10px)',
                padding: '10px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                    <Search size={20} color="#666" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search looks or users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            background: '#111',
                            color: 'white',
                            fontSize: '16px',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Add padding to account for fixed search bar */}
            <div style={{ paddingTop: '60px' }}>
                <Feed searchQuery={query} />
            </div>
        </div>
    );
};

export default FeedPage;
