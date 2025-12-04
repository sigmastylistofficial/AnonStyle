import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ fontSize: '64px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-2px' }}
            >
                Elevate Your Style.
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ fontSize: '24px', color: '#888', marginBottom: '40px' }}
            >
                The ultimate platform for modern stylists. Curate looks, share links, inspire the world.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <Link to="/register" className="btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
                    Get Started
                </Link>
            </motion.div>
        </div>
    );
};

export default Home;
