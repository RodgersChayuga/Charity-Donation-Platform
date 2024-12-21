'use client';

import Image from 'next/image';

export default function LazyImage({ src, alt, className }: { src: string; alt: string; className: string }) {
    return (
        <div className={`h-[500px] relative ${className}`}>
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
            <Image
                src={src}
                alt={alt}
                fill
                loading="lazy"
                onLoad={(e) => {
                    const image = e.currentTarget;
                    image.classList.remove('opacity-0');
                }}
                className="object-cover rounded-md opacity-0 transition-opacity duration-300"
            />
        </div>
    );
} 