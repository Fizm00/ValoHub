import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Edit2, Save, X, Crosshair, Users, Bookmark, Trash2, Map as MapIcon, Loader } from 'lucide-react';
import { CrosshairCard } from '../components/crosshair/CrosshairCard';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { getSavedCrosshairs, getSavedSkins, getSavedSquads, deleteSavedSquad, toggleSavedSkin, toggleSavedCrosshair } from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, token, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'crosshairs' | 'squads' | 'skins'>('overview');

    // Data State
    const [savedCrosshairs, setSavedCrosshairs] = useState<any[]>([]);
    const [savedSkins, setSavedSkins] = useState<any[]>([]);
    const [savedSquads, setSavedSquads] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Edit Form State
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Fetch Data on Load
    const [deleteModal, setDeleteModal] = useState<{ type: 'crosshair' | 'skin' | 'squad', id: string, extraData?: any } | null>(null);

    // Fetch Data on Load
    useEffect(() => {
        if (token) {
            fetchSavedItems();
        }
    }, [token, activeTab]);

    const fetchSavedItems = async () => {
        if (!token) return;
        setLoadingData(true);
        try {
            const [crosshairs, skins, squads] = await Promise.all([
                getSavedCrosshairs(token),
                getSavedSkins(token),
                getSavedSquads(token)
            ]);
            setSavedCrosshairs(Array.isArray(crosshairs) ? crosshairs : []);
            setSavedSkins(Array.isArray(skins) ? skins : []);
            setSavedSquads(Array.isArray(squads) ? squads : []);
        } catch (error) {
            console.error("Failed to fetch saved items", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!token || !deleteModal) return;

        const { type, id } = deleteModal;

        try {
            if (type === 'squad') {
                await deleteSavedSquad(id, token);
                setSavedSquads(prev => prev.filter(s => s._id !== id));
            } else if (type === 'crosshair') {
                await toggleSavedCrosshair(id, token);
                setSavedCrosshairs(prev => prev.filter(c => c._id !== id));
                const validSaves = user!.savedCrosshairs?.filter(cid => cid !== id);
                updateUser({ ...user!, savedCrosshairs: validSaves });
            } else if (type === 'skin') {
                await toggleSavedSkin(id, token);
                setSavedSkins(prev => prev.filter(s => (s.uuid !== id && s._id !== id)));
                const validSaves = user!.savedSkins?.filter((s: any) => {
                    const sId = typeof s === 'string' ? s : (s.uuid || s._id);
                    return sId !== id;
                });
                updateUser({ ...user!, savedSkins: validSaves });
            }
        } catch (error) {
            console.error(`Failed to delete ${type}`, error);
        } finally {
            setDeleteModal(null);
        }
    };

    // Removed direct handleDeleteSquad, moving logic to handleConfirmDelete

    if (!user) return <div className="pt-32 text-center text-white">Please login to view profile.</div>;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Update failed');

            updateUser(data.result);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-valo-dark pt-24 pb-12 relative overflow-hidden font-rajdhani">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-valo-red/5 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-valo-cyan/5 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow delay-1000" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-12">

                {/* Header Section: Player Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-valo-red/10 to-valo-dark blur-3xl rounded-full opacity-50 pointer-events-none" />

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative Lines */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-valo-red to-transparent opacity-50" />
                        <div className="absolute bottom-0 right-0 w-32 h-1 bg-valo-cyan opacity-50" />

                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-valo-red to-valo-dark shadow-2xl relative z-10">
                                    <div className="w-full h-full bg-valo-dark rounded-full flex items-center justify-center overflow-hidden border-4 border-valo-black">
                                        <User size={64} className="text-valo-white/80 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                </div>
                                {/* Rank/Level Badge */}
                                <div className="absolute -bottom-2 -right-2 bg-valo-black border border-white/10 text-white text-xs font-bold px-3 py-1 rounded shadow-lg flex items-center gap-2 z-20">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    LVL 150
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-oswald text-white uppercase tracking-tighter leading-none mb-2">
                                        {user.username}
                                    </h1>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-white/50 text-sm font-medium tracking-widest uppercase">
                                        <span className="flex items-center gap-2"><Shield size={14} className="text-valo-red" /> #{user._id.slice(-6).toUpperCase()}</span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span className="flex items-center gap-2 decoration-valo-cyan/50"><Mail size={14} /> {user.email}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold uppercase tracking-widest rounded transition-all hover:border-valo-red/50 flex items-center gap-2"
                                    >
                                        {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>
                            </div>

                            {/* Quick Global Stats (Decor) */}
                            <div className="hidden md:flex gap-8 border-l border-white/10 pl-8 opacity-70">
                                <div className="text-center">
                                    <div className="text-3xl font-oswald text-white mb-1">2,341</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40">Matches</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-oswald text-valo-red mb-1">IMMORTAL</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/40">Rank</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-8">
                    {/* Navigation Tabs */}
                    <div className="flex justify-center md:justify-start border-b border-white/10">
                        <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-1">
                            {['overview', 'crosshairs', 'squads', 'skins'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`relative pb-4 px-2 text-sm md:text-base font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/70'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTabLine"
                                            className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-valo-red to-valo-orange-500 shadow-[0_0_10px_rgba(255,70,85,0.5)]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="min-h-[400px]"
                        >
                            {isEditing ? (
                                <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                                    <h3 className="text-2xl font-oswald text-white uppercase mb-8 flex items-center gap-3 decoration-valo-red underline underline-offset-8">
                                        <Edit2 size={24} className="text-valo-red" /> Edit Identity
                                    </h3>
                                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                                        {/* Inputs with modern styling */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2 group">
                                                <label className="text-xs uppercase text-valo-red font-bold tracking-widest group-focus-within:text-white transition-colors">Callsign (Username)</label>
                                                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full bg-white/5 border-b border-white/20 p-3 text-white focus:border-valo-red outline-none transition-colors font-oswald tracking-wide text-lg" />
                                            </div>
                                            <div className="space-y-2 group">
                                                <label className="text-xs uppercase text-valo-cyan font-bold tracking-widest group-focus-within:text-white transition-colors">Comms (Email)</label>
                                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/5 border-b border-white/20 p-3 text-white focus:border-valo-border outline-none transition-colors font-oswald tracking-wide text-lg" />
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-6">
                                            <div className="text-xs font-bold uppercase text-white/20 tracking-[0.2em]">Security Protocol</div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2 group">
                                                    <label className="text-xs uppercase text-white/40 tracking-widest group-focus-within:text-white transition-colors">Current Key</label>
                                                    <input type="password" placeholder="••••••••" value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} className="w-full bg-white/5 border-b border-white/20 p-3 text-white focus:border-valo-red outline-none transition-colors" />
                                                </div>
                                                <div className="space-y-2 group">
                                                    <label className="text-xs uppercase text-white/40 tracking-widest group-focus-within:text-white transition-colors">New Key</label>
                                                    <input type="password" placeholder="Optional" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} className="w-full bg-white/5 border-b border-white/20 p-3 text-white focus:border-valo-red outline-none transition-colors" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-8">
                                            <button type="submit" disabled={loading} className="bg-valo-red hover:bg-white hover:text-black text-white px-10 py-3 font-oswald font-bold uppercase tracking-widest transition-all clip-corner-1 flex items-center gap-3">
                                                {loading ? <Loader className="animate-spin" /> : <Save size={20} />}
                                                {loading ? 'Processing...' : 'Save Changes'}
                                            </button>
                                        </div>
                                        {message && <div className={`text-center text-sm uppercase tracking-widest font-bold ${message.type === 'success' ? 'text-green-400' : 'text-valo-red'}`}>{message.text}</div>}
                                    </form>
                                </div>
                            ) : (
                                <>
                                    {loadingData ? (
                                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                                            <Loader className="animate-spin text-valo-red" size={48} />
                                            <div className="text-xs text-white/30 uppercase tracking-[0.3em]">Accessing Database...</div>
                                        </div>
                                    ) : (
                                        <>
                                            {activeTab === 'overview' && (
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {[
                                                        { title: 'Crosshairs', val: savedCrosshairs.length, icon: Crosshair, color: 'text-valo-red', set: 'crosshairs' },
                                                        { title: 'Squads', val: savedSquads.length, icon: Users, color: 'text-valo-cyan', set: 'squads' },
                                                        { title: 'Skins', val: savedSkins.length, icon: Bookmark, color: 'text-yellow-400', set: 'skins' }
                                                    ].map((stat, i) => (
                                                        <motion.div
                                                            key={i}
                                                            whileHover={{ scale: 1.02 }}
                                                            onClick={() => setActiveTab(stat.set as any)}
                                                            className="bg-white/5 backdrop-blur-sm border border-white/5 p-8 relative overflow-hidden group cursor-pointer hover:bg-white/10 transition-colors"
                                                        >
                                                            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color} group-hover:scale-110 duration-500`}>
                                                                <stat.icon size={120} />
                                                            </div>
                                                            <div className="relative z-10">
                                                                <div className={`mb-4 ${stat.color} p-3 bg-white/5 rounded-lg w-fit`}><stat.icon size={32} /></div>
                                                                <div className="text-5xl font-oswald text-white mb-2">{stat.val}</div>
                                                                <div className="text-sm uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">Saved {stat.title}</div>
                                                            </div>
                                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-valo-red/50 transition-all" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}

                                            {activeTab === 'crosshairs' && (
                                                savedCrosshairs.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {savedCrosshairs.map((crosshair: any) => (
                                                            <div key={crosshair._id || crosshair.id} className="relative group">
                                                                <CrosshairCard data={crosshair} />
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDeleteModal({ type: 'crosshair', id: crosshair._id });
                                                                    }}
                                                                    className="absolute top-4 right-4 z-40 p-2 bg-black/60 hover:bg-valo-red text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <EmptyState type="crosshairs" />
                                            )}

                                            {activeTab === 'squads' && (
                                                savedSquads.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {savedSquads.map((squad: any) => (
                                                            <div key={squad._id} className="bg-gradient-to-r from-white/5 to-transparent border-l-4 border-valo-cyan p-6 flex flex-col md:flex-row items-center justify-between hover:bg-white/10 transition-all group">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-4 mb-3">
                                                                        <h3 className="text-2xl font-oswald text-white uppercase">{squad.name}</h3>
                                                                        <span className="bg-valo-cyan/20 text-valo-cyan px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                                                                            <MapIcon size={12} /> {squad.map}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex -space-x-3 pl-2">
                                                                        {squad.agents.map((agentId: string, i: number) => (
                                                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-valo-dark bg-white/10 overflow-hidden relative" title={agentId}>
                                                                                <img src={`https://media.valorant-api.com/agents/${agentId}/displayicon.png`} className="w-full h-full object-cover scale-110" onError={e => e.currentTarget.style.display = 'none'} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-6 mt-4 md:mt-0">
                                                                    <div className="text-right">
                                                                        <div className="text-[10px] uppercase text-white/30 tracking-widest">Created</div>
                                                                        <div className="text-white/60 font-mono text-xs">{new Date(squad.createdAt).toLocaleDateString()}</div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => setDeleteModal({ type: 'squad', id: squad._id })}
                                                                        className="p-3 bg-white/5 hover:bg-valo-red text-white rounded transition-colors"
                                                                    >
                                                                        <Trash2 size={20} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <EmptyState type="squads" />
                                            )}

                                            {activeTab === 'skins' && (
                                                savedSkins.length > 0 ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                        {savedSkins.map((skin: any) => (
                                                            <div key={skin._id || skin.uuid} className="relative group">
                                                                <Link to="/skins" className="block bg-gradient-to-b from-white/5 to-transparent border border-white/5 rounded-xl overflow-hidden aspect-[4/3] flex flex-col transition-all hover:border-yellow-400/50 hover:shadow-[0_10px_40px_-10px_rgba(250,204,21,0.2)]">
                                                                    <div className="flex-1 flex items-center justify-center p-6 relative">
                                                                        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                        <img
                                                                            src={skin.displayIcon || skin.levels?.[0]?.displayIcon}
                                                                            alt={skin.displayName}
                                                                            className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-2 transition-all duration-500"
                                                                        />
                                                                    </div>
                                                                    <div className="p-4 bg-black/40 backdrop-blur border-t border-white/5 relative overflow-hidden">
                                                                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                                                        <h4 className="text-sm font-bold font-rajdhani text-white/80 group-hover:text-yellow-400 truncate uppercase tracking-wider text-center group-hover:translate-x-1 transition-transform">
                                                                            {skin.displayName}
                                                                        </h4>
                                                                    </div>
                                                                </Link>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDeleteModal({ type: 'skin', id: skin.uuid || skin._id });
                                                                    }}
                                                                    className="absolute top-3 right-3 z-20 p-2 bg-black/50 hover:bg-valo-red text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <EmptyState type="skins" />
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!deleteModal}
                title="Confirm Removal"
                message={`Are you sure you want to remove this ${deleteModal?.type}? This action cannot be undone.`}
                confirmText="Remove"
                isDangerous={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModal(null)}
            />
        </div>
    );
};

const EmptyState = ({ type }: { type: string }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-xl">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20">
            {type === 'crosshairs' && <Crosshair size={32} />}
            {type === 'squads' && <Users size={32} />}
            {type === 'skins' && <Bookmark size={32} />}
        </div>
        <h3 className="text-xl font-oswald text-white uppercase mb-2">No {type} saved yet</h3>
        <p className="text-white/40 max-w-md text-sm">
            Start exploring the Armory and Maps to save your favorite loadouts.
        </p>
    </div>
);

export default Profile;
