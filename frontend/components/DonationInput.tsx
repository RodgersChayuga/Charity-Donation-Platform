import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "./ui/button"
import { ArrowRight, ForwardIcon, MailOpen } from "lucide-react"

const DonationInput = () => {
    return (
        <div className="flex flex-col gap-8 ">
            <p className="text-[#4c964d] dark:text-[#c9e9ca] text-xs lg:text-md">Ex: KShs. 1 = 0.0000023 Eth</p>
            <div className="grid w-full items-center gap-1.5 ">
                <Label htmlFor="number" className="font-bold">Donation Amount</Label>
                <Input type="text" inputMode="numeric" id="number" placeholder="KShs. XX" className="w-full" />
            </div>
            <ToggleGroup type="single" className="flex flex-1 w-full justify-between">
                <ToggleGroupItem value={`${100}`} aria-label={`Toggle ${100}`} className="border border-[#9C9AFF] hover:bg-[#acabf9]">
                    <h4 className="text-sm md:text-md lg:text-lg">KShs. 100</h4>
                </ToggleGroupItem>
                <ToggleGroupItem value={`${150}`} aria-label={`Toggle ${150}`} className="border border-[#9C9AFF] hover:bg-[#acabf9]">
                    <h4 className="text-xs md:text-lg lg:text-xl">KShs. 150</h4>
                </ToggleGroupItem>
                <ToggleGroupItem value={`${200}`} aria-label={`Toggle ${200}`} className="border border-[#9C9AFF] hover:bg-[#acabf9]">
                    <h4 className="text-xs md:text-md lg:text-lg">KShs. 200</h4>
                </ToggleGroupItem>
                <ToggleGroupItem value={`${500}`} aria-label={`Toggle ${500}`} className="border border-[#9C9AFF] hover:bg-[#acabf9]">
                    <h4 className="text-xs md:text-md lg:text-lg">KShs. 500</h4>
                </ToggleGroupItem>
                <ToggleGroupItem value={`${1000}`} aria-label={`Toggle ${1000}`} className="border border-[#9C9AFF] hover:bg-[#acabf9]">
                    <h4 className="text-xs md:text-md lg:text-lg">KShs. 1000</h4>
                </ToggleGroupItem>
            </ToggleGroup>
            <Button className="bg-[#9C9AFF] hover:bg-[#acabf9]">
                Donate Now <ArrowRight />
            </Button>
        </div>
    )
}
export default DonationInput