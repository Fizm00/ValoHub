import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useLocation, Link } from 'react-router-dom';
import 'lenis/dist/lenis.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const lenisRef = useRef<Lenis | null>(null);
    const location = useLocation();

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
                <div className="flex gap-8 uppercase font-bold text-sm tracking-widest text-white/70">
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
                    <Link to="/squad-builder" className="hover:text-yellow-400 text-yellow-500 transition-colors relative group">
                        Squad
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full" />
                    </Link>
                    <Link to="/crosshairs" className="hover:text-green-400 text-green-500 transition-colors relative group">
                        Crosshairs
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-green-400 transition-all group-hover:w-full" />
                    </Link>
                </div>
            </nav>

            <main className="flex-grow pt-20">
                {children}
            </main>

            <footer className="w-full py-8 border-t border-white/10 text-center text-white/30 text-xs uppercase tracking-widest">
                ValoHub &copy; 2025 // Fizm Fun Project
            </footer>
        </div>
    );
};

export default MainLayout;
