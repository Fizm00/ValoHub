
import React, { useState } from 'react';
import type { ProCrosshair } from '../../data/crosshairs';
import { CrosshairPreview } from './CrosshairPreview';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Edit3 } from 'lucide-react';

interface CrosshairCardProps {
    data: ProCrosshair;
}

export const CrosshairCard: React.FC<CrosshairCardProps> = ({ data }) => {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleCopy = () => {
        navigator.clipboard.writeText(data.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCustomize = () => {
        navigate('/crosshair/create', { state: { config: data.config, player: data.player } });
    };

    return (
        <div className="group relative bg-[#1c1c1c] border border-white/10 rounded-xl overflow-hidden hover:border-valo-red/50 transition-all duration-300">
            <div className="h-48 relative overflow-hidden bg-[#2a2a2a]">
                <div
                    className="absolute inset-0 bg-[url('/maps/ascent_splash.jpg')] bg-cover bg-center opacity-30 grayscale blur-[2px] transition-all duration-500 group-hover:scale-110 group-hover:opacity-40"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />

                <div className="absolute inset-0 z-10">
                    <CrosshairPreview config={data.config} scale={1} />
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <button
                        onClick={handleCustomize}
                        className="bg-valo-red text-white px-4 py-2 rounded-lg font-bold uppercase transform scale-90 transition-transform hover:scale-100 flex items-center gap-2 shadow-lg shadow-valo-red/20"
                    >
                        <Edit3 size={16} /> Customize
                    </button>
                </div>
            </div>

            <div className="p-4 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-oswald text-xl uppercase leading-none mb-1">{data.player}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-valo-red font-bold text-xs bg-valo-red/10 px-1.5 py-0.5 rounded border border-valo-red/20">
                            {data.team}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleCopy}
                    className={`p-3 rounded-lg transition-all active:scale-95 ${copied
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
            </div>
        </div>
    );
};
