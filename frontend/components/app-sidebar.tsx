"use client"

import React, { useEffect, useState } from "react"
import { Home, Plus, Search, LucideIcon } from "lucide-react"

import { Button } from "./ui/button"
import CreateCampaign from "./CreateCampaign"


interface MenuItem {
    title: string;
    url?: string;
    icon: LucideIcon;
    action?: 'dialog';
}

// Menu items.
const items: MenuItem[] = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Search",
        url: "/search",
        icon: Search,
    },
    {
        title: "Create",
        icon: Plus,
        action: "dialog" as const
    },
]

export function AppSidebar(): JSX.Element {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    const handleItemClick = (item: MenuItem, e: React.MouseEvent<HTMLButtonElement>): void => {
        if (item.action === "dialog") {
            e.preventDefault()
            setIsDialogOpen(true)
        }
    }

    const handleClose = (): void => {
        const dialog = document.querySelector('[data-dialog="animated-dialog"]') as HTMLElement
        const backdrop = document.querySelector('[data-dialog-backdrop="animated-dialog"]') as HTMLElement

        if (dialog && backdrop) {
            backdrop.classList.add('pointer-events-none', 'opacity-0')
            const mountClasses = dialog.getAttribute('data-dialog-mount')?.split(' ') || []
            const unmountClasses = dialog.getAttribute('data-dialog-unmount')?.split(' ') || []
            dialog.classList.remove(...mountClasses)
            dialog.classList.add(...unmountClasses)

            setTimeout(() => {
                setIsDialogOpen(false)
            }, 300)
        }
    }

    useEffect(() => {
        if (isDialogOpen) {
            // Add event listeners when dialog opens
            const closeButtons = document.querySelectorAll('[data-dialog-close="true"]')
            const backdrop = document.querySelector('[data-dialog-backdrop-close="true"]')

            const handleBackdropClick = (e: Event) => {
                if ((e.target as HTMLElement) === (e.currentTarget as HTMLElement)) handleClose()
            }

            closeButtons.forEach(button => {
                button.addEventListener('click', handleClose)
            })

            backdrop?.addEventListener('click', handleBackdropClick)

            // Cleanup listeners when dialog closes
            return () => {
                closeButtons.forEach(button => {
                    button.removeEventListener('click', handleClose)
                })
                backdrop?.removeEventListener('click', handleBackdropClick)
            }
        }
    }, [isDialogOpen])


    return (
        <>
            <div className="flex md:flex-col md:h-screen justify-center border-t-[0.2px] md:border-r-[0.2px] sticky md:top-0 bottom-0 backdrop-blur-md bg-white/30 z-10">
                {items.map((item) => (
                    <div key={item.title} className="">
                        <Button
                            className="flex m-1 h-10 md:h-12 md:rounded-full rounded-2xl"
                            onClick={(e) => handleItemClick(item, e)}
                        >
                            {item.action === "dialog" ? (
                                <div className="flex gap-2 items-center">
                                    <item.icon className="" />
                                    <p className="md:hidden font-medium">{item.title}</p>
                                </div>
                            ) : (
                                <a href={item.url} className="flex gap-2 items-center">
                                    <item.icon className="" />
                                    <p className="md:hidden font-medium">{item.title}</p>
                                </a>
                            )}
                        </Button>
                    </div>
                ))}
            </div>

            {isDialogOpen && <CreateCampaign isOpen={isDialogOpen} onClose={handleClose} />}
        </>
    )
}
