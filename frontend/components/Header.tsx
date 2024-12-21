'use client';

import Image from 'next/image';
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";

export default function Header() {
    return (
        <div className="flex justify-between  w-full items-center border-b-[0.5px] py-4">
            <div className="flex p-2 rounded-md">

                <div className={`h-[50px] w-[50px] relative `}>
                    <Image
                        src='/logo/logo.png'
                        alt='Blockchain Doctor Logo'
                        fill
                        loading="lazy"
                        onLoad={(e) => {
                            const image = e.currentTarget;
                            image.classList.remove('opacity-0');
                        }}
                        className="object-cover rounded-md opacity-0 transition-opacity duration-300" />
                </div>
                <div className="hidden items-end -gap-4 md:flex flex-col px-2">
                    <h3 className="md:text-lg lg:text-2xl font-bold dark:text-white">BLOCKCHAIN <span className="text-green-400">DOCTA</span></h3>
                    <p className="dark:text-white md:text-sm lg:text-md">By Rodgers Chayuga</p>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <Button className="bg-[#912fdb] hover:bg-[#acabf9]">
                    Connect <ArrowUp />
                </Button>
                <ModeToggle />
            </div>
        </div>
    );
} 