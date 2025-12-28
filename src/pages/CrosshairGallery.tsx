import { useEffect, useState } from 'react';
import Section from '../components/ui/Section';
import { CrosshairCard } from '../components/crosshair/CrosshairCard';
import { Crosshair, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCrosshairs } from '../services/api';
import type { ProCrosshair } from '../data/crosshairs';

const CrosshairGallery = () => {
    const [crosshairs, setCrosshairs] = useState<ProCrosshair[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const data = await fetchCrosshairs();
                setCrosshairs(data);
            } catch (error) {
                console.error("Failed to fetch crosshairs", error);
            } finally {
                setLoading(false);
            }
        };
        loadCounts();
    }, []);

    return (
        <div className="min-h-screen bg-valo-dark pt-20 pb-10 flex flex-col relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-5 pointer-events-none" />
            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-valo-cyan/10 blur-[120px] rounded-full pointer-events-none" />

            <Section className="relative z-10 max-w-7xl mx-auto flex-1 flex flex-col w-full h-full p-4 md:p-6 !py-6">
                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-valo-cyan/20 rounded border border-valo-cyan/50 text-valo-cyan">
                            <Crosshair size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-oswald text-white uppercase leading-none mb-2">Pro Crosshairs</h1>
                            <p className="text-white/40 font-rajdhani text-sm md:text-base uppercase tracking-widest">
                                Visualize. Click. Copy. Dominate.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/crosshairs/add"
                            className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-bold uppercase transition-transform hover:scale-105 hover:bg-white/20 border border-white/10"
                        >
                            Add Pro
                        </Link>
                        <Link
                            to="/crosshair/create"
                            className="flex items-center gap-2 bg-valo-red text-white px-6 py-3 rounded-lg font-bold uppercase transition-transform hover:scale-105 hover:bg-red-600 shadow-lg shadow-valo-red/20"
                        >
                            <Plus size={20} /> Create New
                        </Link>
                    </div>
                </header>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-valo-red" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {crosshairs.map((data, idx) => (
                            <CrosshairCard key={idx} data={data} />
                        ))}

                        {/* Placeholder for "Submit Yours" or "More Coming Soon" */}
                        <div className="border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-8 text-white/20 min-h-[250px] hover:bg-white/5 transition-colors cursor-pointer group">
                            <Crosshair size={48} className="mb-4 opacity-50 group-hover:scale-110 transition-transform" />
                            <span className="font-rajdhani uppercase tracking-widest text-sm">More Pros Incoming...</span>
                        </div>
                    </div>
                )}
            </Section>
        </div>
    );
};

export default CrosshairGallery;
