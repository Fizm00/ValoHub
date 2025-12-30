import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDangerous?: boolean; // Colors button red if true
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isDangerous = false
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onCancel} // Close on backdrop click
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-valo-dark border border-white/10 p-8 max-w-sm w-full relative shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-valo-red" />

                        <h3 className="text-xl font-oswald text-white uppercase mb-4 tracking-wide">{title}</h3>
                        <p className="text-white/60 mb-8 font-rajdhani">{message}</p>

                        <div className="flex gap-4">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-3 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 py-3 font-bold uppercase tracking-widest text-white transition-colors ${isDangerous
                                        ? 'bg-valo-red hover:bg-red-600'
                                        : 'bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
