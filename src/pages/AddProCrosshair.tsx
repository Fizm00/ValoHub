import { useState, useEffect } from 'react';
import Section from '../components/ui/Section';
import { CrosshairPreview } from '../components/crosshair/CrosshairPreview';
import { parseCrosshairCode } from '../utils/crosshairParser';
import type { CrosshairConfig } from '../data/crosshairs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProCrosshair = () => {
    const navigate = useNavigate();
    const [player, setPlayer] = useState('');
    const [team, setTeam] = useState('');
    const [code, setCode] = useState('');
    const [config, setConfig] = useState<CrosshairConfig | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (code.trim().length > 5) {
            try {
                const parsed = parseCrosshairCode(code);
                setConfig(parsed);
            } catch (e) {
            }
        }
    }, [code]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config || !player || !team) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/crosshairs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player,
                    team,
                    code,
                    config,
                    isPro: true
                })
            });

            if (response.ok) {
                navigate('/crosshairs');
            } else {
                alert('Failed to save crosshair');
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-valo-dark pt-20 pb-10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-valo-red/5 blur-[150px] rounded-full pointer-events-none" />

            <Section className="relative z-10 max-w-4xl mx-auto w-full p-4">
                <Link to="/crosshairs" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={16} /> Back to Gallery
                </Link>

                <h1 className="text-4xl font-oswald text-white uppercase mb-8">Add Pro Crosshair</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-valo-black/50 border border-white/10 rounded-xl p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white/70 text-sm font-bold uppercase mb-2">Pro Player Name</label>
                                <input
                                    type="text"
                                    value={player}
                                    onChange={(e) => setPlayer(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-valo-red outline-none transition-colors"
                                    placeholder="e.g. TenZ"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm font-bold uppercase mb-2">Team Name (Short)</label>
                                <input
                                    type="text"
                                    value={team}
                                    onChange={(e) => setTeam(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-valo-red outline-none transition-colors"
                                    placeholder="e.g. SEN"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm font-bold uppercase mb-2">Crosshair Code</label>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-valo-red outline-none transition-colors font-mono text-sm h-32 resize-none"
                                    placeholder="0;s;1;P;c;5..."
                                    required
                                />
                                <p className="text-xs text-white/30 mt-2">Paste the code from Valorant or a pro settings site.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !config}
                                className="w-full bg-valo-red text-white font-bold uppercase py-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Saving...' : <><Save size={20} /> Submit to Database</>}
                            </button>
                        </form>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h2 className="text-white/70 text-sm font-bold uppercase">Live Preview</h2>
                        <div className="flex-1 min-h-[300px] bg-[#1c1c1c] rounded-xl border border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('/maps/ascent_splash.jpg')] bg-cover bg-center opacity-50 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                {config ? (
                                    <CrosshairPreview config={config} scale={3} />
                                ) : (
                                    <div className="text-white/20 font-rajdhani uppercase tracking-widest text-sm">
                                        Paste code to preview
                                    </div>
                                )}
                            </div>
                        </div>

                        {config && (
                            <div className="p-4 bg-black/40 rounded border border-white/5 text-xs font-mono text-green-400 overflow-x-auto">
                                <span className="text-white/50 block mb-1">PARSED CONFIG:</span>
                                {JSON.stringify(config, null, 2)}
                            </div>
                        )}
                    </div>
                </div>

            </Section>
        </div>
    );
};

export default AddProCrosshair;
