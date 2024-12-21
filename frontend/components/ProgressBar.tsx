"use client"

import React from 'react'

const ProgressBar = () => {
    return (
        <div className="flex  flex-col items-center py-8">
            <div>45%</div>
            <progress
                value={45}
                max={100}
                className="w-full"
                style={{
                    height: '8px',
                    borderRadius: '999px',
                }}
            />
            <div className="flex justify-between w-full pt-8" >
                <div>
                    <h3 className="font-semibold text-sm md:text-lg lg:text-xl">Goal</h3>
                    <h4 className="text-sm md:text-lg lg:text-xl text-[#B5B4BC]">KShs. 40,000/=</h4>
                </div>
                <div>
                    <h3 className="font-semibold text-sm md:text-lg lg:text-xl">Raised</h3>
                    <h4 className="text-sm md:text-lg lg:text-xl text-[#B5B4BC]">KShs. 15,000/=</h4>
                </div>
                <div>
                    <h3 className="font-semibold text-sm md:text-lg lg:text-xl">To go</h3>
                    <h4 className="text-sm md:text-lg lg:text-xl text-[#B5B4BC]">KShs. 25,000/=</h4>
                </div>

            </div>
        </div>
    )
}

export default ProgressBar
