import React from 'react'

const CampaignForm = () => {
    return (
        <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
            <form className="flex flex-col gap-4 mx-auto">
                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Campaign Title</label>
                <input type="text" id="text" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Campaign Title..." />

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">

                        <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Target Amount</label>
                        <input type="text" id="text" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="KES. 1,000,0000 | 2.27 ETH" />
                    </div>

                    <div className="flex-1">

                        <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Campaign Duration</label>
                        <input type="text" id="text" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="24 hours | 86,400 seconds" />
                    </div>
                </div>

                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Campaign Description</label>
                <textarea id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Campaign description..."></textarea>


                <div className="flex flex-col  justify-center w-full">
                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Campaign cover Image</label>
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div>
                <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                    <button
                        data-dialog-close="true"
                        className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        data-dialog-close="true"
                        className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                        type="button"
                    >
                        Create
                    </button>
                </div>
            </form>

        </div>
    )
}

export default CampaignForm;