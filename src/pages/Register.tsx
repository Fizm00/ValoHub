import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, User, Loader2 } from 'lucide-react';
import Section from '../components/ui/Section';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type RegisterFormValues } from '../lib/validations';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setServerError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Registration failed');
            }

            login(responseData);
            navigate('/');
        } catch (err: any) {
            setServerError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-valo-dark pt-20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-5 pointer-events-none" />
            <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-valo-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <Section className="relative z-10 w-full max-w-md p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-valo-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl relative"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-oswald text-white uppercase mb-2">Initiate Protocol</h1>
                        <p className="text-white/50 text-sm font-rajdhani">Create your agent identity</p>
                    </div>

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-3 rounded mb-6 text-center">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-valo-cyan transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Agent Name (Username)"
                                    {...register('username')}
                                    className={`w-full bg-white/5 border ${errors.username ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-12 pr-4 text-white focus:border-valo-cyan outline-none transition-colors placeholder:text-white/20 font-rajdhani`}
                                />
                            </div>
                            {errors.username && <p className="text-red-400 text-xs pl-1">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-valo-cyan transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    {...register('email')}
                                    className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-12 pr-4 text-white focus:border-valo-cyan outline-none transition-colors placeholder:text-white/20 font-rajdhani`}
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs pl-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-valo-cyan transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register('password')}
                                    className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-12 pr-4 text-white focus:border-valo-cyan outline-none transition-colors placeholder:text-white/20 font-rajdhani`}
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-xs pl-1">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-valo-cyan transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...register('confirmPassword')}
                                    className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-12 pr-4 text-white focus:border-valo-cyan outline-none transition-colors placeholder:text-white/20 font-rajdhani`}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-xs pl-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-valo-cyan/80 hover:bg-valo-cyan text-black font-bold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    Register <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-white/40 text-xs font-rajdhani">
                            Already have an identity?{' '}
                            <Link to="/login" className="text-valo-cyan hover:underline decoration-valo-cyan underline-offset-4">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </Section>
        </div>
    );
};

export default Register;
