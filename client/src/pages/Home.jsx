import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Feed from '../components/Feed';

const Home = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    if (isLoggedIn) {
        return <Feed />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '0' }}>
            {/* Hero Section */}
            <section style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: '0 20px'
            }}>
                {/* Animated Background Gradient */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60vw',
                        height: '60vw',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)',
                        pointerEvents: 'none'
                    }}
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ textAlign: 'center', zIndex: 1 }}
                >
                    <motion.h2 variants={itemVariants} style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4em',
                        marginBottom: '20px',
                        color: 'var(--text-secondary)'
                    }}>
                        The New Standard
                    </motion.h2>

                    <motion.div variants={itemVariants}>
                        <h1 className="hero-title" style={{
                            lineHeight: 0.9,
                            marginBottom: '40px',
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic'
                        }}>
                            Curate <br />
                            <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300 }}>Your Taste</span>
                        </h1>
                    </motion.div>

                    <motion.div variants={itemVariants} style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        {isLoggedIn ? (
                            <Link to="/dashboard" className="btn-fashion">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn-fashion">
                                    Join Us
                                </Link>
                                <Link to="/login" className="btn-outline">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </section>

            {/* Marquee / Statement Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                style={{ padding: '100px 0', borderTop: '1px solid #111' }}
            >
                <div className="container">
                    <div className="statement-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                        <div>
                            <motion.h3
                                initial={{ x: -50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                style={{ fontSize: '40px', marginBottom: '30px' }}
                            >
                                Minimalism is not a lack of something. <br />
                                <span style={{ color: '#555' }}>It’s simply the perfect amount of something.</span>
                            </motion.h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <motion.p
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.8 }}
                            >
                                AnonStyle is the premier destination for digital curation.
                                Build your personal archive of looks, share exclusive finds,
                                and define your aesthetic with a platform built for the modern visionary.
                            </motion.p>
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;
