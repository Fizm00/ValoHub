import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import 'lenis/dist/lenis.css';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const lenisRef = useRef<Lenis | null>(null);
    const location = useLocation();
    const navigate = useNavigate(); // For redirect
    const { user, logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
        navigate('/'); // Redirect to homepage
    };

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        lenisRef.current?.scrollTo(0, { immediate: true });
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-valo-dark text-valo-white font-rajdhani flex flex-col">
            <nav className="fixed top-0 left-0 w-full h-20 z-50 border-b border-white/10 bg-valo-dark/80 backdrop-blur-md flex items-center px-8 justify-between">
                <Link to="/" className="text-2xl font-oswald font-bold tracking-tighter text-valo-red uppercase cursor-pointer hover:opacity-80 transition-opacity">ValoHub</Link>

                <div className="flex items-center gap-8">
                    <div className="flex gap-6 uppercase font-bold text-sm tracking-widest text-white/70">
                        <Link to="/agents" className="hover:text-valo-red transition-colors relative group">
                            Agents
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-valo-red transition-all group-hover:w-full" />
                        </Link>
                        <Link to="/maps" className="hover:text-valo-cyan transition-colors relative group">
                            Maps
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-valo-cyan transition-all group-hover:w-full" />
                        </Link>
                        <Link to="/weapons" className="hover:text-white transition-colors relative group">
                            Weapons
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all group-hover:w-full" />
                        </Link>
                        <Link to="/skins" className="hover:text-pink-400 transition-colors relative group">
                            Skins
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-pink-400 transition-all group-hover:w-full" />
                        </Link>
                        <Link to="/squad-builder" className="hover:text-yellow-400 text-yellow-500 transition-colors relative group">
                            Squad
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full" />
                        </Link>
                        <Link to="/crosshairs" className="hover:text-green-400 text-green-500 transition-colors relative group">
                            Crosshairs
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-green-400 transition-all group-hover:w-full" />
                        </Link>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                            <Link to="/profile" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="w-8 h-8 rounded bg-valo-red/20 flex items-center justify-center text-valo-red border border-valo-red/50">
                                    <UserIcon size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-white/40 uppercase tracking-wider leading-none">Agent</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-wide leading-none">{user.username}</span>
                                </div>
                            </Link>
                            <button
                                onClick={handleLogoutClick}
                                className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-6 py-2 bg-valo-red hover:bg-red-600 text-white text-sm font-bold uppercase tracking-widest skew-x-[-10deg] transition-all hover:skew-x-[-12deg] active:scale-95 border border-transparent hover:border-white/20">
                            <span className="skew-x-[10deg] inline-block">Login</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-valo-dark border border-white/10 p-8 max-w-sm w-full relative shadow-2xl"
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-valo-red" />

                            <h3 className="text-xl font-oswald text-white uppercase mb-4 tracking-wide">Confirm Logout</h3>
                            <p className="text-white/60 mb-8 font-rajdhani">Are you sure you want to sign out of the protocol?</p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-3 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 py-3 bg-valo-red text-white font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-grow pt-20">
                {children}
            </main>

            <footer className="w-full py-8 border-t border-white/10 text-center text-white/30 text-xs uppercase tracking-widest">
                ValoHub &copy; 2025 // Fizm Fun Project
            </footer>
        </div >
    );
};

export default MainLayout;
