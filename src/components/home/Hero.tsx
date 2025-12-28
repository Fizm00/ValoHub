import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import HeroBackground from './HeroBackground';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const textRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(textRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.5
        })
            .from(subRef.current, {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.8");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-valo-dark">
            <HeroBackground />

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                {/* Animated Glitch/Main Title */}
                <h1 ref={textRef} className="text-7xl md:text-9xl font-oswald font-bold tracking-tighter text-white mb-6 uppercase leading-none">
                    <span className="text-outline-valo block md:inline">Valo</span>
                    <span className="text-valo-red block md:inline md:ml-4">Hub</span>
                </h1>

                <p ref={subRef} className="text-lg md:text-2xl text-valo-white/70 font-rajdhani tracking-widest uppercase mb-10 max-w-2xl mx-auto">
                    The tactical edge you need. <span className="text-valo-cyan">Maps</span>, <span className="text-valo-red">Agents</span>, <span className="text-white">Arsenal</span>.
                </p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center"
                >
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-48 text-lg clip-corner-1"
                        onClick={() => navigate('/agents')}
                    >
                        Enter Hub
                    </Button>
                    <Button variant="outline" size="lg" className="w-48 text-lg">
                        Watch Trailer
                    </Button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-valo-red to-white/0" />
            </motion.div>
        </div>
    );
};

export default Hero;
