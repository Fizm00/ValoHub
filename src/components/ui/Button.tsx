import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {

        const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden clip-corner-1";

        const variants = {
            primary: "bg-valo-red text-white hover:bg-red-600 border border-transparent shadow-[0_0_10px_rgba(255,70,85,0.5)] hover:shadow-[0_0_20px_rgba(255,70,85,0.7)]",
            secondary: "bg-valo-gray text-white border border-valo-white/20 hover:border-valo-red hover:text-valo-red",
            outline: "bg-transparent border border-valo-white/50 text-white hover:bg-white/10 hover:border-white",
            ghost: "bg-transparent text-white hover:text-valo-red hover:bg-white/5",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs",
            md: "h-11 px-6 text-sm",
            lg: "h-14 px-8 text-base",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth ? "w-full" : "",
                    className
                )}
                {...props}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {children as React.ReactNode}
                </span>

                {variant === 'primary' && (
                    <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
