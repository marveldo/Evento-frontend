import React from 'react'




export default function Sidebar(){
    return (
        <div  className='md:flex hidden flex-col max-[1200px]:px-10 min-[1300px]:px-24 max-[1290px]:px-14 max-[870px]:px-4 gap-y-10'>
            <div className='flex items-center gap-x-3'>
                <h1 className='font-montserrat font-[600] text-[48px]'>Settings</h1>
                <div className='h-[0px] border-[#3C3C3C] border-[1px] w-[61px]'></div>
            </div>
           <div className='ps-2 font-nunito flex flex-col gap-y-7 font-[400] text-[20px]'>
           <div className='p-3 bg-[#FCEEE7] rounded-[8px]'>Account</div>
            <div className='p-3 rounded-[8px]'>Data & Security</div>
            <div className='p-3 rounded-[8px]'>Notifications</div>
            <div className='p-3 rounded-[8px]'>Preferences</div>
            <div className='p-3 text-[#F04438]'>Delete Account</div>
            
           </div>


        </div>
    )
}

