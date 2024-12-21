import React from 'react'
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="flex gap-6 flex-wrap items-center justify-center text-[#B5B4BC] text-sm md:text-lg lg:text-xl py-4 " >
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-[#B5B4BC] text-xs md:text-lg lg:text-xl"
                href="https://x.com/BlockchainDocta"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="https://nextjs.org/icons/file.svg"
                    alt="File icon"
                    width={16}
                    height={16}
                />
                X (Twitter)
            </a>
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-[#B5B4BC] text-xs md:text-lg lg:text-xl"
                href="https://github.com/RodgersChayuga/Charity-Donation-Platform"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="https://nextjs.org/icons/window.svg"
                    alt="Window icon"
                    width={16}
                    height={16}
                />
                GitHub Repo
            </a>
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-[#B5B4BC] text-xs md:text-lg lg:text-xl"
                href="https://rodgerschayuga.com"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    aria-hidden
                    src="https://nextjs.org/icons/globe.svg"
                    alt="Globe icon"
                    width={16}
                    height={16}
                />
                Portfolio site →
            </a>
        </footer>
    )
}

export default Footer