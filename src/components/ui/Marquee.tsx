import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import gsap from 'gsap';

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    speed?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({ children, className, speed = 20 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current || !containerRef.current) return;

        const contentWidth = contentRef.current.offsetWidth;

        gsap.to(contentRef.current, {
            x: -contentWidth / 2,
            duration: speed,
            ease: "none",
            repeat: -1
        });

    }, [speed, children]);

    return (
        <div ref={containerRef} className={cn("overflow-hidden whitespace-nowrap flex w-full select-none", className)}>
            <div ref={contentRef} className="flex">
                {children}
                {children}
            </div>
        </div>
    );
};
