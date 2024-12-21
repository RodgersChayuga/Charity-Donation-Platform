"use client"

import React from 'react'

const ProgressBar = () => {
    const percentage = 80; // fetch percentage from smart contract

    return (
        <div className="flex flex-col items-center pt-8">
            <div className='w-full py-4 '>
                <div className='mb-12'>
                    <div className='bg-white relative h-2.5 w-full rounded-2xl'>
                        <div className={`bg-orange-500 absolute top-0 left-0 h-full  rounded-2xl`}
                            style={{ width: `${percentage}%` }}>
                            <span className='bg-black dark:bg-white absolute -right-4 bottom-full mb-2 rounded-sm px-3.5 py-1 text-sm text-white dark:text-black'>
                                <span className='bg-primary absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm'></span>
                                {percentage}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between w-full pt-4" >
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
