import React from 'react'
import CampaignForm from "./CampaignForm";

interface CreateCampaignProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateCampaign: React.FC<CreateCampaignProps> = ({ isOpen, onClose }) => {
    return (
        <div
            data-dialog-backdrop="animated-dialog"
            data-dialog-backdrop-close="true"
            className={`fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                data-dialog="animated-dialog"
                data-dialog-mount="opacity-100 translate-y-0 scale-100"
                data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-none"
                data-dialog-transition="transition-all duration-300"
                className="relative m-4 p-4 w-5/6 md:w-2/5 md:min-w-[40%] md:max-w-[40%] rounded-lg bg-white shadow-sm"
            >
                <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
                    Create A New Campaign
                </div>



                <CampaignForm />



            </div>
        </div>
    )
}

export default CreateCampaign