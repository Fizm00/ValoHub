import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TechCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    active?: boolean;
}

const TechCard = React.forwardRef<HTMLDivElement, TechCardProps>(
    ({ className, children, active, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "relative bg-valo-gray/80 border border-white/10 p-6 clip-corner-2 transition-colors duration-300",
                    active ? "border-valo-red shadow-[0_0_15px_-5px_var(--color-valo-red)]" : "hover:border-white/30",
                    className
                )}
                {...props}
            >
                <div className="absolute top-0 left-0 w-2 h-2 bg-white/20" />
                <div className="absolute top-0 right-0 w-8 h-[1px] bg-white/20" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-white/20" />
                <div className="absolute bottom-0 left-0 w-[1px] h-4 bg-white/20" />

                {children}
            </motion.div>
        );
    }
);

TechCard.displayName = "TechCard";

export { TechCard };
