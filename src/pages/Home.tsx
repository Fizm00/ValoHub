import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/home/Hero';
import Section from '../components/ui/Section';
import { TechCard } from '../components/ui/TechCard';
import { Button } from '../components/ui/Button';
import { Marquee } from '../components/ui/Marquee';
import { StatCounter } from '../components/ui/StatCounter';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Home = () => {
    const cardsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useGSAP(() => {
        if (!cardsRef.current) return;

        gsap.from(cardsRef.current.children, {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
            }
        });

    }, { scope: cardsRef });

    return (
        <div className="w-full">
            <Hero />

            {/* Live Ticker */}
            <div className="border-y border-white/10 bg-valo-black/50 backdrop-blur-sm z-20 relative">
                <Marquee className="py-3 text-white/50 font-rajdhani text-sm uppercase tracking-widest" speed={40}>
                    <span className="mx-8"> // Patch 11.11 Live Now </span>
                    <span className="mx-8 text-valo-red"> // Bug Agent Fixes </span>
                    <span className="mx-8"> // Valorant Radiant International Invitational Result </span>
                    <span className="mx-8 text-valo-cyan"> // VP Gifting is Now Live! </span>
                    <span className="mx-8"> // Night Market Ending Soon </span>
                    <span className="mx-8 text-valo-red"> // Premier: Sign-ups Open </span>
                </Marquee>
            </div>

            <Section centered className="bg-valo-gray z-10 relative">
                <div className="absolute top-20 left-10 opacity-5 pointer-events-none">
                    <h1 className="text-[200px] font-oswald font-bold leading-none text-outline-black">TACTICAL</h1>
                </div>

                <div className="max-w-6xl mx-auto w-full relative z-10">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl md:text-6xl font-oswald font-bold text-white mb-4 uppercase">
                            Dominate the <span className="text-valo-red">Competition</span>
                        </h2>
                        <p className="text-white/60 font-rajdhani max-w-2xl mx-auto text-lg">
                            Access the most comprehensive database of Valorant knowledge.
                            Master every efficient lineup, learn every ability.
                        </p>
                    </div>

                    <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TechCard active className="h-full min-h-[400px] flex flex-col group cursor-pointer hover:bg-valo-dark/50 transition-colors relative overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[url('https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt511598aa966e604f/665675e184f9334dd1636c7a/Abyss_Screenshot_13_4k.jpg')] bg-cover bg-center mix-blend-overlay" />

                            <div className="flex-1 relative z-10">
                                <div className="text-6xl mb-6 opacity-20 font-oswald font-bold text-valo-red group-hover:translate-x-2 transition-transform">01</div>
                                <h3 className="text-4xl font-oswald text-white mb-3 uppercase tracking-wider group-hover:text-valo-red transition-colors">Agents</h3>
                                <p className="text-white/50 mb-8 leading-relaxed font-rajdhani">
                                    Deep dive into every agent's kit. Controller, Duelist, Initiator, Sentinel - find your role and master it.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                fullWidth
                                className="group-hover:bg-valo-red group-hover:border-valo-red group-hover:text-white relative z-10"
                                onClick={() => navigate('/agents')}
                            >
                                View Roster
                            </Button>
                        </TechCard>

                        <TechCard className="h-full min-h-[400px] flex flex-col group cursor-pointer hover:bg-valo-dark/50 transition-colors relative overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[url('https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt76974db37a2845c4/5eb7cdc66f6a7061af2d8d69/V_Maps_Ascent_LI.jpg')] bg-cover bg-center mix-blend-overlay" />

                            <div className="flex-1 relative z-10">
                                <div className="text-6xl mb-6 opacity-20 font-oswald font-bold text-white group-hover:translate-x-2 transition-transform">02</div>
                                <h3 className="text-4xl font-oswald text-white mb-3 uppercase tracking-wider group-hover:text-valo-cyan transition-colors">Maps</h3>
                                <p className="text-white/50 mb-8 leading-relaxed font-rajdhani">
                                    Interactive maps with callouts, lineups, and strategy zones. Never get lost in the rotation again.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                fullWidth
                                className="group-hover:bg-valo-cyan group-hover:border-valo-cyan group-hover:text-black relative z-10"
                                onClick={() => navigate('/maps')}
                            >
                                Explore Maps
                            </Button>
                        </TechCard>

                        <TechCard className="h-full min-h-[400px] flex flex-col group cursor-pointer hover:bg-valo-dark/50 transition-colors relative overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[url('https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt9e7102717758652d/601b31d0fd7f7422f735848e/Vandal_KeyArt.png')] bg-cover bg-center mix-blend-overlay" />

                            <div className="flex-1 relative z-10">
                                <div className="text-6xl mb-6 opacity-20 font-oswald font-bold text-white group-hover:translate-x-2 transition-transform">03</div>
                                <h3 className="text-4xl font-oswald text-white mb-3 uppercase tracking-wider group-hover:text-valo-red transition-colors">Arsenal</h3>
                                <p className="text-white/50 mb-8 leading-relaxed font-rajdhani">
                                    Comprehensive weapon stats, recoil patterns, and skin showcases. Know your firepower.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                fullWidth
                                className="group-hover:bg-valo-red group-hover:border-valo-red group-hover:text-white relative z-10"
                                onClick={() => navigate('/weapons')}
                            >
                                View Arsenal
                            </Button>
                        </TechCard>
                    </div>
                </div>
            </Section>

            <Section className="bg-valo-dark border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <StatCounter value={24} className="text-6xl md:text-8xl font-oswald font-bold text-white block mb-2" />
                        <span className="text-valo-red uppercase tracking-widest text-sm font-bold">Agents Unlocked</span>
                    </div>
                    <div>
                        <StatCounter value={11} className="text-6xl md:text-8xl font-oswald font-bold text-outline-valo block mb-2" />
                        <span className="text-white/50 uppercase tracking-widest text-sm font-bold">Maps Available</span>
                    </div>
                    <div>
                        <StatCounter value={18} className="text-6xl md:text-8xl font-oswald font-bold text-white block mb-2" />
                        <span className="text-valo-cyan uppercase tracking-widest text-sm font-bold">Weapons Ready</span>
                    </div>
                    <div>
                        <StatCounter value={100} className="text-6xl md:text-8xl font-oswald font-bold text-outline-valo block mb-2" suffix="M+" />
                        <span className="text-white/50 uppercase tracking-widest text-sm font-bold">Players Active</span>
                    </div>
                </div>
            </Section>

            <Section centered className="py-32 bg-valo-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-valo-red/10 to-transparent pointer-events-none" />
                <div className="text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-oswald font-bold text-white uppercase mb-8">
                        Ready to <span className="text-outline-valo">Rank Up?</span>
                    </h2>
                    <Button
                        variant="primary"
                        size="lg"
                        className="px-12 py-8 text-xl"
                        onClick={() => navigate('/agents')}
                    >
                        Start Training
                    </Button>
                </div>
            </Section>
        </div>
    );
};


export default Home;
